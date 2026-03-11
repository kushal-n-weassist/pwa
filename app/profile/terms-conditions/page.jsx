"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { Accordion, AccordionItem } from "@heroui/react";
import { useSelector } from "react-redux";
import { selectLegalContent, selectLegalLoading } from "@/features/profile/store/legalSlice";

const parseTermsSections = (html) => {
  if (!html) return { intro: "", sections: [] };

  const cleaned = html
    .replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/<p><br><\/p>/g, "")
    .replace(/<p><span[^>]*>\s*<\/span><\/p>/g, "");

  const parser = new DOMParser();
  const doc = parser.parseFromString(cleaned, "text/html");
  const paragraphs = Array.from(doc.querySelectorAll("p"));

  const sections = [];
  let intro = "";
  let currentSection = null;
  let introLines = [];

  paragraphs.forEach((p) => {
    const text = p.textContent.trim();
    if (!text) return;

    const headingMatch = text.match(/^\s*(\d+)\.\s+(.+)/);

    if (headingMatch) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        id: parseInt(headingMatch[1]),
        title: `${headingMatch[1]}. ${headingMatch[2].trim()}`,
        content: [],
      };
    } else {
      if (currentSection) {
        currentSection.content.push(text);
      } else {
        introLines.push(text);
      }
    }
  });

  if (currentSection) sections.push(currentSection);
  intro = introLines.join(" ").trim();

  return { intro, sections };
};

export default function TermsOfUse() {
  const router = useRouter();
  const content = useSelector(selectLegalContent("terms_of_use"));
  const loading = useSelector(selectLegalLoading);

  const htmlContent = content?.message?.terms_of_use || "";

  const { intro, sections } = React.useMemo(() => {
    if (typeof window === "undefined" || !htmlContent) {
      return { intro: "", sections: [] };
    }
    return parseTermsSections(htmlContent);
  }, [htmlContent]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative font-roboto font-light">
      <div className="bg-white px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 z-30 border-b border-gray-50">
        <button onClick={() => router.back()} className="p-1 active:opacity-50">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Terms of Use</h1>
        <div className="w-6" />
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-10">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        ) : (
          <>
            {intro ? (
              <p className="text-[13px] text-gray-600 leading-relaxed text-justify font-normal">
                {intro}
              </p>
            ) : null}

            {sections.length > 0 && (
              <Accordion
                variant="highlight"
                className="px-0 flex flex-col gap-3"
                selectionMode="multiple"
                fullWidth
              >
                {sections.map((item,index) => (
                  <AccordionItem
                    key={`section-${index}`} 
                    aria-label={item.title}
                    title={
                      <span className="text-white text-[13px] font-bold leading-tight text-left block">
                        {item.title}
                      </span>
                    }
                    indicator={({ isOpen }) => (
                      <div className="bg-white/20 p-1.5 rounded-lg shrink-0">
                        <Plus
                          size={16}
                          className={`text-white transition-transform duration-300 ${
                            isOpen ? "rotate-45" : ""
                          }`}
                        />
                      </div>
                    )}
                    classNames={{
                      base: "bg-[#1DA1FA] rounded-[16px] px-4 py-1.5 shadow-sm border border-blue-400/20",
                      titleWrapper: "text-left flex-1 py-2",
                      trigger: "flex flex-row items-center justify-between gap-3 focus:outline-none",
                      content: "text-white/90 text-[13px] py-4 border-t border-white/10 mt-1 leading-relaxed",
                      indicator: "transition-none",
                    }}
                  >
                    {item.content.join(" ")}
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </>
        )}
      </div>
    </div>
  );
}