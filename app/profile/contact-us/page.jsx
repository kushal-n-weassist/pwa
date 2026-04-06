"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import { Button, Input, Textarea, Spinner } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchLegalContent, 
  selectLegalContent, 
  selectLegalLoading 
} from "@/features/profile/store/legalSlice";

const parseContactContent = (raw) => {
  if (!raw) return { emails: [], phones: [] };
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const emails = [];
  const phones = [];

  lines.forEach((line) => {
    const emailMatch = line.match(/E-?mail\s*=\s*(.+)/i);
    const phoneMatch = line.match(/phone\s*(?:Number)?\s*=\s*(.+)/i);
    if (emailMatch) emails.push(emailMatch[1].trim());
    if (phoneMatch) phones.push(phoneMatch[1].trim());
  });
  return { emails, phones };
};

export default function ContactUs() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const content = useSelector(selectLegalContent("contact_us"));
  const loading = useSelector(selectLegalLoading);

  useEffect(() => {
    if (!content) {
      dispatch(fetchLegalContent("contact_us"));
    }
  }, [dispatch, content]);

  const raw = content?.message?.contact_us || "";
  const { emails, phones } = parseContactContent(raw);

  const formatTel = (num) => num.replace(/\s+/g, "");

  return (
    <div className="min-h-screen bg-white flex flex-col relative font-sans">
      <div className="px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-30 bg-white">
        <button onClick={() => router.back()} className="p-1 active:opacity-50">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Contact Us</h1>
        <div className="w-6" />
      </div>

      <div className="p-6 flex flex-col gap-5 overflow-y-auto pb-32">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Spinner color="primary" size="sm" />
          </div>
        ) : (
          <>
            {emails.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-900">Email</label>
                {emails.map((email, idx) => (
                  <a
                    key={`email-${idx}`}
                    href={`mailto:${email}`}
                    className="flex items-center gap-4 bg-[#F1F1F1] p-4 rounded-xl active:opacity-70 transition-opacity"
                  >
                    <Mail size={20} className="text-gray-400" />
                    <span className="text-sm text-gray-500 font-medium">{email}</span>
                  </a>
                ))}
              </div>
            )}

            {phones.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-900">Phone</label>
                <div className="flex flex-col gap-3">
                  {phones.map((num, idx) => (
                    <a
                      key={`phone-${idx}`}
                      href={`tel:${formatTel(num)}`}
                      className="flex items-center gap-4 bg-[#F1F1F1] p-4 rounded-xl active:opacity-70 transition-opacity"
                    >
                      <Phone size={20} className="text-gray-400" />
                      <span className="text-sm text-gray-500 font-medium">{num}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}



       
      </div>


    </div>
  );
}