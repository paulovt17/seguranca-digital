import { useState, useRef } from "react";
import { checkUrlSecurity } from "../../services/securityApi";
import ResultAlert from "../ResultAlert/ResultAlert";

function UrlForm() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [progress, setProgress] = useState(0);

  const progressInterval = useRef(null);

  function isValidUrl(value) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  function startFakeProgress() {
    setProgress(5);

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 4;
      });
    }, 600);
  }

  function stopFakeProgress() {
    clearInterval(progressInterval.current);
    setProgress(100);
  }

  async function handleCheck() {
    setError("");
    setResult(null);
    setStep("");
    setProgress(0);

    if (!url.trim()) {
      setError("Digite o endereço do site.");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Exemplo correto: https://www.exemplo.com");
      return;
    }

    setLoading(true);
    setStep("🔍 Verificando listas oficiais...");
    startFakeProgress();

    try {
      await delay(3000);
      setStep("🧠 Analisando padrões suspeitos...");

      const response = await checkUrlSecurity(url);

      stopFakeProgress();
      setStep("✅ Análise concluída");

      if (!response.success) {
        setError(response.message || "Erro ao verificar o site.");
        return;
      }

      setResult(response);
    } catch {
      stopFakeProgress();
      setError("Erro inesperado ao verificar o site.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="url-form card">
      <h2 className="url-form__title">🔎 Verificação de Site</h2>

      <label htmlFor="url" className="url-form__label">
        Endereço do site
      </label>

      <input
        id="url"
        type="text"
        className="url-form__input"
        placeholder="https://www.exemplo.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        className="url-form__button"
        onClick={handleCheck}
        disabled={loading}
      >
        {loading ? "Verificando..." : "Verificar site"}
      </button>

      {loading && (
        <div className="url-form__progress">
          <div
            className="url-form__progress-bar"
            style={{ width: `${progress}%` }}
          />
          <p className="url-form__step">{step}</p>
        </div>
      )}

      {error && <p className="url-form__error">⚠️ {error}</p>}

      <ResultAlert result={result} />
    </section>
  );
}

/* helper */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default UrlForm;
