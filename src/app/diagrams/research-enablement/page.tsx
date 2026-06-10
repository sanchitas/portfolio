import ResearchEnablementDiagram from "@/components/ResearchEnablementDiagram";

export default function ResearchEnablementPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-white">
      <ResearchEnablementDiagram autoPlay stepDuration={2400} />
    </main>
  );
}
