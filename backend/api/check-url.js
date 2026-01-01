import { checkGoogleSafe } from "../services/googleSafe.js";
import { checkOpenPhish } from "../services/openPhish.js";
import { checkUrlHaus } from "../services/urlHaus.js";
import { aiHeuristicAnalysis } from "../services/aiHeuristic.js";

dotenv.config();

/* =====================================================
   🧠 CACHE SIMPLES (EM MEMÓRIA)
===================================================== */
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutos

function getFromCache(url) {
  const cached = cache.get(url);
  if (!cached) return null;

  if (Date.now() > cached.expiresAt) {
    cache.delete(url);
    return null;
  }

  return cached.data;
}

function saveToCache(url, data) {
  cache.set(url, {
    data,
    expiresAt: Date.now() + CACHE_TTL,
  });
}

/* =====================================================
   🚀 HANDLER
===================================================== */
export default async function handler(req, res) {
  // 🔥 HEADERS CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🔥 Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Método não permitido" });
  }

  const { url } = req.body;

  if (!url) {
    return res
      .status(400)
      .json({ success: false, error: "URL não informada" });
  }

  /* =====================================================
     ⚡ 1. CACHE
  ===================================================== */
  const cachedResult = getFromCache(url);
  if (cachedResult) {
    return res.json(cachedResult);
  }

  try {
    /* =====================================================
       🔎 2. CONSULTAS EM PARALELO (RÁPIDO)
    ===================================================== */
    const [google, openphish, urlhaus] = await Promise.all([
      checkGoogleSafe(url),
      checkOpenPhish(url),
      checkUrlHaus(url),
    ]);

    const sources = { google, openphish, urlhaus };
    const blacklistHits = Object.values(sources).filter(Boolean).length;

    /* =====================================================
       🧠 3. IA HEURÍSTICA
    ===================================================== */
    const aiAnalysis = aiHeuristicAnalysis(url);

    /* =====================================================
       ⚖️ 4. CÁLCULO FINAL DE RISCO
    ===================================================== */
    let riskLevel = "baixo";

    if (blacklistHits >= 1) {
      riskLevel = "alto";
    } else if (aiAnalysis.level === "alto") {
      riskLevel = "alto";
    } else if (aiAnalysis.level === "medio") {
      riskLevel = "medio";
    }

    const safe = riskLevel === "baixo";

    const result = {
      success: true,
      safe,
      riskLevel,
      sources,
      aiAnalysis,
      message:
        riskLevel === "baixo"
          ? "✅ Este site não apresenta riscos conhecidos."
          : riskLevel === "medio"
          ? "⚠️ Atenção: este site apresenta sinais suspeitos."
          : "🚨 Alto risco! Este site pode ser golpe ou phishing.",
    };

    /* =====================================================
       💾 5. SALVA NO CACHE
    ===================================================== */
    saveToCache(url, result);

    return res.json(result);
  } catch (err) {
    console.error("Erro ao verificar URL:", err.message);
    return res.status(500).json({
      success: false,
      error: "Erro interno ao verificar URL",
    });
  }
}
