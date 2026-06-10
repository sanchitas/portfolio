import RegistryArchitectureDiagram from "@/components/RegistryArchitectureDiagram";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-12 bg-white">
      <RegistryArchitectureDiagram autoPlay stepDuration={1200} />
    </main>
  );
}
