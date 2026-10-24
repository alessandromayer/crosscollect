-- Run only in a disposable database after all proposed migrations.
-- All fixtures and the failure-injection trigger are rolled back.
BEGIN;
INSERT INTO auth.users(id) VALUES
 ('11111111-1111-4111-8111-111111111111'),
 ('22222222-2222-4222-8222-222222222222');
INSERT INTO public.credores(id,nome,email,owner_user_id) VALUES
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','Test A','a@example.invalid','11111111-1111-4111-8111-111111111111'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','Test B','b@example.invalid','22222222-2222-4222-8222-222222222222');
INSERT INTO public.dividas(id,credor_id,devedor_nome,devedor_doc,descricao,valor,status) VALUES
 ('aaaaaaaa-0000-4000-8000-000000000001','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','Fixture','test','Fixture A',100,'pendente'),
 ('aaaaaaaa-0000-4000-8000-000000000002','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','Fixture','test','Paid fixture',100,'pago'),
 ('bbbbbbbb-0000-4000-8000-000000000001','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','Fixture','test','Fixture B',100,'pendente');
CREATE FUNCTION public.test_reject_audit() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.descricao = 'force rollback' OR current_setting('crosscollect.test_reject_audit', true) = 'on' THEN RAISE EXCEPTION 'Injected audit failure'; END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER test_reject_audit BEFORE INSERT ON public.historico_acoes
FOR EACH ROW EXECUTE FUNCTION public.test_reject_audit();
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
SELECT set_config('request.jwt.claims','{"sub":"11111111-1111-4111-8111-111111111111","email":"a@example.invalid","role":"authenticated"}',true);
DO $$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM public.dividas;
 IF n <> 2 THEN RAISE EXCEPTION 'Tenant read isolation failed'; END IF;
 PERFORM public.update_debt_with_history('aaaaaaaa-0000-4000-8000-000000000001','em_negociacao','Test note');
 SELECT count(*) INTO n FROM public.historico_acoes WHERE divida_id = 'aaaaaaaa-0000-4000-8000-000000000001';
 IF n <> 2 THEN RAISE EXCEPTION 'Status and note must both be audited'; END IF;
 BEGIN
  PERFORM public.update_debt_with_history('bbbbbbbb-0000-4000-8000-000000000001','cancelado',NULL);
  RAISE EXCEPTION 'Cross-tenant update allowed';
 EXCEPTION WHEN SQLSTATE 'PT404' THEN NULL; END;
 BEGIN
  INSERT INTO public.historico_acoes(divida_id,tipo,descricao,autor)
  VALUES('bbbbbbbb-0000-4000-8000-000000000001','atualizacao','Foreign note','a@example.invalid');
  RAISE EXCEPTION 'Cross-tenant history insert allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  PERFORM public.update_debt_with_history('aaaaaaaa-0000-4000-8000-000000000001','pago',NULL);
  RAISE EXCEPTION 'Unverified payment allowed';
 EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
 BEGIN
  PERFORM public.update_debt_with_history('aaaaaaaa-0000-4000-8000-000000000002','pendente',NULL);
  RAISE EXCEPTION 'Paid debt reopened';
 EXCEPTION WHEN SQLSTATE 'PT409' THEN NULL; END;
 PERFORM public.update_debt_with_history('aaaaaaaa-0000-4000-8000-000000000002',NULL,'Note on paid debt');
 BEGIN
  PERFORM public.update_debt_with_history('aaaaaaaa-0000-4000-8000-000000000001','cancelado','force rollback');
  RAISE EXCEPTION 'Failure injection did not execute';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'Injected audit failure' THEN RAISE; END IF;
 END;
 IF (SELECT status FROM public.dividas WHERE id='aaaaaaaa-0000-4000-8000-000000000001') <> 'em_negociacao'
 THEN RAISE EXCEPTION 'Status was not rolled back'; END IF;
 SELECT count(*) INTO n FROM public.historico_acoes WHERE divida_id='aaaaaaaa-0000-4000-8000-000000000001';
 IF n <> 2 THEN RAISE EXCEPTION 'Audit events were not rolled back'; END IF;
END;
$$;
-- Direct table access must not bypass the API's restrictions or its audit trail.
DO $$
DECLARE created_id uuid; n integer;
BEGIN
 INSERT INTO public.dividas(credor_id,devedor_nome,devedor_doc,descricao,valor)
 VALUES('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','Fixture','test','Created by A',100)
 RETURNING id INTO created_id;
 SELECT count(*) INTO n FROM public.historico_acoes WHERE divida_id=created_id AND tipo='cadastro';
 IF n <> 1 THEN RAISE EXCEPTION 'Creation must have exactly one audit event'; END IF;
 UPDATE public.dividas SET status='vencido' WHERE id=created_id;
 SELECT count(*) INTO n FROM public.historico_acoes WHERE divida_id=created_id;
 IF n <> 2 THEN RAISE EXCEPTION 'Direct status update was not audited'; END IF;
 BEGIN
  UPDATE public.dividas SET status='pago' WHERE id=created_id;
  RAISE EXCEPTION 'Direct unverified payment allowed';
 EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
 BEGIN
  UPDATE public.dividas SET status='pendente' WHERE id='aaaaaaaa-0000-4000-8000-000000000002';
  RAISE EXCEPTION 'Direct paid debt reopening allowed';
 EXCEPTION WHEN SQLSTATE 'PT409' THEN NULL; END;
 BEGIN
  UPDATE public.dividas SET valor=1 WHERE id=created_id;
  RAISE EXCEPTION 'Financial field update allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  UPDATE public.dividas SET pago_em=now() WHERE id=created_id;
  RAISE EXCEPTION 'Payment timestamp update allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  UPDATE public.dividas SET credor_id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb' WHERE id=created_id;
  RAISE EXCEPTION 'Ownership change allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  INSERT INTO public.dividas(credor_id,devedor_nome,devedor_doc,descricao,valor,status)
  VALUES('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','Fixture','test','Fake paid creation',100,'pago');
  RAISE EXCEPTION 'Direct paid creation allowed';
 EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
 PERFORM set_config('crosscollect.test_reject_audit','on',true);
 BEGIN
  INSERT INTO public.dividas(credor_id,devedor_nome,devedor_doc,descricao,valor)
  VALUES('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','Fixture','test','Must roll back creation',100);
  RAISE EXCEPTION 'Creation failure injection did not execute';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'Injected audit failure' THEN RAISE; END IF;
 END;
 IF EXISTS(SELECT 1 FROM public.dividas WHERE descricao='Must roll back creation')
 THEN RAISE EXCEPTION 'Creation was not rolled back'; END IF;
 BEGIN
  UPDATE public.dividas SET status='cancelado' WHERE id=created_id;
  RAISE EXCEPTION 'Direct update failure injection did not execute';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'Injected audit failure' THEN RAISE; END IF;
 END;
 IF (SELECT status FROM public.dividas WHERE id=created_id) <> 'vencido'
 THEN RAISE EXCEPTION 'Direct update was not rolled back'; END IF;
 PERFORM set_config('crosscollect.test_reject_audit','off',true);
END;
$$;
-- A second company sees only its own fixture.
SELECT set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
SELECT set_config('request.jwt.claims','{"sub":"22222222-2222-4222-8222-222222222222","email":"b@example.invalid","role":"authenticated"}',true);
DO $$ BEGIN
 IF (SELECT count(*) FROM public.dividas) <> 1 THEN RAISE EXCEPTION 'Tenant B read isolation failed'; END IF;
 BEGIN
  PERFORM public.update_debt_with_history('aaaaaaaa-0000-4000-8000-000000000001','cancelado',NULL);
  RAISE EXCEPTION 'Tenant B could update A';
 EXCEPTION WHEN SQLSTATE 'PT404' THEN NULL; END;
END; $$;
-- An authenticated account without a company has no tenant data.
SELECT set_config('request.jwt.claim.sub','33333333-3333-4333-8333-333333333333',true);
SELECT set_config('request.jwt.claims','{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}',true);
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM public.dividas) THEN RAISE EXCEPTION 'Unlinked user can read debts'; END IF;
END; $$;
RESET ROLE;
SET LOCAL ROLE anon;
DO $$ BEGIN
 BEGIN
  PERFORM 1 FROM public.dividas;
  RAISE EXCEPTION 'Anonymous table read allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  PERFORM public.update_debt_with_history('aaaaaaaa-0000-4000-8000-000000000001','cancelado',NULL);
  RAISE EXCEPTION 'Anonymous RPC allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END; $$;
RESET ROLE;
ROLLBACK;
SELECT 'PASS: tenant isolation, write guards, audit atomicity and anonymous access checks' AS result;
