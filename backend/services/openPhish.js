import axios from "axios";

let cache = { data: [], lastFetch: 0 };

export async function checkOpenPhish(url) {
  const now = Date.now();

  if (now - cache.lastFetch > 1000 * 60 * 60) {
    const res = await axios.get("https://openphish.com/feed.txt");
    cache.data = res.data.split("\n");
    cache.lastFetch = now;
  }

  return cache.data.includes(url);
}
