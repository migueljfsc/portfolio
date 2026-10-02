// Anchor-safe id from a display name, e.g. "ARMIS Group" -> "armis-group".
export function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
