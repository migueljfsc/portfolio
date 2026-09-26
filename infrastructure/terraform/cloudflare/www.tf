# ==============================================================================
# www.<domain> → <domain>, keeping the path and query.
#
# A redirect rule, not Worker code: it answers at the edge before any Worker
# runs, so the portfolio's Worker stays static assets only and a redirected
# visit costs no Worker request. A redirect rule only fires on proxied traffic,
# so www needs a proxied record to exist at all; 100:: is the documented
# placeholder for "nothing behind this, Cloudflare answers".
# ==============================================================================

resource "cloudflare_dns_record" "www" {
  zone_id = data.cloudflare_zone.this.zone_id
  name    = "www.${var.domain}"
  type    = "AAAA"
  content = "100::"
  proxied = true
  ttl     = 1
  comment = "Placeholder so the www redirect rule has proxied traffic to act on (portfolio stack)."
}

# The zone's ONE entry-point ruleset for the dynamic-redirect phase. Any other
# redirect on this domain, from any project, belongs in this list — a second
# ruleset for the same phase is refused by the API.
resource "cloudflare_ruleset" "redirects" {
  zone_id     = data.cloudflare_zone.this.zone_id
  name        = "redirects"
  description = "Zone redirects for ${var.domain}, owned by the portfolio stack"
  kind        = "zone"
  phase       = "http_request_dynamic_redirect"

  rules = [{
    ref         = "www_to_apex"
    description = "www.${var.domain} to ${var.domain}"
    expression  = "(http.host eq \"www.${var.domain}\")"
    action      = "redirect"
    action_parameters = {
      from_value = {
        status_code           = 301
        preserve_query_string = true
        target_url = {
          expression = "concat(\"https://${var.domain}\", http.request.uri.path)"
        }
      }
    }
  }]
}
