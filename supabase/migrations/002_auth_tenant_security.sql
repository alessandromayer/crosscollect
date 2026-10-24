-- Security migration: REVIEW BEFORE APPLYING TO SUPABASE.
-- Never apply without first reviewing existing tenant data and policies.
ALTER TABLE public.credores ADD COLUMN IF NOT EXISTS owner_user_id uuid REFERENCES auth.users(id);
CREATE UNIQUE INDEX IF NOT EXISTS credores_owner_user_id_key ON public.credores(owner_user_id) WHERE owner_user_id IS NOT NULL;
-- IMPORTANT: existing orphan records require review before enforcing NOT NULL.
-- Do not modify historical rows automatically.
DROP POLICY IF EXISTS allow_all_credores ON public.credores;
DROP POLICY IF EXISTS allow_all_dividas ON public.dividas;
DROP POLICY IF EXISTS allow_all_historico ON public.historico_acoes;
DROP POLICY IF EXISTS allow_all_pagamentos ON public.pagamentos_asaas;
CREATE POLICY credores_select_own ON public.credores FOR SELECT TO authenticated USING (owner_user_id = (select auth.uid()));
CREATE POLICY dividas_select_own ON public.dividas FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.credores c WHERE c.id = dividas.credor_id AND c.owner_user_id = (select auth.uid())));
CREATE POLICY dividas_insert_own ON public.dividas FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.credores c WHERE c.id = dividas.credor_id AND c.owner_user_id = (select auth.uid())));
CREATE POLICY dividas_update_own ON public.dividas FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.credores c WHERE c.id = dividas.credor_id AND c.owner_user_id = (select auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM public.credores c WHERE c.id = dividas.credor_id AND c.owner_user_id = (select auth.uid())));
CREATE POLICY historico_select_own ON public.historico_acoes FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.dividas d JOIN public.credores c ON c.id = d.credor_id WHERE d.id = historico_acoes.divida_id AND c.owner_user_id = (select auth.uid())));
CREATE POLICY pagamentos_select_own ON public.pagamentos_asaas FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.dividas d JOIN public.credores c ON c.id = d.credor_id WHERE d.id = pagamentos_asaas.divida_id AND c.owner_user_id = (select auth.uid())));
-- Signup must NOT automatically provide access to existing tenant records.
-- Provision verified pilot tenants using a reviewed administrative onboarding flow.

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
    INSERT INTO public.historico_acoes (divida_id, tipo, descricao, autor)
    VALUES (debt.id, 'atualizacao', format('Status alterado para "%s"', p_status), actor);
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
