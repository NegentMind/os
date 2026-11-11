// HTTP con backoff ante 429/5xx (respeta Retry-After / retry_after).
export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function apiFetch(url: string, init: RequestInit = {}, retries = 2): Promise<Response> {
  let last: Response | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, init);
    last = res;
    if (res.status !== 429 && res.status < 500) return res;
    if (attempt === retries) return res;
    let wait = 2000 * (attempt + 1);
    try {
      const ra = res.headers.get("retry-after");
      if (ra) wait = Number(ra) * 1000;
      else {
        const j = (await res.clone().json()) as { parameters?: { retry_after?: number }; retry_after?: number };
        const s = j.parameters?.retry_after ?? j.retry_after;
        if (s) wait = s * 1000 + 1000;
      }
    } catch { /* usa default */ }
    await sleep(wait);
  }
  return last as Response;
}
