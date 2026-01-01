import axios from "axios";

let cache = {
  data: [],
  lastFetch: 0,
};

const ONE_HOUR = 1000 * 60 * 60;

function normalize(url) {
  try {
    const u = new URL(url);
    return u.hostname + u.pathname;
  } catch {
    return null;
  }
}

export async function checkUrlHaus(targetUrl) {
  const now = Date.now();

  if (now - cache.lastFetch > ONE_HOUR || cache.data.length === 0) {
    const res = await axios.get(
      "https://urlhaus.abuse.ch/downloads/text/"
    );

    cache.data = res.data
      .split("\n")
      .filter(
        (line) =>
          line &&
          !line.startsWith("#") &&
          line.startsWith("http")
      )
      .map(normalize)
      .filter(Boolean);

    cache.lastFetch = now;
  }

  const targetNormalized = normalize(targetUrl);
  if (!targetNormalized) return false;

  return cache.data.some(
    (malicious) => malicious === targetNormalized
  );
}
