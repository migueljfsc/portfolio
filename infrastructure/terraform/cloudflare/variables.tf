###################### CLOUDFLARE ACCOUNT ######################

variable "cloudflare_api_token" {
  type        = string
  description = "Cloudflare API token. Prefer the CLOUDFLARE_API_TOKEN env var over passing this."
  sensitive   = true
  default     = null
}

variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account ID that owns the zone."
  nullable    = false

  validation {
    condition     = var.cloudflare_account_id != ""
    error_message = "Cloudflare account ID cannot be empty."
  }
}

###################### DOMAIN ######################

variable "domain" {
  type        = string
  description = <<-EOT
    The personal apex domain, bought through Cloudflare Registrar. The portfolio is served
    from it by the Worker in wrangler.jsonc; this stack owns what surrounds that — the www
    name and its redirect.
  EOT
  nullable    = false
}
