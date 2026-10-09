// ─────────────────────────────────────────────────────────────────────────
// Canonical source of all CV content.
// Edit here once; the website, PDF, and LinkedIn text all derive from this.
// ─────────────────────────────────────────────────────────────────────────

export interface Role {
  company: string;
  title: string;
  period: string;
  location: string;
  /** One-line summary shown on the home-page career graph. */
  highlight?: string;
  bullets: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Project {
  name: string;
  description: string;
  tags: string[];
  href: string;
  wip: boolean;
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  resume: string;
  headline: string;
  summary: string;
}

export const profile: Profile = {
  name: "Miguel Cardoso",
  title: "DevOps / Infrastructure Engineer",
  location: "Porto, Portugal",
  email: "migueljfscardoso@gmail.com",
  github: "https://github.com/migueljfsc",
  linkedin: "https://www.linkedin.com/in/miguel-cardoso-32428314b/",
  resume: "/resume.pdf",
  headline: "I keep production boring.",
  summary: "I'm Miguel, a DevOps engineer in Porto. I've spent eight years building and running the platforms behind betting, fashion and travel products. Kubernetes, GitOps, observability, security, and the automation that holds it all together.",
};

export const about: string[] = [
  "I'm someone who enjoys figuring things out and learning along the way. I like working with people and doing my part to keep things running smoothly.",
  "When I'm not working, I keep busy with a mix of hobbies. I play guitar, football and videogames, ride my motorcycle, hang out with my cat, and hit the gym to relax and recharge. I'm a big football fan, and even coached a U10/11 academy team.",
  "Professionally, I love the DevOps and infrastructure side of IT. It lets me do what I enjoy most: automating and organising things.",
];

export const experience: Role[] = [
  {
    company: "Icligo",
    title: "DevOps Engineer",
    period: "2026 – Present",
    location: "Porto, PT",
    highlight: "Kubernetes platform for an AI-first travel product",
    bullets: [
      "Building infrastructure for an AI-first travel platform covering accommodation, flights, and trip planning",
      "Designing and operating a microservice architecture on Kubernetes for scalability and independent service delivery",
      "Working with AI agents and AI-assisted tooling across development and day-to-day operations",
      "Establishing CI/CD pipelines and observability foundations for the new platform",
      "Embedding security into CI/CD with automated scanning, SBOMs, and signed container images",
    ],
  },
  {
    company: "FanDuel",
    title: "DevOps Engineer",
    period: "2021 – 2026",
    location: "Porto, PT",
    highlight: "Led the GCP → AWS migration for the largest U.S. horse-betting platform",
    bullets: [
      "Ran infrastructure for the largest online horse-betting platform in the U.S., serving millions of high-traffic users daily",
      "Led the platform's full migration from GCP to AWS across multiple Kubernetes clusters for global scale and resilience",
      "Built a monitoring stack from scratch (Prometheus, Grafana, Thanos) for distributed clusters at scale",
      "Designed a GitOps CI/CD pipeline with ArgoCD and Buildkite for consistent, auditable deployments",
      "Centralised secrets with HashiCorp Vault and standardised provisioning via Terraform, Ansible, and Packer",
      "Authored a disaster-recovery playbook covering all infrastructure components",
    ],
  },
  {
    company: "Farfetch",
    title: "DevOps Engineer",
    period: "2019 – 2021",
    location: "Porto, PT",
    highlight: "Scaled Azure infrastructure for a global luxury marketplace",
    bullets: [
      "Supported and scaled infrastructure for a global luxury-fashion marketplace serving millions of users",
      "Automated large-scale deployments on Azure with Terraform and Docker",
      "Streamlined release pipelines with Jenkins and improved observability with New Relic",
      "Maintained asynchronous messaging (Kafka, RabbitMQ) and standardised configuration with Salt and Chef",
    ],
  },
  {
    company: "ARMIS Group",
    title: "DevOps Intern / Junior Full-Stack Developer",
    period: "2018 – 2019",
    location: "Porto, PT",
    highlight: "Built a fully automated CI/CD proof of concept",
    bullets: [
      "Built a CI/CD proof-of-concept that delivered fully automated builds and deployments",
      "Developed full-stack features (frontend, backend APIs, and database design) for a real-time road-incident platform",
    ],
  },
];

export const education: Role[] = [
  {
    company: "Instituto Superior de Engenharia do Porto (ISEP)",
    title: "BSc Computer Engineering",
    period: "2015 – 2018",
    location: "Porto, PT",
    bullets: [
      "Specialised in software engineering, algorithms, databases, and web development",
      "Built a sports-venue booking platform over two semesters with ARMIS Group using Scrum, JIRA, and bi-weekly client sprint reviews",
      "Took part in an MIT-led program applying engineering fundamentals to real-world industry projects",
    ],
  },
];

export const skills: SkillGroup[] = [
  {
    category: "Cloud",
    items: ["AWS", "GCP", "Azure", "Hetzner"],
  },
  {
    category: "Infrastructure",
    items: ["Kubernetes", "Docker", "Terraform", "Ansible", "Helm", "Kustomize"],
  },
  {
    category: "CI/CD",
    items: ["ArgoCD", "Buildkite", "Jenkins", "GoCD", "GitHub Actions"],
  },
  {
    category: "Security",
    items: ["Vault", "Sigstore", "Trivy", "Semgrep"],
  },
  {
    category: "AI",
    items: ["AI-Assisted Engineering", "LLM APIs", "Prompt Engineering", "AI Agents"],
  },
  {
    category: "Observability",
    items: ["Prometheus", "Grafana", "Thanos", "Datadog", "SigNoz"],
  },
  {
    category: "Languages",
    items: ["Python", "Bash", "C#", "SQL", "YAML"],
  },
];

export const projects: Project[] = [
  {
    name: "wtc",
    description: "A vendor-neutral change ledger (\"git log for production\"). A self-hosted Go binary that pulls change events from CI, GitOps, and manual runs into one timeline, so you can see what changed, where a commit is deployed, and how two environments differ.",
    tags: ["Go", "SQLite", "Kubernetes", "GitOps", "React"],
    href: "https://github.com/migueljfsc/wtc",
    wip: true,
  },
  {
    name: "pitchboard",
    description: "An animated football tactics board that runs entirely in the browser. Draw a formation, move players between scenes along curved runs, and export the result as MP4, GIF, or PNG with no server rendering. Connectors between groups of players are recomputed every frame, so a unit’s shape deforms as its members move apart.",
    tags: ["React", "TypeScript", "Canvas", "Vite", "Cloudflare Workers"],
    href: "https://pitchboard.migueljfsc.dev",
    wip: true,
  },
  {
    name: "football-tracks",
    description: "A computer-vision pipeline that turns a few seconds of broadcast football into player positions in pitch metres. It solves the camera per frame from one seeded frame, detects and tracks players, and clusters kits into two sides. The output feeds Pitchboard, so a play gets imported and corrected instead of drawn from nothing.",
    tags: ["Python", "OpenCV", "RT-DETR", "NumPy", "Computer Vision"],
    href: "https://github.com/migueljfsc/football-tracks",
    wip: true,
  },
  {
    name: "motorcycle-journey",
    description: "A bilingual (EN/PT) site documenting a motorcycle journey, with trips, tips & tricks, a bike catalog, and per-bike service logs. Built with Astro + Tailwind, deployed to Cloudflare.",
    tags: ["Astro", "Tailwind", "TypeScript", "Cloudflare Workers"],
    href: "https://motojourney.migueljfsc.dev",
    wip: false,
  },
  {
    name: "herdr-gh-actions",
    description: "A GitHub Actions plugin for herdr, a terminal workspace for running AI coding agents side by side. Each agent's worktree gets its own CI status in the sidebar, a pane drills from commits down to searchable log lines, and a failed build goes back to the agent that broke it as a prompt with the failure attached, waiting for one Enter.",
    tags: ["Node.js", "GitHub Actions", "AI Agents", "TUI", "gh CLI"],
    href: "https://github.com/migueljfsc/herdr-gh-actions",
    wip: false,
  },
  {
    name: "aws-app-platform",
    description: "An AWS application platform built with OpenTofu. It has reusable modules (ECS, RDS, ElastiCache, S3, SNS, ECR) and per-environment implementations (ACM, ALB, network, Route53, WAF, IAM), wired up with per-component CI and automated dependency updates.",
    tags: ["OpenTofu", "Terraform", "AWS", "IaC", "GitHub Actions"],
    href: "https://github.com/migueljfsc/aws-app-platform",
    wip: true,
  },
  {
    name: "more coming soon",
    description: "New side projects are in the pipeline, including infrastructure tooling, automation experiments, and a few things I'm tinkering with. Check back soon.",
    tags: ["DevOps", "Automation", "Tinkering"],
    href: "",
    wip: false,
  },
];
