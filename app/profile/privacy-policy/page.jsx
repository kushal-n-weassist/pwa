"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Card, CardBody, ScrollShadow } from "@heroui/react";
import { useSelector } from "react-redux";
import { selectLegalContent, selectLegalLoading } from "@/features/profile/store/legalSlice";

export default function PrivacyPolicy() {
  const router = useRouter();
  const content = useSelector(selectLegalContent("privacy_policy"));
  const loading = useSelector(selectLegalLoading);

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

// Then use it:
const htmlContent = cleanQuillHtml(content?.message?.privacy_policy || "");  

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
        <Card className="bg-[#EAEAEA] border-none rounded-[20px] h-[75vh] shadow-none">
          <CardBody className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-sm">Loading...</p>
              </div>
            ) : (
              <ScrollShadow
                hideScrollBar={false}
                className="h-full w-full pr-2"
              >
                <div
                  className="text-gray-600 text-[13px] leading-relaxed legal-content"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </ScrollShadow>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="h-8 bg-[#F8FAFC]" />
    </div>
  );
}