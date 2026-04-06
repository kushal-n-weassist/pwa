export default function StatusNode() {
  return (
    <div className="relative flex items-start gap-4 px-10 pt-10">
      {/* Dashed Line: Positioned absolutely behind the circle */}
      <div className="absolute left-[52px] top-[72px] h-20 w-0 border-l-2 border-dashed border-gray-300" />

      {/* The Blue Circle Node */}
      <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[9px] border-blue-500 bg-white" />

      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-extrabold text-gray-900 leading-tight">
          Self Service Created Successfully
        </h2>
        <p className="font-medium text-center text-gray-500">
          Application Number-SSR 07 24 2024
        </p>
      </div>
    </div>
  );
}