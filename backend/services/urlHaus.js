import axios from "axios";

let cache = {
  data: [],
  lastFetch: 0,
};

const ONE_HOUR = 1000 * 60 * 60;

export async function checkUrlHaus(targetUrl) {
  const now = Date.now();

  if (now - cache.lastFetch > ONE_HOUR) {
    const res = await axios.get(
      "https://urlhaus.abuse.ch/downloads/text/"
    );

    cache.data = res.data
      .split("\n")
      .filter(line => line && !line.startsWith("#"))
      .map(line => line.split(" ")[0].trim()); // 🔥 só a URL

    cache.lastFetch = now;
  }

  return cache.data.some((maliciousUrl) =>
    targetUrl.startsWith(maliciousUrl)
  );
}
