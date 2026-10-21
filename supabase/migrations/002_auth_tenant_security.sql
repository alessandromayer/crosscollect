-- Security migration: REVIEW BEFORE APPLYING TO SUPABASE.
-- Never apply without first reviewing existing tenant data and policies.
ALTER TABLE public.credores ADD COLUMN IF NOT EXISTS owner_user_id uuid REFERENCES auth.users(id);
CREATE UNIQUE INDEX IF NOT EXISTS credores_owner_user_id_key ON public.credores(owner_user_id) WHERE owner_user_id IS NOT NULL;
-- IMPORTANT: existing orphan records require review before enforcing NOT NULL.\n-- Do not modify historical rows automatically.
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
