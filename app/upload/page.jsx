"use client";

import React, { useState, useRef } from "react";
import { Button, Checkbox } from "@heroui/react";
import { ChevronLeft, FileUp, CheckCircle2, Camera, File } from "lucide-react";
import { useRouter } from "next/navigation";
import { setUploadFile } from "@/features/upload/store/uploadSlice";
import { setFile } from "@/features/upload/store/fileStore";
import { useSelector, useDispatch } from "react-redux";
import { setSameAsPatient, updateField } from "@/features/details/store/detailsSlice";
import { useOcrIdCardApiMutation } from "@/src/store/digioApi";
import toast from "react-hot-toast";
import { useRequireScanner } from "@/hooks/useRequireScanner";


export default function UploadDocuments() {
  const router = useRouter();
  const isSameAsInsured = useSelector((state) => state.details.insured.isSameAsPatient);
  const dispatch = useDispatch();
  useRequireScanner();

  const [uploaded, setUploaded] = useState({
    patientFront: false,
    patientBack: false,
    proposerFront: false,
    proposerBack: false,
    proposerPAN: false,
    patientInsurance: false,
    proposerPolicy: false,
  });
  const [consultationUploaded, setConsultationUploaded] = useState([false]);
  const hasConsultation = consultationUploaded.some(Boolean);

  const markUploaded = (field) =>
    setUploaded((prev) => ({ ...prev, [field]: true }));


  const canContinue = isSameAsInsured
    ? uploaded.patientFront && uploaded.proposerPAN && uploaded.patientInsurance && hasConsultation
    : uploaded.patientFront && uploaded.proposerFront && uploaded.proposerPAN && uploaded.patientInsurance && uploaded.proposerPolicy && hasConsultation;


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

      <div className="p-6 flex-grow flex flex-col gap-4">

        {/* Patient Section */}
        <div className="bg-white rounded-[24px] shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#1DA1FA]" />
            <span className="text-[13px] font-bold text-gray-700 uppercase tracking-wider">Patient</span>
          </div>
          <AadhaarUploadField
            label="Aadhaar Card"
            frontField="patientFront"
            backField="patientBack"
            isInsured={false}
            onFrontSet={() => markUploaded("patientFront")}
            onBackSet={() => markUploaded("patientBack")}
          />
          <div className="border-t border-gray-100 pt-4">
            <UploadField
              label="Patient Policy Document"
              docType="other"
              fileField="patientInsurance"
              onFileSet={() => markUploaded("patientInsurance")}
            />
          </div>
        </div>

        {/* Same as Proposer toggle */}
        <div className="bg-white rounded-[20px] shadow-sm px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[14px] font-semibold text-gray-800">Patient is the Proposer?</p>
            <p className="text-[12px] text-gray-400 mt-0.5">Toggle off to upload separate proposer documents</p>
          </div>
          <Checkbox
            isSelected={isSameAsInsured}
            onValueChange={(val) => dispatch(setSameAsPatient(val))}
            size="sm"
            classNames={{ wrapper: "after:bg-[#1DA1FA]" }}
          />
        </div>

        {/* Proposer Section — only when NOT same */}
        {!isSameAsInsured && (
          <div className="bg-white rounded-[24px] shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              <span className="text-[13px] font-bold text-gray-700 uppercase tracking-wider">Proposer</span>
            </div>
            <AadhaarUploadField
              label="Aadhaar Card"
              frontField="proposerFront"
              backField="proposerBack"
              isInsured={true}
              onFrontSet={() => markUploaded("proposerFront")}
              onBackSet={() => markUploaded("proposerBack")}
            />
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
              <UploadField
                label="PAN Card"
                docType="pan"
                fileField="proposerPAN"
                onFileSet={() => markUploaded("proposerPAN")}
              />
              <UploadField
                label="Proposer Policy Document"
                docType="other"
                fileField="proposerPolicy"
                onFileSet={() => markUploaded("proposerPolicy")}
              />
            </div>
          </div>
        )}

        {/* PAN when same as patient */}
        {isSameAsInsured && (
          <div className="bg-white rounded-[24px] shadow-sm p-5">
            <UploadField
              label="PAN Card"
              docType="pan"
              fileField="proposerPAN"
              onFileSet={() => markUploaded("proposerPAN")}
            />
          </div>
        )}

        {/* Consultation Papers & Reports — always shown */}
        <ConsultationSection
          consultationUploaded={consultationUploaded}
          setConsultationUploaded={setConsultationUploaded}
        />

        {/* Requirements hint */}
        {!canContinue && (
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
            <p className="text-[11px] text-gray-400 font-medium">
              {isSameAsInsured
                ? "Upload Patient Aadhaar, Policy Doc, PAN + at least one Consultation Paper to continue"
                : "Upload all required documents in each section to continue"}
            </p>
          </div>
        )}

      </div>

      <div className="flex flex-col items-center gap-2 py-4">
        <p className="text-gray-500 text-[13px] font-medium">Don&apos;t have documents handy?</p>
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
          isDisabled={!canContinue}
          className={`w-full font-bold h-14 rounded-xl text-lg shadow-lg active:scale-95 transition-all ${
            canContinue
              ? "bg-[#1DA1FA] text-white"
              : "bg-gray-100 text-gray-400 shadow-none"
          }`}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}


function AadhaarUploadField({ label, frontField, backField, isInsured = true, onFrontSet, onBackSet }) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="flex gap-3">
        <AadhaarSideSlot
          side="Front"
          hint="Name, DOB & Photo side"
          reduxField={frontField}
          docType="aadhaar"
          isInsured={isInsured}
          onFileSet={onFrontSet}
        />
        <AadhaarSideSlot
          side="Back"
          hint="Address & QR Code side"
          reduxField={backField}
          docType="aadhaar"
          isInsured={isInsured}
          onFileSet={onBackSet}
        />
      </div>
    </div>
  );
}


function AadhaarSideSlot({ side, hint, reduxField, docType, isInsured = true, onFileSet }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [ocrFailed, setOcrFailed] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [ocrIdCardApi] = useOcrIdCardApiMutation();
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const hasFile = !!fileName;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setOcrFailed(false);
    setShowOptions(false);
    setFileName(file.name);
    setFile(reduxField, file);
    dispatch(setUploadFile({ field: reduxField, file }));
    onFileSet?.();

    try {
      const formData = new FormData();
      const partKey = side.toLowerCase() === "back" ? "back_part" : "front_part";
      formData.append(partKey, file);
      formData.append("id_type", docType.toUpperCase());
      formData.append("unique_request_id", `req_${Date.now()}_${Math.random().toString(36).substring(7)}`);

      const response = await ocrIdCardApi(formData).unwrap();
      if (response) {
        const d = response;
        if (side === "Front" && docType === "aadhaar") {
          const s = isInsured ? "insured" : "patient";
          if (d.name) dispatch(updateField({ section: s, field: "fullName", value: d.name }));
          if (d.dob) dispatch(updateField({ section: s, field: "dob", value: d.dob.split("/").reverse().join("-") }));
          if (d.id_no || d.aadhaar_number) dispatch(updateField({ section: "identity", field: "aadharNumber", value: d.id_no || d.aadhaar_number }));
          const rg = d.gender || d.sex;
          if (rg) {
            const g = rg.toLowerCase();
            const pg = g.startsWith("m") ? "Male" : g.startsWith("f") ? "Female" : null;
            if (pg) dispatch(updateField({ section: s, field: "gender", value: pg }));
          }
        }
        if (d.address_information) {
          const s = isInsured ? "address" : "patient";
          const ai = d.address_information;
          if (ai.pincode) dispatch(updateField({ section: s, field: "pincode", value: ai.pincode }));
          if (ai.state) dispatch(updateField({ section: s, field: "state", value: ai.state }));
          if (ai.district_or_city) dispatch(updateField({ section: s, field: "city", value: ai.district_or_city }));
          if (d.address) {
            dispatch(updateField({ section: s, field: "address1", value: d.address }));
            const m = d.address.match(/Mobile[:\s]+(\d{10})/i);
            if (m) dispatch(updateField({ section: "identity", field: "mobileNumber", value: m[1] }));
          }
        }
        toast.success("Details auto-filled!", { duration: 3000 });
      }
    } catch (err) {
      console.error("Digio OCR Error:", err);
      setOcrFailed(true);
      toast.error("Auto-read failed. Document saved — fill details manually.", {
        duration: 5000,
        style: { background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "14px", color: "#92400e" },
        icon: "⚠️",
      });
    } finally {
      setLoading(false);
    }
    e.target.value = "";
  };

  return (
    <div className="flex-1 flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${hasFile ? (ocrFailed ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600") : "bg-gray-100 text-gray-500"}`}>
          {side}
        </span>
        {hasFile && !ocrFailed && <CheckCircle2 size={13} className="text-green-500" />}
      </div>

      <div
        onClick={() => !loading && setShowOptions((v) => !v)}
        className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all min-h-[100px] ${
          hasFile ? (ocrFailed ? "border-amber-300 bg-amber-50" : "border-green-400 bg-green-50") : "border-gray-200 bg-gray-50"
        }`}
      >
        {hasFile
          ? ocrFailed ? <span className="text-xl"></span> : <CheckCircle2 size={22} className="text-green-500" />
          : <FileUp size={22} className="text-gray-400" />}
        {loading ? (
          <span className="text-xs text-blue-500 font-semibold animate-pulse text-center">Reading...</span>
        ) : hasFile ? (
          <span className={`font-bold text-[11px] truncate max-w-[100px] text-center ${ocrFailed ? "text-amber-600" : "text-green-600"}`}>
            {ocrFailed ? "Saved" : fileName}
          </span>
        ) : (
          <>
            <span className="text-[#1DA1FA] font-bold text-xs text-center">Upload {side}</span>
            <span className="text-gray-400 text-[10px] text-center leading-tight">{hint}</span>
          </>
        )}
      </div>

      {showOptions && !loading && (
        <div className="flex gap-2">
          <button onClick={() => cameraInputRef.current?.click()} className="flex-1 flex flex-col items-center gap-1 border-2 border-[#1DA1FA] rounded-xl py-2 bg-blue-50">
            <Camera size={16} className="text-[#1DA1FA]" />
            <span className="text-[10px] font-bold text-[#1DA1FA]">Camera</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex flex-col items-center gap-1 border-2 border-gray-300 rounded-xl py-2 bg-white">
            <File size={16} className="text-gray-500" />
            <span className="text-[10px] font-bold text-gray-500">Gallery</span>
          </button>
        </div>
      )}

      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden onChange={handleFileChange} />
      <input ref={fileInputRef} type="file" accept="image/*,application/pdf" hidden onChange={handleFileChange} />
    </div>
  );
}


function UploadField({ label, docType, fileField, onFileSet }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [ocrFailed, setOcrFailed] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [ocrIdCardApi] = useOcrIdCardApiMutation();
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const hasFile = !!fileName;

  const runOCR = async (file) => {
    setLoading(true);
    setOcrFailed(false);
    setFileName(file.name);
    setShowOptions(false);
    setFile(fileField, file);
    dispatch(setUploadFile({ field: fileField, file }));
    onFileSet?.();

    if (docType === "other") {
      setLoading(false);
      toast.success("Document saved!", { duration: 2500 });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("front_part", file);
      formData.append("id_type", docType.toUpperCase());
      formData.append("unique_request_id", `req_${Date.now()}_${Math.random().toString(36).substring(7)}`);

      const response = await ocrIdCardApi(formData).unwrap();
      if (response) {
        const d = response;
        if (docType === "pan") {
          const pan = d.id_no || d.pan_number;
          if (pan) dispatch(updateField({ section: "identity", field: "panNumber", value: pan }));
        }
        toast.success("PAN number extracted!", { duration: 3000 });
      }
    } catch (err) {
      console.error("Digio OCR Error:", err);
      setOcrFailed(true);
      toast.error("Auto-read failed. Document saved — fill details manually.", {
        duration: 5000,
        style: { background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "14px", color: "#92400e" },
        icon: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) runOCR(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden onChange={handleFileChange} />
      <input ref={fileInputRef} type="file" accept="image/*,application/pdf" hidden onChange={handleFileChange} />

      <div
        onClick={() => !loading && setShowOptions((v) => !v)}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
          hasFile ? (ocrFailed ? "border-amber-300 bg-amber-50" : "border-green-400 bg-green-50") : "border-gray-200 bg-gray-50"
        }`}
      >
        {hasFile
          ? ocrFailed ? <span className="text-2xl">⚠️</span> : <CheckCircle2 size={24} className="text-green-500" />
          : <FileUp size={24} className="text-gray-400" />}
        {loading ? (
          <span className="text-sm text-blue-500 font-semibold animate-pulse">Reading document...</span>
        ) : hasFile ? (
          <span className={`font-bold text-sm truncate max-w-[200px] ${ocrFailed ? "text-amber-600" : "text-green-600"}`}>
            {ocrFailed ? "Saved · fill manually" : fileName}
          </span>
        ) : (
          <span className="text-[#1DA1FA] font-bold text-sm">Click to Upload</span>
        )}
      </div>

      {showOptions && !loading && (
        <div className="flex gap-3">
          <button onClick={() => cameraInputRef.current?.click()} className="flex-1 flex flex-col items-center gap-2 border-2 border-[#1DA1FA] rounded-2xl py-4 bg-blue-50">
            <Camera size={22} className="text-[#1DA1FA]" />
            <span className="text-xs font-bold text-[#1DA1FA]">Camera</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex flex-col items-center gap-2 border-2 border-gray-300 rounded-2xl py-4 bg-white">
            <File size={22} className="text-gray-500" />
            <span className="text-xs font-bold text-gray-500">Gallery</span>
          </button>
        </div>
      )}
    </div>
  );
}


function ConsultationSection({ consultationUploaded, setConsultationUploaded }) {
  const [count, setCount] = useState(1);

  const addMore = () => {
    setConsultationUploaded((prev) => [...prev, false]);
    setCount((c) => c + 1);
  };

  const remove = (index) => {
    setConsultationUploaded((prev) => prev.filter((_, i) => i !== index));
    setCount((c) => c - 1);
  };

  const indices = Array.from({ length: consultationUploaded.length }, (_, i) => i);

  return (
    <div className="bg-white rounded-[24px] shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-[13px] font-bold text-gray-700 uppercase tracking-wider">Consultation Papers</span>
      </div>

      <p className="text-[11px] text-gray-400 -mt-1">Consultation papers and reports suggesting treatment</p>

      {indices.map((index) => (
        <div key={index} className={`flex flex-col gap-3 ${index > 0 ? "border-t border-gray-100 pt-4" : ""}`}>
          {index > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-400">Document {index + 1}</span>
              <button
                onClick={() => remove(index)}
                className="text-[10px] text-red-400 font-bold bg-red-50 px-2.5 py-1 rounded-full active:opacity-70"
              >
                Remove
              </button>
            </div>
          )}
          <UploadField
            label={index === 0 ? "Consultation Papers and Reports Suggesting Treatment" : `Document ${index + 1}`}
            docType="other"
            fileField={`consultationDoc_${index}`}
            onFileSet={() =>
              setConsultationUploaded((prev) => {
                const next = [...prev];
                next[index] = true;
                return next;
              })
            }
          />
        </div>
      ))}

      {/* Add More — always at the bottom so user never needs to scroll up */}
      <button
        onClick={addMore}
        className="mt-1 w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#1DA1FA] rounded-2xl py-3 text-[#1DA1FA] text-[12px] font-bold bg-blue-50 active:opacity-70 transition-all"
      >
        <span className="text-lg leading-none">+</span> Add Another Document
      </button>
    </div>
  );
}