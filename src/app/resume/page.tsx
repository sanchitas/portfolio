import type { Metadata } from "next";
import ResumePDFActions from "@/components/ResumePDFActions";

export const metadata: Metadata = {
  title: "Resume — Sanchita Chamberlain",
  description:
    "Product Designer. Enterprise SaaS, developer tools, platform infrastructure.",
};

export default function ResumePage() {
  return (
    <main
      className="min-h-screen px-5 pt-20 pb-12 sm:px-10 sm:pt-28 sm:pb-16 print:!p-0"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
        <header style={{ marginBottom: 20 }}>
          <h1
            className="resume-name"
            style={{
              fontFamily: "'Enquix', var(--font-bebas), sans-serif",
              fontSize: "clamp(36px, 5.5vw, 56px)",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              color: "var(--fg)",
              textTransform: "uppercase",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Sanchita Chamberlain
          </h1>
          <p className="font-mono" style={{ marginTop: 10, fontSize: 12, color: "var(--fg-muted)", letterSpacing: "0.02em" }}>
            <span style={{ fontWeight: 600, color: "var(--fg)" }}>Product Designer</span>
            {" · "}
            <a href="mailto:sanchitachamberlain@gmail.com">
              sanchitachamberlain@gmail.com
            </a>
            {" · "}
            <a
              href="https://linkedin.com/in/sanchitachamberlain"
              target="_blank"
              rel="noopener noreferrer"
            >
              /in/sanchitachamberlain
            </a>
            {" · "}
            <a
              href="https://sanchitachamberlain.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              sanchitachamberlain.com
            </a>
          </p>
        </header>

        <hr style={{ border: "none", borderTop: "1px solid var(--border-mid)", marginBottom: 20 }} />

        {/* Experience */}
        <section style={{ marginBottom: 48 }}>
          <h2 className="font-mono" style={{ fontSize: 22, letterSpacing: "0.01em", color: "var(--fg)", textTransform: "uppercase", marginBottom: 20, fontWeight: 700 }}>
            Experience
          </h2>

          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "0 16px", marginBottom: 20 }}>
              <h3 className="font-mono" style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)", margin: 0 }}>
                HashiCorp / IBM
                <span style={{ fontWeight: 400, color: "var(--fg-faint)" }}>
                  {" · "}Lead Product Designer
                </span>
              </h3>
              <span className="font-mono" style={{ fontSize: 12, color: "var(--fg-faint)" }}>
                Feb 2023 – Present
              </span>
            </div>
            <ul style={{ listStyleType: "disc", paddingLeft: 24, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
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
                Defined registry unification strategy for a platform serving{" "}
                <Metric>1M+ monthly visitors</Metric> and{" "}
                <Metric>16B all-time downloads</Metric>; got buy-in from leadership,
                shipped a public registry reskin in{" "}
                <Metric>under 2 weeks</Metric> with coding agents, then mocked the
                authenticated vision that became new hire and intern projects
              </Li>
              <Li>
                Coached a designer through <Metric>two promotions</Metric>; currently
                mentoring a PM intern whose PRDs were called excellent by Head of Product,
                earning a return offer
              </Li>
            </ul>
          </div>

          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "0 16px", marginBottom: 20 }}>
              <h3 className="font-mono" style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)", margin: 0 }}>
                Fastly
                <span style={{ fontWeight: 400, color: "var(--fg-faint)" }}>
                  {" · "}Senior Product Designer
                </span>
              </h3>
              <span className="font-mono" style={{ fontSize: 12, color: "var(--fg-faint)" }}>
                Jan 2017 – Feb 2023
              </span>
            </div>
            <ul style={{ listStyleType: "disc", paddingLeft: 24, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              <Li>
                Doubled sign-up conversion from <Metric>13.6% to 26.5%</Metric> YoY
                by separating conflicting sales lead-gen and self-serve acquisition
                funnels — untangling a structural conflict between lead qualification
                and product-led growth; reduced friction for developers while improving
                lead quality for sales
              </Li>
              <Li>
                Redesigned RBAC from 4 fixed roles to a flexible system with custom
                granular permissions and pre-configured templates, informed by{" "}
                <Metric>30 customer interviews</Metric>; pitched and got approval from
                CTO and CEO
              </Li>
              <Li>
                Analyzed customer integration patterns to surface{" "}
                <Metric>30+ product issues</Metric>, reducing support cases{" "}
                <Metric>50% YTD</Metric>; redesigned 2FA and SSO flows, increasing
                secure feature enablement by <Metric>23%</Metric>
              </Li>
              <Li>
                Spent the first year at Fastly in <strong style={{ fontWeight: 700, color: "var(--fg)" }}>customer support engineering</strong>,
                troubleshooting production traffic and edge behavior for enterprise
                customers, before moving into product design.
              </Li>
            </ul>
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="font-mono" style={{ fontSize: 22, letterSpacing: "0.01em", color: "var(--fg)", textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>
            Education
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "0 16px" }}>
            <h3 className="font-mono" style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)", margin: 0 }}>
              B.S. Industrial & Systems Engineering
              <span style={{ fontWeight: 400, color: "var(--fg-faint)" }}>
                {" — "}Rutgers University
              </span>
            </h3>
          </div>
          <p className="font-mono" style={{ fontSize: 12, color: "var(--fg-faint)", marginTop: 6 }}>
            Co-op: Johnson & Johnson · Internship: TSYS
          </p>
        </section>

        {/* Print / download footer */}
        <div
          style={{
            marginTop: 80,
            paddingTop: 32,
            paddingBottom: 48,
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className="print:!hidden"
        >
          <a href="/" className="font-mono" style={{ fontSize: 12, color: "var(--fg-faint)" }}>
            ← Back to portfolio
          </a>
          <ResumePDFActions />
        </div>
      </div>
    </main>
  );
}

/* ── Tiny helper components ── */

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="font-mono" style={{ fontSize: 13, lineHeight: 1.8, color: "var(--fg-muted)", margin: 0, padding: 0 }}>
      {children}
    </li>
  );
}

function Metric({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono" style={{ fontWeight: 600, color: "var(--fg)" }}>{children}</span>
  );
}
