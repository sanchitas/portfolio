import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume — Sanchita Chamberlain",
  description:
    "Lead Product Designer. Enterprise SaaS, developer tools, platform infrastructure.",
};

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 print:py-0 print:px-0">
      <div className="max-w-[760px] mx-auto">
        {/* Header */}
        <header className="mb-8 print:mb-6">
          <h1 className="font-display text-5xl sm:text-6xl tracking-tight text-black uppercase print:text-4xl">
            Sanchita Chamberlain
          </h1>
          <p className="mt-2 font-mono text-sm text-neutral-600 tracking-wide">
            <span className="font-semibold text-black">Lead Product Designer</span>
            {" · "}
            <a
              href="mailto:sanchitachamberlain@gmail.com"
              className="hover:text-black transition-colors"
            >
              sanchitachamberlain@gmail.com
            </a>
            {" · "}
            <a
              href="https://linkedin.com/in/sanchitachamberlain"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
            >
              LinkedIn
            </a>
          </p>
        </header>

        <hr className="border-neutral-200 mb-8 print:mb-6" />

        {/* Experience */}
        <section className="mb-10 print:mb-6">
          <h2 className="font-display text-2xl tracking-tight text-black uppercase mb-6 print:mb-4">
            Experience
          </h2>

          {/* HashiCorp / IBM */}
          <div className="mb-8 print:mb-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 mb-3">
              <h3 className="font-mono text-sm font-semibold text-black">
                HashiCorp / IBM
                <span className="font-normal text-neutral-500">
                  {" · "}Lead Product Designer
                </span>
              </h3>
              <span className="font-mono text-xs text-neutral-400">
                Feb 2023 – Present
              </span>
            </div>
            <ul className="space-y-2.5">
              <Li>
                Turned rough enterprise requirements into three phased deliverables
                (usage → visibility → ownership), shipping two phases in two quarters
                and unblocking <Metric>$30M+</Metric> in enterprise pipeline including
                a <Metric>$20M</Metric> bank migration
              </Li>
              <Li>
                Drove adoption of a tag-based access control architecture across
                HashiCorp's Infrastructure product line — binding registry artifacts to
                projects for usage and visibility control without platform-level RBAC;{" "}
                <Metric>two teams</Metric> building on it and counting
              </Li>
              <Li>
                Designed and shipped the first bulk action UI across all of Terraform
                using existing design system components;{" "}
                <Metric>two adjacent teams</Metric> now building on it as a platform
                standard
              </Li>
              <Li>
                Identified and documented design debt blocking every new feature;
                presented joint design-engineering recommendation to leadership that
                reshaped the team's roadmap and secured{" "}
                <Metric>4 engineers</Metric> and a dedicated quarter
              </Li>
              <Li>
                Owned the research program from scratch — mapped Gong, Salesforce, and
                support data into a reusable guide; ran an{" "}
                <Metric>11,000-person survey</Metric> (
                <Metric>59% completion rate</Metric>) that drove roadmap
                prioritization; infrastructure inherited by newly hired UXR team
              </Li>
              <Li>
                Defined registry unification strategy; got buy-in from leadership,
                shipped a public registry reskin in{" "}
                <Metric>under 2 weeks</Metric> with coding agents, then mocked the
                authenticated vision that became new hire and intern projects
              </Li>
              <Li>
                Coached a designer through <Metric>two promotions</Metric>; mentored a
                PM intern whose PRDs were called excellent by Head of Product, earning
                a return offer
              </Li>
            </ul>
          </div>

          {/* Fastly */}
          <div className="mb-8 print:mb-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 mb-3">
              <h3 className="font-mono text-sm font-semibold text-black">
                Fastly
                <span className="font-normal text-neutral-500">
                  {" · "}Senior Product Designer
                </span>
              </h3>
              <span className="font-mono text-xs text-neutral-400">
                Jan 2017 – Feb 2023
              </span>
            </div>
            <ul className="space-y-2.5">
              <Li>
                Doubled sign-up conversion from <Metric>13.6% to 26.5%</Metric> YoY
                by separating conflicting sales lead-gen and self-serve flows; informed
                pricing and packaging changes that took SMB from{" "}
                <Metric>0% to 300%</Metric> of quota
              </Li>
              <Li>
                Redesigned RBAC from 4 fixed roles to a flexible system with custom
                granular permissions and pre-configured templates, informed by{" "}
                <Metric>30 customer interviews</Metric>; pitched and got approval from
                CTO and CEO
              </Li>
              <Li>
                Led <Metric>7 teams</Metric> without a PM to resolve a structural
                conflict between lead qualification and product-led growth; trained
                brand designers to run qualitative research, making the conversion work
                self-sustaining after handoff
              </Li>
              <Li>
                Analyzed customer integration patterns to surface{" "}
                <Metric>30+ product issues</Metric>, reducing support cases{" "}
                <Metric>50% YTD</Metric>; redesigned 2FA and SSO flows, increasing
                secure feature enablement by <Metric>25%</Metric>
              </Li>
            </ul>
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="font-display text-2xl tracking-tight text-black uppercase mb-4 print:mb-3">
            Education
          </h2>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="font-mono text-sm font-semibold text-black">
              B.S. Industrial & Systems Engineering
              <span className="font-normal text-neutral-500">
                {" — "}Rutgers University
              </span>
            </h3>
          </div>
          <p className="font-mono text-xs text-neutral-500 mt-1">
            Co-op: Johnson & Johnson · Internship: TSYS
          </p>
        </section>

        {/* Print / download footer */}
        <div className="mt-12 pt-6 border-t border-neutral-100 flex items-center justify-between print:hidden">
          <a
            href="/"
            className="font-mono text-xs text-neutral-400 hover:text-black transition-colors"
          >
            ← Back to portfolio
          </a>
          <a
            href="/resume.pdf"
            className="font-mono text-xs text-neutral-400 hover:text-black transition-colors"
          >
            Download PDF ↓
          </a>
        </div>
      </div>
    </main>
  );
}

/* ── Tiny helper components ── */

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="font-mono text-[13px] leading-relaxed text-neutral-700 pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-neutral-300 print:text-[11px] print:leading-snug">
      {children}
    </li>
  );
}

function Metric({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold text-black">{children}</span>
  );
}
