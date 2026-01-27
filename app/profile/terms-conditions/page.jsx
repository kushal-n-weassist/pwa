"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { Accordion, AccordionItem } from "@heroui/react";

export default function TermsOfUse() {
  const router = useRouter();

  const introText = `
WeAssist (referred to as "we", "us", "WeAssist") are the authors and publishers of the website https://www.weassist.co.in and its subdomains, if any, (collectively referred to as "Websites") on the world wide web as well as providers of health care related services to customers with the aid of other software applications, including but not limited to the Applications used for Hospital Information System, Customer Relationship Management, Appointments Management, Call Center / Contact Center, Mobile Applications (referred to as "App").
All such Apps, together with Websites visited, accessed, or used by users including at WeAssist premises at centers are referred to as "Services". WeAssist provides the Services, either on its own or in partnership with its agents, affiliates, associates, representatives, or other third parties (together referred to as "Partners").
  `;

  const accordionData = [
    { id: 1, title: "1. What are the \"Terms\"? To whom are they applicable" },
    { id: 2, title: "2. What are the \"Terms\"? To whom are they applicable" },
    { id: 3, title: "3. What are the \"Terms\"? To whom are they applicable" },
    { id: 4, title: "4. What are the \"Terms\"? To whom are they applicable" },
    { id: 5, title: "5. What are the \"Terms\"? To whom are they applicable" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative font-sans">
      <div className="bg-white px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 z-30">
        <button onClick={() => router.back()} className="p-1 active:opacity-50">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Terms of Use</h1>
        <div className="w-6" />
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-10">
        <p className="text-md text-gray-600 leading-relaxed text-justify">
          {introText}
        </p>

        <Accordion 
          variant="highlight"
          className="px-0 flex flex-col gap-3"
          selectionMode="multiple"
        >
          {accordionData.map((item) => (
            <AccordionItem
              key={item.id}
              aria-label={item.title}
              title={
                <span className="text-white text-[13px] font-bold leading-tight">
                  {item.title}
                </span>
              }
              indicator={({ isOpen }) => (
                <div className="bg-white/30 p-1 rounded-md">
                   <Plus 
                    size={18} 
                    className={`text-white transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} 
                  />
                </div>
              )}
              classNames={{
                base: "bg-[#1DA1FA] rounded-[14px] px-4 py-2 shadow-md",
                titleWrapper: "flex-1",
                content: "text-white/90 text-sm py-3 border-t border-white/20 mt-2",
                trigger: "py-2 px-0 focus:outline-none",
                indicator: "ml-2"
              }}
            >
              This is dummy content for the Terms of Use section. You can replace 
              this with the actual legal details regarding who these terms 
              apply to and the nature of the service agreement.
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}