// ─── Portfolio Content ───────────────────────────────────
// Single source of truth for all site content.
// Edit here, not in page components.

export const siteConfig = {
  name: "Sanchita Chamberlain",
  title: "Staff Product Designer",
  location: "San Rafael, CA",
  available: true,
};

export const hero = {
  eyebrow: "Product Designer · Platform & Developer Tools",
  tagline: "Here to shape the problem,\nnot decorate the solution.",
};

export const links = {
  email: "sanchitachamberlain@gmail.com",
  linkedin: "https://linkedin.com/in/sanchitachamberlain",
  resume: "/resume.pdf", // drop a PDF in /public
};

export const about = {
  statement:
    "Most effective when embedded with engineering and product. I design the system around the product — the phasing, the architecture, the cross-functional alignment that makes it shippable.",
  details: {
    currently:
      "Lead Product Designer, HashiCorp (IBM)\nTerraform Registry · Publisher Experience",
    targeting:
      "Staff IC roles at the intersection of\nAI, developer tools & infrastructure",
    background:
      "Industrial & Systems Engineering, Rutgers\n12 years in enterprise & platform design",
  },
};

export type Project = {
  year: string;
  title: string;
  company: string;
  description: string;
  tags: string[];
  link?: string;
  image?: string;
  video?: string;
  diagram?: string;
  beforeImage?: string;
  afterImage?: string;
  slideshow?: string[];
  placeholder?: string;
};

export const projects: Project[] = [
  // ─── Row 1: Public registry + Conversion (visual variety) ───
  {
    year: "2025",
    title: "Public Registry Reskin",
    company: "HashiCorp / IBM",
    description:
      "Shipped a registry.terraform.io reskin in under two weeks with coding agents — adopted HDS, met accessibility standards, overwhelmingly positive community feedback.",
    tags: ["Vision", "AI Tools", "Developer Experience"],
    video: "public-registry.mp4",
    beforeImage: "public-registry-before.png",
    placeholder: "Record: Quick scroll through live registry.terraform.io",
  },
  {
    year: "2021",
    title: "Conversion Optimization",
    company: "Fastly",
    description:
      "Turned an accessibility fix into a full funnel redesign. Doubled sign-up conversion YoY. Took SMB from 0% to 300% quota attainment.",
    tags: ["Growth", "Impact"],
    diagram: "fastly-conversion",
    placeholder: "Sign-up funnel redesign — 2x conversion YoY",
  },
  // ─── Row 2: Tagging + Stack ───
  {
    year: "2025",
    title: "Bulk Tagging — Registry Control",
    company: "HashiCorp / IBM",
    description:
      "Tag-based architecture maps modules and providers to projects, enabling visibility and usage control without platform-level RBAC.",
    tags: ["Enterprise", "0→1", "Systems Thinking"],
    video: "bulk-tagging.mp4",
    placeholder: "Record: Projects → Registry bulk tag assignment flow",
  },
  // ─── Row 3: Search + Module (different UI types) ───
  {
    year: "2025",
    title: "Agentic Search Vision",
    company: "HashiCorp / IBM",
    description:
      "Prototyped an AI-powered search experience for the public registry — natural language queries surfacing modules, providers, and usage patterns.",
    tags: ["Vision", "AI Tools"],
    video: "search_agent.mp4",
    placeholder: "Agentic search prototype walkthrough",
  },
  // ─── Row 3 cont: Module UI ───
  {
    year: "2025",
    title: "Module UI Refresh",
    company: "HashiCorp / IBM",
    description:
      "Rebuilt the module detail experience — resolved design debt, adopted HDS, and separated consumer and producer workflows.",
    tags: ["Design Systems", "Platform"],
    video: "module-ui.mp4",
    beforeImage: "module-ui-before.png",
    placeholder: "Module UI before/after",
  },
  {
    year: "2021",
    title: "RBAC Redesign",
    company: "Fastly",
    description:
      "Redesigned Fastly's role-based access control from scratch — custom roles, service groups, and granular permissions for enterprise customers.",
    tags: ["Enterprise", "0→1"],
    video: "fastly-rbac.mp4",
    placeholder: "Fastly RBAC role management walkthrough",
  },
  // ─── Row 4: Env tagging + Stack (different flows) ───
  {
    year: "2025",
    title: "Environment Tagging",
    company: "HashiCorp / IBM",
    description:
      "New environment tag key lets teams denote dev/staging/prod across module and provider versions — version list scoped by environment.",
    tags: ["Enterprise", "Developer Experience"],
    video: "environment-tagging.mp4",
    placeholder: "Record: Environment tag on version list view",
  },
  {
    year: "2025",
    title: "Stack Component Publish",
    company: "HashiCorp / IBM",
    description:
      "End-to-end configuration publish flow for stack components — shipped but never highlighted. First-class support for reusable infrastructure patterns.",
    tags: ["0→1", "Developer Experience"],
    video: "stack-publish.mp4",
    placeholder: "Record: Stack component configuration publish flow",
  },
  // ─── Row 5: Fun stuff ───
  {
    year: "2014–2025",
    title: "Merch & Brand Design",
    company: "Personal",
    description:
      "Logos, event posters, and brand identity work — disc golf tournaments, local businesses, and community projects.",
    tags: ["Brand", "Illustration"],
    slideshow: ["merch-bpopen-poster.png", "merch-harding.png", "merch-bropen-logo.png", "merch-cubes.png"],
    placeholder: "Merch and brand design slideshow",
  },
  {
    year: "2025",
    title: "Design Your Life Workshop",
    company: "HashiCorp / IBM",
    description:
      "Summer intern career path workshop — mentorship is the best part of the job.",
    tags: ["Mentorship", "Leadership"],
    image: "interns-workshop.jpg",
    placeholder: "Intern workshop photo",
  },
];
