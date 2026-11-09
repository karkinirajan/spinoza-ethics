import type { Metadata } from "next";
import SpinozaEthicsDiagram from "@/components/SpinozaEthicsDiagram";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Interactive visual exploration of Spinoza's Ethics - From Substance to Blessedness",
};

export default function Home(): React.JSX.Element {
  return (
    <main className="w-full min-h-screen bg-slate-50">
      <SpinozaEthicsDiagram />
    </main>
  );
}
