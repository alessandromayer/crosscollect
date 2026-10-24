-- Apply to isolated staging first. Production requires a separate reviewed rollout.
-- Table privileges complement RLS: clients cannot edit financial fields or ownership.
REVOKE ALL ON public.credores, public.dividas, public.historico_acoes, public.pagamentos_asaas
FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.credores, public.dividas, public.historico_acoes, public.pagamentos_asaas TO authenticated;
GRANT INSERT (
  credor_id, devedor_nome, devedor_doc, devedor_email, devedor_tel,
  devedor_cidade, devedor_estado, devedor_tipo, descricao, valor, moeda,
  valor_brl, taxa_cambio, data_vencimento, observacoes, regime_cobranca, status
) ON public.dividas TO authenticated;
GRANT UPDATE (status) ON public.dividas TO authenticated;
GRANT INSERT (divida_id, tipo, descricao, autor) ON public.historico_acoes TO authenticated;

DROP POLICY IF EXISTS historico_insert_own ON public.historico_acoes;
-- Permit only user-authored administrative events for debts owned by the caller.
CREATE POLICY historico_insert_own ON public.historico_acoes FOR INSERT TO authenticated
WITH CHECK (
  tipo IN ('cadastro', 'atualizacao') AND canal IS NULL AND valor IS NULL
  AND autor = COALESCE(auth.jwt()->>'email', auth.uid()::text)
  AND EXISTS (
    SELECT 1 FROM public.dividas d JOIN public.credores c ON c.id = d.credor_id
    WHERE d.id = historico_acoes.divida_id AND c.owner_user_id = (select auth.uid())
  )
);


-- Invoker triggers keep the caller's RLS and make direct writes obey the same rules.
CREATE OR REPLACE FUNCTION public.guard_debt_write()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF current_user = 'authenticated' THEN
    IF auth.uid() IS NULL THEN
      RAISE EXCEPTION USING ERRCODE = '42501', MESSAGE = 'Authentication required';
    END IF;
    IF TG_OP = 'INSERT' THEN
      IF NEW.status <> 'pendente' OR NEW.pago_em IS NOT NULL
         OR NEW.valor <= 0 OR btrim(NEW.devedor_nome) = ''
         OR btrim(NEW.devedor_doc) = '' OR btrim(NEW.descricao) = '' THEN
        RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'Invalid new debt';
      END IF;
    ELSE
      IF OLD.status = 'pago' AND NEW.status IS DISTINCT FROM OLD.status THEN
        RAISE EXCEPTION USING ERRCODE = 'PT409', MESSAGE = 'Paid debt cannot be reopened';
      END IF;
      IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status NOT IN
        ('pendente', 'em_negociacao', 'vencido', 'cancelado') THEN
        RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'Payment requires verified processing';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_debt_write()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF current_user = 'authenticated' THEN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO public.historico_acoes (divida_id, tipo, descricao, autor)
      VALUES (NEW.id, 'cadastro', 'Dívida cadastrada no sistema',
        COALESCE(auth.jwt()->>'email', auth.uid()::text));
    ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO public.historico_acoes (divida_id, tipo, descricao, autor)
      VALUES (NEW.id, 'atualizacao', format('Status alterado para "%s"', NEW.status),
        COALESCE(auth.jwt()->>'email', auth.uid()::text));
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.guard_debt_write(), public.audit_debt_write() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS guard_debt_write ON public.dividas;
CREATE TRIGGER guard_debt_write BEFORE INSERT OR UPDATE ON public.dividas
FOR EACH ROW EXECUTE FUNCTION public.guard_debt_write();
DROP TRIGGER IF EXISTS audit_debt_write ON public.dividas;
CREATE TRIGGER audit_debt_write AFTER INSERT OR UPDATE OF status ON public.dividas
FOR EACH ROW EXECUTE FUNCTION public.audit_debt_write();

-- A single RPC transaction prevents partial status changes if an audit insert fails.
-- Invoker permissions retain RLS. Ownership and inputs are also checked inside the RPC.
CREATE OR REPLACE FUNCTION public.update_debt_with_history(
  p_divida_id uuid, p_status text DEFAULT NULL, p_nota text DEFAULT NULL
) RETURNS SETOF public.dividas
LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $$
DECLARE
  debt public.dividas%ROWTYPE;
  note_text text := NULLIF(btrim(p_nota), '');
  actor text := COALESCE(auth.jwt()->>'email', auth.uid()::text);
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION USING ERRCODE = '42501', MESSAGE = 'Authentication required';
  END IF;
  IF (p_status IS NOT NULL AND p_status NOT IN ('pendente', 'em_negociacao', 'vencido', 'cancelado'))
     OR char_length(COALESCE(note_text, '')) > 2000
     OR (p_status IS NULL AND note_text IS NULL) THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'Invalid update';
  END IF;
  SELECT d.* INTO debt FROM public.dividas d
  JOIN public.credores c ON c.id = d.credor_id
  WHERE d.id = p_divida_id AND c.owner_user_id = auth.uid()
  FOR UPDATE OF d;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'PT404', MESSAGE = 'Debt not found';
  END IF;
  IF debt.status = 'pago' AND p_status IS NOT NULL THEN
    RAISE EXCEPTION USING ERRCODE = 'PT409', MESSAGE = 'Paid debt cannot be reopened';
  END IF;
  IF p_status IS NOT NULL THEN
    UPDATE public.dividas SET status = p_status WHERE id = debt.id RETURNING * INTO debt;
  END IF;
  IF note_text IS NOT NULL THEN
    INSERT INTO public.historico_acoes (divida_id, tipo, descricao, autor)
    VALUES (debt.id, 'atualizacao', note_text, actor);
  END IF;
  RETURN NEXT debt;
END;
$$;
REVOKE ALL ON FUNCTION public.update_debt_with_history(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_debt_with_history(uuid, text, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
