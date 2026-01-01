function ResultAlert({ result }) {
  if (!result) return null;

  const { safe, riskLevel, sources, message, aiAnalysis } = result;

  return (
    <div
      className={`result-alert result-alert--${riskLevel}`}
      role="alert"
      aria-live="polite"
    >
      <h2 className="result-alert__title">
        {riskLevel === "baixo" && "🟢 Baixo risco"}
        {riskLevel === "medio" && "🟡 Risco médio"}
        {riskLevel === "alto" && "🔴 Alto risco"}
      </h2>

      <p className="result-alert__message">{message}</p>

      <hr />

      <strong>Fontes consultadas:</strong>
      <ul className="result-alert__list">
        <li>Google Safe Browsing: {sources.google ? "❌ Detectado" : "✅ OK"}</li>
        <li>OpenPhish: {sources.openphish ? "❌ Detectado" : "✅ OK"}</li>
        <li>URLHaus: {sources.urlhaus ? "❌ Detectado" : "✅ OK"}</li>
      </ul>

      {aiAnalysis && (
        <>
          <hr />

          <strong>🧠 Análise heurística (IA)</strong>

          <p className="result-alert__ai">
            Pontuação de risco: <strong>{aiAnalysis.score}</strong>
            <br />
            Nível identificado: <strong>{aiAnalysis.level}</strong>
          </p>

          {aiAnalysis.reasons.length > 0 && (
            <ul className="result-alert__reasons">
              {aiAnalysis.reasons.map((reason, index) => (
                <li key={index}>⚠️ {reason}</li>
              ))}
            </ul>
          )}
        </>
      )}

      {!safe && (
        <p className="result-alert__warning">
          ❗ Recomendação: evite informar senhas, CPF ou dados bancários.
        </p>
      )}
    </div>
  );
}

export default ResultAlert;
