import PhasedRegistryDiagram from "@/components/PhasedRegistryDiagram";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-12 bg-white">
      <PhasedRegistryDiagram autoPlay stepDuration={2400} />
    </main>
  );
}
