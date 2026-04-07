interface EmailData {
  nomeDevedor: string;
  valor: string;
  moeda: string;
  dataVencimento: string;
  descricao: string;
  linkPagamento?: string;
  nomeCredor: string;
}

const baseStyle = `
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
`;

const headerStyle = `
  background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
  padding: 32px 40px;
  border-radius: 16px 16px 0 0;
`;

const bodyStyle = `
  padding: 40px;
  background: #ffffff;
`;

const footerStyle = `
  padding: 24px 40px;
  background: #f8fafc;
  border-radius: 0 0 16px 16px;
  border-top: 1px solid #e2e8f0;
`;

export function templatePrimeiroContato(data: EmailData): { subject: string; html: string } {
  const subject = `Aviso amigável — Pendência financeira em aberto | ${data.valor} ${data.moeda}`;

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:20px;background:#f1f5f9;">
  <div style="${baseStyle}">

    <!-- Header -->
    <div style="${headerStyle}">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
        <div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-size:20px;">🌐</span>
        </div>
        <span style="color:white;font-size:20px;font-weight:700;letter-spacing:-0.5px;">CrossCollect</span>
      </div>
      <h1 style="color:white;font-size:24px;font-weight:700;margin:0;line-height:1.3;">
        Comunicado de Pendência Financeira
      </h1>
      <p style="color:#bfdbfe;font-size:14px;margin:8px 0 0;">
        Notificação amigável — Primeiro contato
      </p>
    </div>

    <!-- Body -->
    <div style="${bodyStyle}">
      <p style="color:#334155;font-size:16px;line-height:1.6;margin:0 0 20px;">
        Prezado(a) <strong>${data.nomeDevedor}</strong>,
      </p>

      <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Entramos em contato em nome de <strong>${data.nomeCredor}</strong> para informar que
        identificamos uma <strong>pendência financeira</strong> em seu nome que necessita de
        regularização.
      </p>

      <!-- Debt card -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin:0 0 28px;">
        <p style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;margin:0 0 16px;">
          Detalhes da pendência
        </p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;width:50%;">Descrição</td>
            <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${data.descricao}</td>
          </tr>
          <tr style="border-top:1px solid #f1f5f9;">
            <td style="padding:8px 0;color:#64748b;font-size:14px;">Valor em aberto</td>
            <td style="padding:8px 0;font-size:18px;font-weight:700;color:#1d4ed8;">${data.valor} ${data.moeda}</td>
          </tr>
          <tr style="border-top:1px solid #f1f5f9;">
            <td style="padding:8px 0;color:#64748b;font-size:14px;">Data de vencimento</td>
            <td style="padding:8px 0;color:#dc2626;font-size:14px;font-weight:600;">${data.dataVencimento}</td>
          </tr>
        </table>
      </div>

      <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px;">
        Para evitar encargos adicionais ou restrições cadastrais, solicitamos a regularização
        desta pendência o mais breve possível. Estamos disponíveis para negociar condições
        de pagamento que se adequem à sua situação.
      </p>

      <!-- CTA Button -->
      ${data.linkPagamento ? `
      <div style="text-align:center;margin:0 0 28px;">
        <a href="${data.linkPagamento}"
           style="display:inline-block;background:#1d4ed8;color:white;font-size:15px;font-weight:700;padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.3px;">
          Regularizar pendência →
        </a>
        <p style="color:#94a3b8;font-size:12px;margin:10px 0 0;">
          Link seguro · Pagamento processado com criptografia
        </p>
      </div>
      ` : ""}

      <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;">
        <p style="color:#1e40af;font-size:14px;margin:0;line-height:1.6;">
          <strong>Dúvidas?</strong> Responda este e-mail ou entre em contato diretamente
          com <strong>${data.nomeCredor}</strong>. Nossa equipe está pronta para auxiliar.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="${footerStyle}">
      <p style="color:#94a3b8;font-size:12px;margin:0;line-height:1.6;text-align:center;">
        Esta mensagem foi enviada por <strong>CrossCollect</strong> em nome de <strong>${data.nomeCredor}</strong>.<br>
        Plataforma de cobrança internacional · Em conformidade com a LGPD e o CDC Brasileiro.<br><br>
        Se você já regularizou esta pendência, por favor desconsidere este comunicado.
      </p>
    </div>

  </div>
</body>
</html>`;

  return { subject, html };
}

export function templateSegundoAviso(data: EmailData): { subject: string; html: string } {
  const subject = `⚠️ SEGUNDO AVISO — Pendência não regularizada | ${data.valor} ${data.moeda}`;

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:20px;background:#fef2f2;">
  <div style="${baseStyle}">

    <!-- Header urgente -->
    <div style="background:linear-gradient(135deg,#b91c1c 0%,#dc2626 100%);padding:32px 40px;border-radius:16px 16px 0 0;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
        <div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:20px;">⚠️</span>
        </div>
        <span style="color:white;font-size:20px;font-weight:700;">CrossCollect</span>
      </div>
      <h1 style="color:white;font-size:24px;font-weight:700;margin:0;line-height:1.3;">
        Segundo Aviso — Ação Necessária
      </h1>
      <p style="color:#fca5a5;font-size:14px;margin:8px 0 0;">
        Sua pendência permanece em aberto
      </p>
    </div>

    <!-- Body -->
    <div style="${bodyStyle}">
      <p style="color:#334155;font-size:16px;line-height:1.6;margin:0 0 20px;">
        Prezado(a) <strong>${data.nomeDevedor}</strong>,
      </p>

      <div style="background:#fff5f5;border:2px solid #fecaca;border-radius:12px;padding:20px;margin:0 0 24px;">
        <p style="color:#991b1b;font-size:15px;font-weight:700;margin:0 0 8px;">
          🚨 Pendência não regularizada após primeiro aviso
        </p>
        <p style="color:#b91c1c;font-size:14px;margin:0;line-height:1.6;">
          Apesar do nosso comunicado anterior, não identificamos a regularização da
          pendência abaixo. É necessária ação imediata para evitar consequências.
        </p>
      </div>

      <!-- Debt card -->
      <div style="background:#f8fafc;border:2px solid #fca5a5;border-radius:12px;padding:24px;margin:0 0 28px;">
        <p style="color:#dc2626;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;margin:0 0 16px;">
          ⚠️ Pendência em atraso
        </p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;width:50%;">Descrição</td>
            <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${data.descricao}</td>
          </tr>
          <tr style="border-top:1px solid #fee2e2;">
            <td style="padding:8px 0;color:#64748b;font-size:14px;">Valor original</td>
            <td style="padding:8px 0;font-size:18px;font-weight:700;color:#dc2626;">${data.valor} ${data.moeda}</td>
          </tr>
          <tr style="border-top:1px solid #fee2e2;">
            <td style="padding:8px 0;color:#64748b;font-size:14px;">Vencimento</td>
            <td style="padding:8px 0;color:#dc2626;font-size:14px;font-weight:700;">${data.dataVencimento} (VENCIDA)</td>
          </tr>
        </table>
      </div>

      <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Informamos que, caso a pendência não seja regularizada em <strong>até 5 dias úteis</strong>,
        poderemos tomar medidas adicionais de cobrança, incluindo o encaminhamento para
        departamento jurídico.
      </p>

      <!-- CTA urgente -->
      ${data.linkPagamento ? `
      <div style="text-align:center;margin:0 0 28px;">
        <a href="${data.linkPagamento}"
           style="display:inline-block;background:#dc2626;color:white;font-size:15px;font-weight:700;padding:16px 40px;border-radius:10px;text-decoration:none;">
          Regularizar AGORA →
        </a>
      </div>
      ` : ""}

      <div style="background:#fef9c3;border-left:4px solid #eab308;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;">
        <p style="color:#713f12;font-size:14px;margin:0;line-height:1.6;">
          💡 <strong>Quer negociar?</strong> Entre em contato antes do prazo final.
          Podemos oferecer condições especiais de pagamento.
        </p>
      </div>
    </div>

    <div style="${footerStyle}">
      <p style="color:#94a3b8;font-size:12px;margin:0;line-height:1.6;text-align:center;">
        CrossCollect · Cobrança Internacional em conformidade com a LGPD e CDC<br>
        Em nome de <strong>${data.nomeCredor}</strong>
      </p>
    </div>

  </div>
</body>
</html>`;

  return { subject, html };
}

export function templateAvisoSerasa(data: EmailData): { subject: string; html: string } {
  const subject = `🔴 NOTIFICAÇÃO FINAL — Inclusão em cadastro de inadimplentes | ${data.nomeDevedor}`;

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:20px;background:#1e293b;">
  <div style="${baseStyle}">

    <!-- Header crítico -->
    <div style="background:#0f172a;padding:32px 40px;border-radius:16px 16px 0 0;border-bottom:3px solid #dc2626;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
        <span style="color:white;font-size:20px;font-weight:700;">CrossCollect</span>
        <span style="background:#dc2626;color:white;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;letter-spacing:1px;">
          NOTIFICAÇÃO FORMAL
        </span>
      </div>
      <h1 style="color:white;font-size:22px;font-weight:700;margin:0;line-height:1.3;">
        Notificação de Inclusão em<br>Cadastro de Inadimplentes
      </h1>
      <p style="color:#94a3b8;font-size:14px;margin:10px 0 0;">
        Este é um comunicado formal e legal
      </p>
    </div>

    <!-- Body -->
    <div style="${bodyStyle}">
      <p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Prezado(a) <strong>${data.nomeDevedor}</strong>,
      </p>

      <div style="background:#fff0f0;border:2px solid #dc2626;border-radius:12px;padding:20px;margin:0 0 24px;">
        <p style="color:#991b1b;font-size:16px;font-weight:700;margin:0 0 12px;">
          🔴 COMUNICADO FORMAL DE INCLUSÃO
        </p>
        <p style="color:#b91c1c;font-size:14px;line-height:1.7;margin:0;">
          Informamos que, esgotadas todas as tentativas amigáveis de regularização,
          seu nome será incluído nos cadastros de proteção ao crédito
          (<strong>Serasa Experian / SPC Brasil</strong>) em razão da pendência financeira
          abaixo descrita.
        </p>
      </div>

      <!-- Debt card -->
      <div style="background:#f8fafc;border:2px solid #0f172a;border-radius:12px;padding:24px;margin:0 0 28px;">
        <p style="color:#0f172a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin:0 0 16px;">
          Dados da pendência a ser negativada
        </p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;color:#64748b;font-size:14px;width:50%;border-bottom:1px solid #e2e8f0;">Devedor</td>
            <td style="padding:10px 0;color:#0f172a;font-size:14px;font-weight:700;border-bottom:1px solid #e2e8f0;">${data.nomeDevedor}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#64748b;font-size:14px;border-bottom:1px solid #e2e8f0;">Credor</td>
            <td style="padding:10px 0;color:#0f172a;font-size:14px;font-weight:700;border-bottom:1px solid #e2e8f0;">${data.nomeCredor}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#64748b;font-size:14px;border-bottom:1px solid #e2e8f0;">Origem</td>
            <td style="padding:10px 0;color:#0f172a;font-size:14px;border-bottom:1px solid #e2e8f0;">${data.descricao}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#64748b;font-size:14px;">Valor total</td>
            <td style="padding:10px 0;font-size:20px;font-weight:700;color:#dc2626;">${data.valor} ${data.moeda}</td>
          </tr>
        </table>
      </div>

      <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 24px;">
        A negativação implica restrições para acesso a crédito, financiamentos,
        abertura de contas bancárias e outros serviços financeiros no Brasil.
      </p>

      <!-- Última chance CTA -->
      <div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:12px;padding:20px;margin:0 0 28px;">
        <p style="color:#15803d;font-size:15px;font-weight:700;margin:0 0 12px;">
          ✅ Ainda é possível evitar a negativação
        </p>
        <p style="color:#166534;font-size:14px;line-height:1.6;margin:0 0 16px;">
          Regularize sua pendência em até <strong>48 horas</strong> para cancelarmos
          o processo de inclusão.
        </p>
        ${data.linkPagamento ? `
        <a href="${data.linkPagamento}"
           style="display:inline-block;background:#16a34a;color:white;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;text-decoration:none;">
          Regularizar e cancelar negativação →
        </a>
        ` : ""}
      </div>
    </div>

    <div style="${footerStyle}">
      <p style="color:#94a3b8;font-size:11px;margin:0;line-height:1.6;text-align:center;">
        Notificação formal emitida por CrossCollect em nome de ${data.nomeCredor}.<br>
        Em conformidade com o Art. 43 do CDC (Lei 8.078/90) e a Lei Geral de Proteção de Dados (Lei 13.709/18).<br>
        O devedor tem direito à contestação mediante comprovante de pagamento ou acordo homologado.
      </p>
    </div>

  </div>
</body>
</html>`;

  return { subject, html };
}
