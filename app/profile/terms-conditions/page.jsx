"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { Accordion, AccordionItem } from "@heroui/react";
import { useSelector } from "react-redux";
import { selectLegalContent, selectLegalLoading } from "@/features/profile/store/legalSlice";

const MIN_SCALE = 1;
const MAX_SCALE = 4;

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

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

  // ── Pinch-to-zoom ──────────────────────────────────────────────────
  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);
  const lastDistRef = useRef(null);

  const getTouchDist = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const applyScale = useCallback((newScale) => {
    const clamped = clamp(newScale, MIN_SCALE, MAX_SCALE);
    scaleRef.current = clamped;
    setScale(clamped);
    if (contentRef.current) {
      contentRef.current.style.transform = `scale(${clamped})`;
      contentRef.current.style.transformOrigin = "top center";
    }
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        lastDistRef.current = getTouchDist(e.touches);
        e.preventDefault();
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 2 && lastDistRef.current !== null) {
        const dist = getTouchDist(e.touches);
        const delta = dist / lastDistRef.current;
        applyScale(scaleRef.current * delta);
        lastDistRef.current = dist;
        e.preventDefault();
      }
    };

    const onTouchEnd = (e) => {
      if (e.touches.length < 2) lastDistRef.current = null;
    };

    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        applyScale(scaleRef.current + delta);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("wheel", onWheel);
    };
  }, [applyScale]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative font-roboto font-light">
      <div className="bg-white px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 z-30 border-b border-gray-50">
        <button onClick={() => router.back()} className="p-1 active:opacity-50">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Terms of Use</h1>
        <div className="w-6" />
      </div>

      <div
        ref={contentRef}
        className="p-6 flex flex-col gap-6 overflow-y-auto pb-10 will-change-transform"
        style={{ transformOrigin: "top center" }}
      >
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
                {sections.map((item, index) => (
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

      {scale !== 1 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
          <button
            onClick={() => applyScale(1)}
            className="bg-white shadow-lg border border-gray-100 rounded-full px-4 py-2 text-xs text-[#1DA1FA] font-semibold active:opacity-60"
          >
            Reset zoom ({Math.round(scale * 100)}%)
          </button>
        </div>
      )}
    </div>
  );
}