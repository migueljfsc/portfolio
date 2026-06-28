// Build an internal URL that respects Astro's configured `base`.
// import.meta.env.BASE_URL is '/portfolio' in prod, '/' in dev (no guaranteed
// trailing slash), so we join explicitly.
// Usage: u('blog'), u(`blog/${slug}`), u('resume.pdf'), u() for home.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function u(path = ''): string {
  const p = path.replace(/^\//, '');
  return p ? `${BASE}/${p}` : `${BASE}/`;
}
