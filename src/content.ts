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
    "Product Designer from the Bay Area, currently at IBM (ex-HashiCorp). Previously worked at Fastly, Zurich Insurance, TSYS, and Johnson & Johnson.",
  details: {
    currently:
      "Product Designer, HashiCorp (IBM)\nTerraform Registry · Publisher Experience",
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
  linkLabel?: string;
  image?: string;
  video?: string;
  diagram?: string;
  beforeImage?: string;
  afterImage?: string;
  slideshow?: string[];
  placeholder?: string;
  special?: string;
};

export const projects: Project[] = [
  // ─── Row 1: video + static ───
  {
    year: "2025",
    title: "Public Terraform Registry Redesign",
    company: "HashiCorp / IBM",
    description:
      "Shipped full HDS adoption and accessibility compliance for the registry serving 1M+ monthly visitors and 16B all-time downloads — in under two weeks with coding agents. Foundation for the post-unification Terraform community experience.",
    tags: ["Design Systems", "Developer Experience", "AI Tools"],
    link: "https://registry.terraform.io",
    linkLabel: "Live",
    video: "public-registry.mp4",
    beforeImage: "public-registry-before.png",
    placeholder: "Public registry reskin walkthrough",
  },
  {
    year: "2021",
    title: "Fastly Sign-Up Redesign",
    company: "Fastly",
    description:
      "Turned a single accessibility audit into a full funnel overhaul — untangling a structural conflict between the sales lead-gen and self-serve acquisition flows. Doubled sign-up conversion YoY.",
    tags: ["Growth", "Impact"],
    diagram: "fastly-conversion",
    placeholder: "Sign-up funnel redesign — 2× conversion YoY",
  },
  // ─── Row 2: video + static ───
  {
    year: "2025",
    title: "Bulk Tagging — Registry Control",
    company: "HashiCorp / IBM",
    description:
      "First bulk action shipped in all of Terraform. Extended tagging to usage control — binding modules and providers to projects at scale. Two adjacent teams now building on the pattern.",
    tags: ["Enterprise", "0→1", "Systems Thinking"],
    video: "bulk-tagging.mp4",
    placeholder: "Projects → Registry bulk tag assignment flow",
  },
  {
    year: "2014–2025",
    title: "Award-Winning Merch Design",
    company: "Personal",
    description:
      "Do merch design on the side, including a first-place t-shirt design contest win last year.",
    tags: ["Brand", "Illustration"],
    image: "merch-harding.png",
    placeholder: "BP Open logo",
  },
  // ─── Row 3: video + video ───
  {
    year: "2021",
    title: "Fastly RBAC — Permission Recipes",
    company: "Fastly",
    description:
      "Redesigned from 4 fixed roles to a flexible system with granular custom permissions and product-based templates — informed by 30 customer interviews. Pitched directly to the CTO and CEO.",
    tags: ["Enterprise", "0→1"],
    video: "fastly-rbac.mp4",
    placeholder: "RBAC role management walkthrough",
  },
  {
    year: "2025",
    title: "Design Your Life",
    company: "HashiCorp / IBM",
    description:
      "A hands-on career-path workshop for summer interns. Rated 20/10. Helped software engineers, product managers, and product designers build confidence around career choices, growth plans, and long-term direction.",
    tags: ["Mentorship", "Leadership"],
    image: "interns-workshop.jpg",
    placeholder: "Intern workshop photo",
  },
  {
    year: "2025",
    title: "Private Artifact Redesign",
    company: "HashiCorp / IBM",
    description:
      "Adopted HDS across both private registries, resolved years of accumulated design debt, and split a mixed-persona UX into distinct consumer and publisher workflows. Grassroots foundation for the Terraform Developer Portal.",
    tags: ["Design Systems", "Platform", "0→1"],
    link: "https://developer.hashicorp.com/terraform/cloud-docs/registry/manage/tags",
    linkLabel: "Docs",
    video: "module-ui.mp4",
    beforeImage: "module-ui-before.png",
    placeholder: "Private artifact redesign before/after",
  },
  // ─── Row 4: video + video ───
  {
    year: "2025",
    title: "Registry Search in HCP Terraform",
    company: "HashiCorp / IBM",
    description:
      "Prototyped global search across public and private registries inside HCP Terraform — making logging in a feature, not a mandate, post-unification.",
    tags: ["Vision", "AI Tools", "Developer Experience"],
    video: "search_agent.mp4",
    placeholder: "Registry search prototype walkthrough",
  },
  {
    year: "2025",
    title: "Terraform Registry Private Library",
    company: "HashiCorp / IBM",
    description:
      "Adopted accessible design system standards and rebuilt the browse-and-consume UX — environment tagging, version filtering, and streamlined module discovery for enterprise teams.",
    tags: ["Design Systems", "Enterprise", "Developer Experience"],
    link: "https://developer.hashicorp.com/terraform/cloud-docs/users-teams-organizations/organizations/manage-reserved-tags",
    linkLabel: "Docs",
    video: "environment-tagging.mp4",
    placeholder: "Private library browse and filter walkthrough",
  },
  // ─── Row 5: video + special ───
  {
    year: "2025",
    title: "Publish Stack Component Configs",
    company: "HashiCorp / IBM",
    description:
      "Designed the end-to-end publish flow for Terraform Stacks — enabling teams to share and consume reusable infrastructure configurations as a first-class product experience. The consumption model at the heart of the Stacks ecosystem.",
    tags: ["0→1", "Developer Experience"],
    video: "stack-publish.mp4",
    link: "https://developer.hashicorp.com/terraform/language/block/stack/tfcomponent",
    linkLabel: "Docs",
    placeholder: "Stack component configuration publish flow",
  },
];
