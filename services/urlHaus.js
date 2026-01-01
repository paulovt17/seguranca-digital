import axios from "axios";

let cache = {
  data: [],
  lastFetch: 0,
};

const ONE_HOUR = 1000 * 60 * 60;

function normalize(url) {
  try {
    const u = new URL(url);
    return `${u.hostname}${u.pathname}`.replace(/\/$/, "");
  } catch {
    return "";
  }
}

export async function checkUrlHaus(targetUrl) {
  const now = Date.now();

  if (now - cache.lastFetch > ONE_HOUR || cache.data.length === 0) {
    const res = await axios.get(
      "https://urlhaus.abuse.ch/downloads/text/",
      { timeout: 8000 }
    );

    cache.data = res.data
      .split("\n")
      .filter(line => line && !line.startsWith("#"))
      .map(line => normalize(line.split(" ")[0]));

    cache.lastFetch = now;
  }

  const normalizedTarget = normalize(targetUrl);

  return cache.data.some(malicious =>
    normalizedTarget.startsWith(malicious)
  );
}
