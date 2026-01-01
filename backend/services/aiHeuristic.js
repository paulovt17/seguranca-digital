export function aiHeuristicAnalysis(url) {
  let score = 0;
  const reasons = [];

  const suspiciousWords = [
  // 🔐 Autenticação / acesso
  "login",
  "logar",
  "entrar",
  "acessar",
  "auth",
  "autenticacao",
  "verificacao",
  "verificar",
  "confirmar",
  "confirmacao",

  // 🏦 Bancos / financeiro
  "banco",
  "bank",
  "bradesco",
  "itau",
  "santander",
  "caixa",
  "nubank",
  "inter",
  "sicredi",
  "pix",
  "boleto",
  "cartao",
  "credito",
  "debito",
  "fatura",
  "pagamento",
  "transferencia",
  "saque",

  // 🪪 Dados sensíveis
  "cpf",
  "cnpj",
  "rg",
  "senha",
  "password",
  "token",
  "codigo",
  "sms",
  "otp",

  // 🏛️ Governo / serviços públicos
  "gov",
  "govbr",
  "gov.br",
  "receita",
  "receitafederal",
  "inss",
  "fgts",
  "auxilio",
  "beneficio",
  "cadastro",
  "atualizar",
  "regularizar",

  // 📦 Entregas / compras
  "correios",
  "sedex",
  "rastreamento",
  "entrega",
  "pedido",
  "pedido-retido",
  "taxa",
  "liberar",

  // 🎁 Engenharia social / urgência
  "premio",
  "sorteio",
  "ganhou",
  "ganhador",
  "bonus",
  "oferta",
  "promocao",
  "urgente",
  "bloqueado",
  "suspenso",
  "alerta",

  // ⚠️ Segurança falsa
  "seguranca",
  "security",
  "protecao",
  "protegido",
  "anti-fraude",
  "verificado"
];

  suspiciousWords.forEach(word => {
    if (url.toLowerCase().includes(word)) {
      score += 15;
      reasons.push(`Contém palavra suspeita: "${word}"`);
    }
  });

  if (!url.startsWith("https://")) {
    score += 20;
    reasons.push("O site não usa HTTPS");
  }

  const tlds = [".xyz", ".top", ".click", ".zip", ".xyz/", ".top/", ".click/", ".zip/"];
  tlds.forEach(tld => {
    if (url.endsWith(tld)) {
      score += 15;
      reasons.push(`Domínio suspeito (${tld})`);
    }
  });

  let level = "baixo";
  if (score >= 50) level = "alto";
  else if (score >= 30) level = "medio";

  return { score, level, reasons };
}
