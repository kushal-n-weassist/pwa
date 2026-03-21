"use client";

import React, { useState, useRef } from "react";
import { Button, Checkbox, Card, CardBody } from "@heroui/react";
import { ChevronLeft, FileUp, CheckCircle2, AlertCircle, Camera, File } from "lucide-react";
import { useRouter } from "next/navigation";
import { setUploadFile } from "@/features/upload/store/uploadSlice";
import { setFile } from "@/features/upload/store/fileStore";
import { useSelector } from "react-redux";
import { setSameAsPatient } from "@/features/details/store/detailsSlice";
import { useDispatch } from "react-redux";


function parsePAN(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 2);
  const cleanText = text.replace(/[\s\t]+/g, " ");
  const panMatch = cleanText.match(/[A-Z]{5}[0-9]{4}[A-Z]/);
  const pan = panMatch ? panMatch[0] : null;
  const dobMatch = cleanText.match(/\d{2}[\/\-]\d{2}[\/\-]\d{4}/);
  const dob = dobMatch ? dobMatch[0] : null;
  let name = null;
  let father = null;
  const excludedTerms = /INCOME|TAX|DEPT|GOVT|INDIA|PERMANENT|ACCOUNT|CARD|FATHER|NAME|DATE|BIRTH|SIGNATURE|NUMBER|PROTOTYPE/i;
  const potentialNames = lines.filter(l => {
    const isAllCaps = /^[A-Z\s\.]+$/.test(l);
    const isNotBoilerplate = !excludedTerms.test(l);
    return isAllCaps && isNotBoilerplate;
  });
  if (potentialNames.length >= 1) name = potentialNames[0];
  if (potentialNames.length >= 2) father = potentialNames[1];
  return { pan, dob, name, father };
}

function parseAadhaar(text) {
  const cleanText = text.replace(/[\s\t]+/g, " ");
  const aadhaarMatch = cleanText.match(/\d{4}\s\d{4}\s\d{4}/) || cleanText.match(/\d{12}/);
  const aadhaar = aadhaarMatch ? aadhaarMatch[0] : null;
  const dobMatch = cleanText.match(/\d{2}[\/\-]\d{2}[\/\-]\d{4}/);
  const dob = dobMatch ? dobMatch[0] : null;
  const lines = text.split("\n").map(l => l.trim());
  let name = null;
  for (let i = 0; i < lines.length; i++) {
    if (/GOVERNMENT OF INDIA|भारत सरकार/i.test(lines[i])) {
      name = lines[i + 1] || lines[i + 2];
      break;
    }
  }
  return { aadhaar, dob, name };
}

function parseDocument(text, type) {
  if (type === "pan") return parsePAN(text);
  if (type === "aadhaar") return parseAadhaar(text);
  return {};
}


const preprocessImage = (file) =>
  new Promise((resolve, reject) => {
    if (file.type === "application/pdf") { resolve(file); return; }
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.filter = "grayscale(1) contrast(2) brightness(1.1)";
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => resolve(blob), "image/png");
    };
    img.onerror = reject;
  });


const DOC_FIELDS = {
  pan: [
    { key: "name", label: "Name" },
    { key: "father", label: "Father's Name" },
    { key: "dob", label: "Date of Birth" },
    { key: "pan", label: "PAN Number", mono: true },
  ],
  aadhaar: [
    { key: "name", label: "Name" },
    { key: "dob", label: "Date of Birth" },
    { key: "aadhaar", label: "Aadhaar", mono: true },
  ],
};


export default function UploadDocuments() {
  const state = useSelector((state)=>state);
  const router = useRouter();
  const isSameAsInsured = useSelector(state => state.details.insured.isSameAsPatient);
  const dispatch = useDispatch();


  const handleManualEntry = () => router.push("/details");
  const handleContinue = () => router.push("/details");

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col relative">
      <div className="px-6 pt-12 pb-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 flex-1 text-center mr-8">
          Upload Documents
        </h1>
      </div>

      <div className="p-6 flex-grow">
        <Card className="shadow-md border-none rounded-[24px]">
          <CardBody className="gap-6 p-6">

            <AadhaarUploadField
              label="Patient Aadhaar Card"
              frontField="patientFront"   
              backField="patientBack"
            />

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                Is Patient Same As Insured?
              </span>
              <Checkbox
                isSelected={isSameAsInsured}
                onValueChange={(val) => dispatch(setSameAsPatient(val))}
                size="sm"
                classNames={{ wrapper: "after:bg-[#1DA1FA]" }}
              />
            </div>

            {!isSameAsInsured && (
              <AadhaarUploadField
                label="Insured Aadhaar Card"
                frontField="insuredFront"  
                backField="insuredBack"
              />
            )}

            <UploadField
              label="Insured PAN Card"
              docType="pan"
              fileField="insuredPAN"       
            />

          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col items-center gap-2 py-4">
        <p className="text-gray-500 text-[13px] font-medium">Don't have documents handy?</p>
        <button
          onClick={handleManualEntry}
          className="text-[#1DA1FA] font-bold text-[14px] hover:underline active:opacity-70 transition-all"
        >
          Enter Details Manually
        </button>
      </div>

      <div className="p-6 bg-white">
        <Button
          onPress={handleContinue}
          className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-lg shadow-lg active:scale-95"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}


function AadhaarUploadField({ label, frontField, backField }) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="flex gap-3">
        <AadhaarSideSlot
          side="Front"
          hint="Name, DOB & Photo side"
          reduxField={frontField}   
        />
        <AadhaarSideSlot
          side="Back"
          hint="Address & QR Code side"
          reduxField={backField}    
        />
      </div>
    </div>
  );
}


function AadhaarSideSlot({ side, hint, reduxField }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const hasFile = !!fileName;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    setShowOptions(false);

    setFile(reduxField, file);

    dispatch(setUploadFile({ field: reduxField, file }));

    setTimeout(() => {
      setFileName(file.name);
      setLoading(false);
    }, 600);

    e.target.value = "";
  };

  return (
    <div className="flex-1 flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${hasFile ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
          {side}
        </span>
        {hasFile && <CheckCircle2 size={13} className="text-green-500" />}
      </div>

      <div
        onClick={() => !loading && setShowOptions(v => !v)}
        className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all min-h-[100px] ${
          hasFile ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50"
        }`}
      >
        {hasFile ? <CheckCircle2 size={22} className="text-green-500" /> : <FileUp size={22} className="text-gray-400" />}
        {loading ? (
          <span className="text-xs text-blue-500 font-semibold animate-pulse text-center">Processing...</span>
        ) : hasFile ? (
          <span className="text-green-600 font-bold text-[11px] truncate max-w-[100px] text-center">{fileName}</span>
        ) : (
          <>
            <span className="text-[#1DA1FA] font-bold text-xs text-center">Upload {side}</span>
            <span className="text-gray-400 text-[10px] text-center leading-tight">{hint}</span>
          </>
        )}
      </div>

      {showOptions && !loading && (
        <div className="flex gap-2">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 flex flex-col items-center gap-1 border-2 border-[#1DA1FA] rounded-xl py-2 bg-blue-50"
          >
            <Camera size={16} className="text-[#1DA1FA]" />
            <span className="text-[10px] font-bold text-[#1DA1FA]">Camera</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center gap-1 border-2 border-gray-300 rounded-xl py-2 bg-white"
          >
            <File size={16} className="text-gray-500" />
            <span className="text-[10px] font-bold text-gray-500">Gallery</span>
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1 text-red-500 text-[10px] bg-red-50 p-2 rounded-lg">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}

      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden onChange={handleFileChange} />
      <input ref={fileInputRef} type="file" accept="image/*,application/pdf" hidden onChange={handleFileChange} />
    </div>
  );
}


function UploadField({ label, docType, fileField }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const runOCR = async (file) => {
    setLoading(true);
    setData(null);
    setError(null);
    setFileName(file.name);
    setShowOptions(false);

    setFile(fileField, file);
    dispatch(setUploadFile({ field: fileField, file }));

    try {
      const processed = await preprocessImage(file);
      const Tesseract = await import("tesseract.js");
      const result = await Tesseract.recognize(processed, "eng+hin", {
        tessedit_pageseg_mode: 3,
        preserve_interword_spaces: 1,
      });
      const rawText = result.data.text;
      const parsed = parseDocument(rawText, docType);
      const hasAnyData = Object.values(parsed).some(Boolean);
      if (!hasAnyData) {
        setError("Could not extract data. Please provide a clearer image.");
      } else {
        setData({ ...parsed, _raw: rawText });
      }
    } catch (err) {
      setError("Failed to process document.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) runOCR(file);
    e.target.value = "";
  };

  const fields = DOC_FIELDS[docType] || [];
  const hasData = data && Object.values(data).some(v => v !== null && v !== undefined && v !== data._raw);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700">{label}</label>

      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden onChange={handleFileChange} />
      <input ref={fileInputRef} type="file" accept="image/*,application/pdf" hidden onChange={handleFileChange} />

      <div
        onClick={() => !loading && setShowOptions((v) => !v)}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
          hasData ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50"
        }`}
      >
        {hasData ? <CheckCircle2 size={24} className="text-green-500" /> : <FileUp size={24} className="text-gray-400" />}
        {loading ? (
          <span className="text-sm text-blue-500 font-semibold animate-pulse">Processing...</span>
        ) : hasData ? (
          <span className="text-green-600 font-bold text-sm truncate max-w-[200px]">{fileName}</span>
        ) : (
          <span className="text-[#1DA1FA] font-bold text-sm">Click to Upload</span>
        )}
      </div>

      {showOptions && !loading && (
        <div className="flex gap-3">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 flex flex-col items-center gap-2 border-2 border-[#1DA1FA] rounded-2xl py-4 bg-blue-50"
          >
            <Camera size={22} className="text-[#1DA1FA]" />
            <span className="text-xs font-bold text-[#1DA1FA]">Camera</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center gap-2 border-2 border-gray-300 rounded-2xl py-4 bg-white"
          >
            <File size={22} className="text-gray-500" />
            <span className="text-xs font-bold text-gray-500">Gallery</span>
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 p-3 rounded-lg">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {hasData && (
        <div className="text-sm bg-gray-50 p-3 rounded-lg space-y-1 border border-gray-200">
          {fields.map(({ key, label: fieldLabel, mono }) =>
            data[key] ? (
              <p key={key}>
                <span className="font-semibold text-gray-500">{fieldLabel}:</span>{" "}
                <span className={`text-gray-800 ${mono ? "font-mono" : ""}`}>{data[key]}</span>
              </p>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}