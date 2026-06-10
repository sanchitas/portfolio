import SupportCasesDiagram from "@/components/SupportCasesDiagram";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-12 bg-white">
      <SupportCasesDiagram autoPlay stepDuration={1400} />
    </main>
  );
}
