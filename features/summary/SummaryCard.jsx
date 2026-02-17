export default function SummaryCard() {
  return (
    <div className="px-2 mt-4">
      <div className="flex items-center gap-6 rounded-3xl bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-50">
        {/* The Node Icon within the card */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[9px] border-blue-500 bg-white" />

        <p className="text-center text-[14px] font-semibold leading-relaxed text-gray-500">
          Request For Medical / Hospitalisation <br />
          Details from Staff / Representive
        </p>
      </div>
    </div>
  );
}