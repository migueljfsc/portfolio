// ─────────────────────────────────────────────────────────────────────────
// Canonical source of all CV content.
// Edit here once; the website, PDF, and LinkedIn text all derive from this.
// ─────────────────────────────────────────────────────────────────────────

export interface Role {
  company: string;
  title: string;
  period: string;
  location: string;
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
}

export const profile: Profile = {
  name: "Miguel Cardoso",
  title: "DevOps / Infrastructure Engineer",
  location: "Porto, Portugal",
  email: "migueljfscardoso@gmail.com",
  github: "https://github.com/migueljfsc",
  linkedin: "https://www.linkedin.com/in/miguel-cardoso-32428314b/",
  resume: "/resume.pdf",
};

export const about: string[] = [
  "I'm someone who enjoys figuring things out and learning along the way. I like working with people and doing my part to keep things running smoothly.",
  "When I'm not working, I keep busy with a mix of hobbies — playing guitar, football and videogames, riding my motorcycle, hanging out with my cat, and hitting the gym to relax and recharge. I'm a big football fan, and even coached a U10/11 academy team.",
  "Professionally, I love the IT world — specifically the DevOps / Infrastructure side — because it lets me do what I enjoy most: automating and organising things.",
];

export const experience: Role[] = [
  {
    company: "Icligo",
    title: "DevOps Engineer",
    period: "2026 — Present",
    location: "Porto, PT",
    bullets: [
      "Building infrastructure for an AI-first travel platform covering accommodation, flights, and trip planning",
      "Designing and operating a microservice architecture on Kubernetes for scalability and independent service delivery",
      "Leveraging AI-powered workflows and tooling across development, automation, and day-to-day operations",
      "Establishing CI/CD pipelines and observability foundations for the new platform",
    ],
  },
  {
    company: "FanDuel",
    title: "DevOps Engineer",
    period: "2021 — 2026",
    location: "Porto, PT",
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
    period: "2019 — 2021",
    location: "Porto, PT",
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
    period: "2018 — 2019",
    location: "Porto, PT",
    bullets: [
      "Built a CI/CD proof-of-concept that delivered fully automated builds and deployments",
      "Developed full-stack features — frontend, backend APIs, and database design — for a real-time road-incident platform",
    ],
  },
];

export const education: Role[] = [
  {
    company: "ISEP — Instituto Superior de Engenharia do Porto",
    title: "BSc Computer Engineering",
    period: "2015 — 2018",
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
    description: "A vendor-neutral change ledger — \"git log for production\". A self-hosted Go binary that pulls change events from CI, GitOps, and manual runs into one timeline, so you can see what changed, where a commit is deployed, and how two environments differ.",
    tags: ["Go", "SQLite", "Kubernetes", "GitOps", "React"],
    href: "https://github.com/migueljfsc/wtc",
    wip: true,
  },
  {
    name: "pitchboard",
    description: "An animated football tactics board that runs entirely in the browser — draw a formation, move players between scenes along curved runs, and export the result as MP4, GIF, or PNG with no server rendering. Connectors between groups of players are recomputed every frame, so a unit’s shape deforms as its members move apart.",
    tags: ["React", "TypeScript", "Canvas", "Vite", "GitHub Pages"],
    href: "https://migueljfsc.github.io/pitchboard/",
    wip: true,
  },
  {
    name: "football-tracks",
    description: "A computer-vision pipeline that turns a few seconds of broadcast football into player positions in pitch metres \u2014 the camera solved per frame from one seeded frame, players detected and tracked, kits clustered into two sides. The output feeds Pitchboard, so a play gets imported and corrected instead of drawn from nothing.",
    tags: ["Python", "OpenCV", "RT-DETR", "NumPy", "Computer Vision"],
    href: "https://github.com/migueljfsc/football-tracks",
    wip: true,
  },
  {
    name: "motorcycle-journey",
    description: "A bilingual (EN/PT) site documenting a motorcycle journey — trips, tips & tricks, a bike catalog, and per-bike service logs. Built with Astro + Tailwind, deployed to GitHub Pages.",
    tags: ["Astro", "Tailwind", "TypeScript", "GitHub Pages"],
    href: "https://migueljfsc.github.io/motorcycle-journey/",
    wip: false,
  },
  {
    name: "aws-app-platform",
    description: "An AWS application platform built with OpenTofu — reusable modules (ECS, RDS, ElastiCache, S3, SNS, ECR) and per-environment implementations (ACM, ALB, network, Route53, WAF, IAM), wired up with per-component CI and automated dependency updates.",
    tags: ["OpenTofu", "Terraform", "AWS", "IaC", "GitHub Actions"],
    href: "https://github.com/migueljfsc/aws-app-platform",
    wip: true,
  },
  {
    name: "more coming soon",
    description: "New side projects are in the pipeline — infrastructure tooling, automation experiments, and a few things I'm tinkering with. Check back soon.",
    tags: ["DevOps", "Automation", "Tinkering"],
    href: "",
    wip: false,
  },
];
