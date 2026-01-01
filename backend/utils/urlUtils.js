export function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.href;
  } catch {
    return null;
  }
}

export function getDomain(url) {
  return new URL(url).hostname;
}
