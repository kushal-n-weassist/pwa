import React from "react";

export default function HorizontalStepper({ currentStep }) {
  const getSubStep = (s) => (s <= 1 ? 1 : s <= 5 ? 2 : 3);
  const activePoint = getSubStep(currentStep);

  return (
    <div className="flex items-center justify-between w-full px-2 mb-2">
      {[1, 2, 3].map((num) => (
        <React.Fragment key={num}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 
            ${num <= activePoint ? "bg-[#1DA1FA] text-white" : "bg-gray-100 text-gray-400"}`}>
            {num}
          </div>
          {num < 3 && (
            <div className="flex-1 mx-2 h-[3px] bg-gray-100 relative overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-[#1DA1FA] transition-all duration-500 ease-in-out" 
                style={{ width: num < activePoint ? "100%" : num === activePoint ? "50%" : "0%" }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}