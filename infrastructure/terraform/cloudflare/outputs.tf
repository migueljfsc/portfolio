output "zone_id" {
  value       = data.cloudflare_zone.this.zone_id
  description = "The domain's zone id."
}
