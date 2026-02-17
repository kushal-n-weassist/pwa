"use client";
import StatusNode from "@/features/summary/StatusNode";
import SummaryCard from "@/features/summary/SummaryCard";
import Header from "@/features/summary/ui/Header";
import ActionButton from "@/features/summary/ui/ActionButton";

export default function SummaryPage() {
  const handleContinue = () => {
    console.log("Moving to the next phase...");
  };

  return (
    <main className="relative min-h-screen bg-white pb-32">
      <Header />

      <div className="flex flex-col">
        <StatusNode />
        <SummaryCard />
      </div>

      <ActionButton label="Continue" onClick={handleContinue} />

      {/* Visual Home Indicator for iOS style */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-32 bg-black rounded-full" />
    </main>
  );
}
