-- CrossCollect — Initial Schema
-- Run this in Supabase SQL Editor

-- ── CREDORES ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS credores (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  pais        TEXT DEFAULT 'Internacional',
  plano       TEXT DEFAULT 'starter',
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- Seed: default creditor (used until auth is implemented)
INSERT INTO credores (id, nome, email, pais, plano)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'João Silva',
  'joao@empresa.com',
  'Brasil',
  'growth'
) ON CONFLICT (email) DO NOTHING;

-- ── DIVIDAS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dividas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credor_id       UUID REFERENCES credores(id) ON DELETE SET NULL,
  -- Devedor
  devedor_nome    TEXT NOT NULL,
  devedor_doc     TEXT NOT NULL,
  devedor_email   TEXT,
  devedor_tel     TEXT,
  devedor_cidade  TEXT,
  devedor_estado  TEXT,
  devedor_tipo    TEXT DEFAULT 'pessoa_juridica'
                  CHECK (devedor_tipo IN ('pessoa_fisica','pessoa_juridica')),
  -- Valores
  descricao       TEXT NOT NULL,
  valor           NUMERIC(15,2) NOT NULL,
  moeda           TEXT NOT NULL DEFAULT 'USD',
  valor_brl       NUMERIC(15,2),
  taxa_cambio     NUMERIC(10,4) DEFAULT 5.0,
  data_vencimento DATE,
  -- Estado
  status          TEXT NOT NULL DEFAULT 'pendente'
                  CHECK (status IN ('pendente','em_negociacao','pago','vencido','cancelado')),
  observacoes     TEXT,
  documentos      TEXT[] DEFAULT '{}',
  regime_cobranca JSONB DEFAULT '[]',
  -- Timestamps
  criado_em       TIMESTAMPTZ DEFAULT NOW(),
  pago_em         TIMESTAMPTZ
);

-- ── HISTORICO_ACOES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS historico_acoes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  divida_id   UUID NOT NULL REFERENCES dividas(id) ON DELETE CASCADE,
  tipo        TEXT NOT NULL DEFAULT 'atualizacao',
  descricao   TEXT NOT NULL,
  canal       TEXT,
  valor       NUMERIC(15,2),
  autor       TEXT DEFAULT 'Sistema',
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- ── PAGAMENTOS_ASAAS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pagamentos_asaas (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  divida_id               UUID NOT NULL REFERENCES dividas(id) ON DELETE CASCADE,
  asaas_customer_id       TEXT,
  asaas_payment_id_boleto TEXT,
  asaas_payment_id_pix    TEXT,
  status_boleto           TEXT DEFAULT 'PENDING',
  status_pix              TEXT DEFAULT 'PENDING',
  link_boleto             TEXT,
  linha_digitavel         TEXT,
  qr_code_pix             TEXT,
  chave_pix               TEXT,
  data_vencimento         DATE,
  criado_em               TIMESTAMPTZ DEFAULT NOW(),
  pago_em                 TIMESTAMPTZ
);

-- ── INDEXES ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_dividas_credor   ON dividas(credor_id);
CREATE INDEX IF NOT EXISTS idx_dividas_status   ON dividas(status);
CREATE INDEX IF NOT EXISTS idx_dividas_criado   ON dividas(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_historico_divida ON historico_acoes(divida_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_divida ON pagamentos_asaas(divida_id);

-- ── RLS ─────────────────────────────────────────────────────────
ALTER TABLE credores        ENABLE ROW LEVEL SECURITY;
ALTER TABLE dividas         ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_acoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos_asaas ENABLE ROW LEVEL SECURITY;

-- Allow all operations (service_role key bypasses RLS; anon key for reads)
CREATE POLICY "allow_all_dividas"          ON dividas          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_historico"        ON historico_acoes  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_pagamentos"       ON pagamentos_asaas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_credores"         ON credores         FOR ALL USING (true) WITH CHECK (true);
