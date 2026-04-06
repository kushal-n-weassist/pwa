"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Card, CardBody } from "@heroui/react";
import { useSelector } from "react-redux";
import { selectLegalContent, selectLegalLoading } from "@/features/profile/store/legalSlice";

const MIN_SCALE = 1;
const MAX_SCALE = 4;

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export default function PrivacyPolicy() {
  const router = useRouter();
  const content = useSelector(selectLegalContent("privacy_policy"));
  const loading = useSelector(selectLegalLoading);

  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);
  const lastDistRef = useRef(null);

  const cleanQuillHtml = (html) => {
    const cleaned = html
      .replace(/&nbsp;/g, " ")
      .replace(/<p><span[^>]*>\s*<\/span><\/p>/g, "")
      .replace(/<p><br><\/p>/g, "")
      .replace(/\s{2,}/g, " ");

    const withHeadings = cleaned.replace(
      /(<p[^>]*>)(<span[^>]*>)\s*(\d+\.\s+[A-Z][A-Z\s\/]+)(<\/span><\/p>)/g,
      '<p class="legal-heading">$3</p>'
    );

    const withAddress = withHeadings.replace(
      /(<p[^>]*>)(<span[^>]*>)([^<]*(?:Bengaluru|Karnataka|India|560062)[^<]*)(<\/span><\/p>)/g,
      '<p class="legal-address">$3</p>'
    );

    return withAddress;
  };

  const htmlContent = cleanQuillHtml(content?.message?.privacy_policy || "");

  // ── Pinch-to-zoom ──────────────────────────────────────────────────
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative font-sans">
      <div className="bg-white px-6 pt-12 pb-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <button onClick={() => router.back()} className="p-1 active:opacity-50">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Privacy Policy</h1>
        <div className="w-6" />
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <Card className="bg-[#EAEAEA] border-none rounded-[20px] h-[75vh] shadow-none overflow-hidden">
          <CardBody className="p-6 overflow-y-auto overflow-x-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-sm">Loading...</p>
              </div>
            ) : (
              <div
                ref={contentRef}
                className="text-gray-600 text-[13px] leading-relaxed legal-content will-change-transform"
                style={{ transformOrigin: "top center" }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            )}
          </CardBody>
        </Card>

        {scale !== 1 && (
          <button
            onClick={() => applyScale(1)}
            className="mt-3 self-center text-xs text-[#1DA1FA] font-semibold active:opacity-60"
          >
            Reset zoom ({Math.round(scale * 100)}%)
          </button>
        )}
      </div>

      <div className="h-8 bg-[#F8FAFC]" />
    </div>
  );
}