import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion"; 

export default function VerticalSummary() {
  const formData = useSelector((state) => state.details);
  const [expandedSection, setExpandedSection] = useState("Patient Details");

  const sections = [
    { 
      title: "Patient Details", 
      data: formData?.patient || {} 
    },
    { 
      title: "Insured Details", 
      data: formData?.insured?.isSameAsPatient 
        ? { Status: "Same as Patient" } 
        : formData?.insured || {} 
    },
    { 
      title: "Policy Details", 
      data: formData?.policy || {} 
    },
  ];

  return (
    <div className="relative">
      <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#1DA1FA]" />
      <div className="space-y-4">
        {sections.map((section, idx) => {
          const isExpanded = expandedSection === section.title;
          return (
            <div key={idx} className="relative pl-10">
              <div 
                className="cursor-pointer flex items-center group"
                onClick={() => setExpandedSection(isExpanded ? null : section.title)}
              >
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#1DA1FA] border-[4px] border-white ring-1 ring-[#1DA1FA] z-10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
                <h3 className={`font-bold transition-colors ${isExpanded ? 'text-gray-900' : 'text-gray-500'}`}>
                  {section.title}
                </h3>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 mb-6 bg-[#F8FAFC] rounded-2xl p-5 border border-blue-50 space-y-4">
                      {Object.entries(section.data || {}).map(([key, value]) => (
                        value && key !== "isSameAsPatient" && (
                          <div key={key} className="flex flex-col border-b border-gray-100 last:border-0 pb-2">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-black">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </span>
                            <span className="text-[14px] text-gray-700 font-semibold">
                              {String(value)}
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}