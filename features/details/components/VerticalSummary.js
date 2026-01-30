import React from "react";
import { Accordion, AccordionItem } from "@heroui/react";

export default function VerticalSummary({ data, onEdit }) {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available to display
      </div>
    );
  }

  const sections = [
    { 
      key: "patient",
      title: "Patient Details", 
      data: data.patient || {},
      step: 1,
    },
    { 
      key: "insured",
      title: "Insured Details", 
      data: data.insured?.isSameAsPatient 
        ? { Status: "Same as Patient" } 
        : (data.insured || {}),
      step: 2,
    },
    { 
      key: "policy",
      title: "Policy Details", 
      data: data.policy || {},
      step: 6,
    },
  ];

  return (
    <div className="relative">
      <div className="absolute left-3 top-8 bottom-8 w-[2px] bg-[#1DA1FA]" />

      <div className="space-y-0">
        {sections.map((section, idx) => {
          const hasData = Object.keys(section.data).filter(
            key => key !== "isSameAsPatient" && section.data[key]
          ).length > 0;

          return (
            <Accordion 
              key={section.key}
              variant="light"
              defaultExpandedKeys={idx === 0 ? [section.key] : []}
              className="px-0"
            >
              <AccordionItem
                key={section.key}
                aria-label={section.title}
                className="relative pl-12"
                classNames={{
                  trigger: "py-4 px-0",
                  title: "text-base font-bold",
                  content: "pb-6 pt-2 px-0",
                  indicator: "text-gray-400"
                }}
                title={
                  <div className="flex items-center">
                    <div className="absolute left-0 top-4 w-6 h-6 rounded-full bg-[#1DA1FA] z-10 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    
                    <span className="text-gray-900 font-bold">{section.title}</span>
                  </div>
                }
              >
                {hasData ? (
                  <div className="space-y-2">
                    {Object.entries(section.data).map(([key, value]) => (
                      value && key !== "isSameAsPatient" && (
                        <div key={key} className="flex flex-col gap-1 pb-2">
                          <span className="text-[11px] text-gray-500 font-semibold">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-[14px] text-gray-900 font-normal">
                            {value}
                          </span>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 italic">
                    No data entered yet
                  </div>
                )}
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}