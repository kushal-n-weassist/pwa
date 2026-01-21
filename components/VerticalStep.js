// components/VerticalStep.js
export default function VerticalStep({ number, title, isLast }) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full border-4 border-[#1DA1FA] bg-white flex items-center justify-center shrink-0">
          <div className="w-3 h-3 bg-[#1DA1FA] rounded-full" />
        </div>
        
        {!isLast && (
          <div className="w-[3px] h-16 bg-[#1DA1FA] my-1 rounded-full opacity-80" />
        )}
      </div>

      <div className="flex flex-col pt-1">
        <span className="text-xs text-gray-500 font-medium mb-1">
          {number}
        </span>
        <h3 className="text-[15px] font-bold text-gray-900 leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
}