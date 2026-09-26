# Cloudflare infrastructure

OpenTofu for what surrounds the portfolio on `migueljfsc.dev`. The site itself is a
static-assets Worker deployed by wrangler (`.github/workflows/deploy.yml`) — that deploy
cannot be Terraform, because it ends in an upload token Cloudflare expires after an hour.

## What it manages

| File | Resource |
|------|----------|
| `www.tf` | `www` placeholder record, and the zone's dynamic-redirect ruleset: www → apex (301, path and query kept) |
| `data.tf` | Zone lookup |

The redirect ruleset is the zone's **only** `http_request_dynamic_redirect` entry point. Any
other redirect on `migueljfsc.dev`, from any project, is a rule added here — the API refuses a
second ruleset for the phase. Subdomains owned by other projects (e.g. `pitchboard.`) live in
their own stacks.

## API token

One token serves this stack and the deploy. Cloudflare → My Profile → API Tokens → Create
Token → Custom token:

| Scope | Permission | Used by |
|-------|------------|---------|
| Account · Workers Scripts | Edit | deploy — uploads the Worker and its assets |
| Zone · Workers Routes | Edit | deploy — the apex custom domain |
| Zone · Zone | Read | both — resolving the zone |
| Zone · DNS | Edit | stack — the `www` record |
| Zone · Single Redirect | Edit | stack — the redirect ruleset |

Account Resources: the account. Zone Resources: Specific zone → `migueljfsc.dev`.

State lives in the shared `terraform-tfstate` R2 bucket under `portfolio/cloudflare/`; its
S3-style credentials are a separate R2 API token (Object Read & Write on that bucket).

## Usage

Normally CI: `.github/workflows/terraform.yml` plans on pull requests and applies on push to
`main`. Locally:

```sh
export CLOUDFLARE_API_TOKEN=... TF_VAR_cloudflare_account_id=...
export AWS_ENDPOINT_URL_S3="https://<ACCOUNT_ID>.r2.cloudflarestorage.com"
export AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=...
tofu init
tofu plan  -var-file=contexts/prod.tfvars
tofu apply -var-file=contexts/prod.tfvars
```
