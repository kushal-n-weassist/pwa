"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const [icrConsent, setIcrConsent] = useState(false);

  const markUploaded = (field) =>
    setUploaded((prev) => ({ ...prev, [field]: true }));

  const unmarkUploaded = (field) =>
    setUploaded((prev) => ({ ...prev, [field]: false }));

  const canContinue = isSameAsInsured
    ? uploaded.patientFront && uploaded.patientBack && uploaded.proposerPAN && uploaded.patientInsurance && hasConsultation
    : uploaded.patientFront && uploaded.patientBack && uploaded.proposerFront && uploaded.proposerBack && uploaded.proposerPAN && uploaded.patientInsurance && uploaded.proposerPolicy && hasConsultation;

  const handleContinue = () => router.push("/details");

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col relative">
      <div className="px-6 pt-12 pb-2 flex flex-col gap-1">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-1">
            <ChevronLeft size={24} className="text-gray-800" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 flex-1 text-center mr-8">
            Upload Documents
          </h1>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col gap-4">

        
        <div
          onClick={() => setIcrConsent((v) => !v)}
          className={`bg-white rounded-[20px] shadow-sm px-5 py-4 flex items-start gap-3 cursor-pointer transition-all ${
            icrConsent ? "ring-2 ring-[#1DA1FA]" : ""
          }`}
        >
          <Checkbox
            isSelected={icrConsent}
            onValueChange={setIcrConsent}
            size="sm"
            classNames={{ wrapper: "after:bg-[#1DA1FA] mt-0.5" }}
          />
          <div>
            <p className="text-[14px] font-semibold text-gray-800">Enable Auto-fill from Documents</p>
            <p className="text-[12px] text-gray-400 mt-0.5 leading-relaxed">
              Allow us to scan your documents and automatically fill in your details  no manual typing needed.
            </p>
          </div>
        </div>

        
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
            icrConsent={icrConsent}
            onFrontSet={() => markUploaded("patientFront")}
            onFrontRemove={() => unmarkUploaded("patientFront")}
            onBackSet={() => markUploaded("patientBack")}
            onBackRemove={() => unmarkUploaded("patientBack")}
          />
          <div className="border-t border-gray-100 pt-4">
            <UploadField
              label="Insurance Policy"
              docType="other"
              fileField="patientInsurance"
              icrConsent={icrConsent}
              onFileSet={() => markUploaded("patientInsurance")}
              onFileRemove={() => unmarkUploaded("patientInsurance")}
            />
          </div>
        </div>

        
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
              icrConsent={icrConsent}
              onFrontSet={() => markUploaded("proposerFront")}
              onFrontRemove={() => unmarkUploaded("proposerFront")}
              onBackSet={() => markUploaded("proposerBack")}
              onBackRemove={() => unmarkUploaded("proposerBack")}
            />
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
              <UploadField
                label="PAN Card"
                docType="pan"
                fileField="proposerPAN"
                icrConsent={icrConsent}
                onFileSet={() => markUploaded("proposerPAN")}
                onFileRemove={() => unmarkUploaded("proposerPAN")}
              />
              <UploadField
                label="Insurance Policy"
                docType="other"
                fileField="proposerPolicy"
                icrConsent={icrConsent}
                onFileSet={() => markUploaded("proposerPolicy")}
                onFileRemove={() => unmarkUploaded("proposerPolicy")}
              />
            </div>
          </div>
        )}

        
        {isSameAsInsured && (
          <div className="bg-white rounded-[24px] shadow-sm p-5">
            <UploadField
              label="PAN Card"
              docType="pan"
              fileField="proposerPAN"
              icrConsent={icrConsent}
              onFileSet={() => markUploaded("proposerPAN")}
            />
          </div>
        )}

        
        <ConsultationSection
          consultationUploaded={consultationUploaded}
          setConsultationUploaded={setConsultationUploaded}
          icrConsent={icrConsent}
        />

        
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


function AadhaarUploadField({ label, frontField, backField, isInsured = true, icrConsent, onFrontSet, onFrontRemove, onBackSet, onBackRemove }) {
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrIdCardApi] = useOcrIdCardApiMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (icrConsent && frontFile && backFile && !loading) {
      runCombinedOCR();
    }
  }, [icrConsent, frontFile, backFile]);

  const runCombinedOCR = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("front_part", frontFile);
      formData.append("back_part", backFile);
      formData.append("id_type", "AADHAAR");
      formData.append("unique_request_id", `req_${Date.now()}`);

      const response = await ocrIdCardApi(formData).unwrap();
      if (response) {
        const d = response;
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
        if (d.address_information) {
          const addrSection = isInsured ? "address" : "patient";
          const ai = d.address_information;
          if (ai.pincode) dispatch(updateField({ section: addrSection, field: "pincode", value: ai.pincode }));
          if (ai.state) dispatch(updateField({ section: addrSection, field: "state", value: ai.state }));
          if (ai.district_or_city) dispatch(updateField({ section: addrSection, field: "city", value: ai.district_or_city }));
          if (d.address) dispatch(updateField({ section: addrSection, field: "address1", value: d.address }));
        }
        toast.success("Aadhaar details auto-filled!");
      }
    } catch (err) {
      toast.error(
        `Aadhaar Auto-read failed. Please ensure the image is clear and in PNG or JPG format. Details saved manually.`,
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700">
        {label} <span className="text-[11px] text-gray-400 font-normal ml-1">(PDF, JPG, PNG allowed)</span>
      </label>
      <div className="flex gap-3">
        <AadhaarSideSlot
          side="Front"
          reduxField={frontField}
          loading={loading}
          onFileSet={(file) => { setFrontFile(file); onFrontSet(); }}
          onFileRemove={() => { setFrontFile(null); onFrontRemove(); }}
        />
        <AadhaarSideSlot
          side="Back"
          reduxField={backField}
          loading={loading}
          onFileSet={(file) => { setBackFile(file); onBackSet(); }}
          onFileRemove={() => { setBackFile(null); onBackRemove(); }}
        />
      </div>
    </div>
  );
}


function AadhaarSideSlot({ side, reduxField, onFileSet, onFileRemove, loading }) {
  const dispatch = useDispatch();
  const [fileName, setFileName] = useState(null);
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const hasFile = !!fileName;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setFile(reduxField, file);
    dispatch(setUploadFile({ field: reduxField, file }));
    onFileSet?.(file);
    e.target.value = "";
  };

  return (
    <div className="flex-1 flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${hasFile ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
          {side}
        </span>
        {hasFile && <CheckCircle2 size={13} className="text-green-500" />}
      </div>

      <input ref={cameraInputRef} type="file" accept="image/png, image/jpeg, image/jpg" capture="environment" hidden onChange={handleFileChange} />
      <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/jpg" hidden onChange={handleFileChange} />

      {hasFile ? (
        <div className="border-2 border-dashed border-green-400 bg-green-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 min-h-[100px] relative">
          <CheckCircle2 size={22} className="text-green-500" />
          <span className="font-bold text-[11px] truncate max-w-[100px] text-center text-green-600">
            {loading ? "Reading..." : fileName}
          </span>
          {!loading && (
            <button
              onClick={() => { setFileName(null); onFileRemove?.(); }}
              className="absolute top-1.5 right-1.5 text-[9px] font-bold text-red-400 bg-red-50 px-1.5 py-0.5 rounded-full active:opacity-70"
            >
              Remove
            </button>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 min-h-[100px] flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-4">
            <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center gap-1 active:opacity-70">
              <Camera size={20} className="text-[#1DA1FA]" />
              <span className="text-[10px] font-bold text-[#1DA1FA]">Camera</span>
            </button>
            <div className="w-px h-8 bg-gray-200" />
            <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1 active:opacity-70">
              <File size={20} className="text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400">Gallery</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function UploadField({ label, docType, fileField, icrConsent, onFileSet, onFileRemove }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [ocrIdCardApi] = useOcrIdCardApiMutation();
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const hasFile = !!fileName;

  const runOCR = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("front_part", file);
      formData.append("id_type", docType.toUpperCase());
      formData.append("unique_request_id", `req_${Date.now()}`);
      const response = await ocrIdCardApi(formData).unwrap();
      if (response && docType === "pan") {
        const pan = response.id_no || response.pan_number;
        toast.success("PAN number extracted!");
      }
    } catch (err) {
      toast.error(
        `${docType.toUpperCase()} Auto-read failed. Ensure the image is clear and in PNG or JPG format.`,
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setFile(fileField, file);
    dispatch(setUploadFile({ field: fileField, file }));
    onFileSet?.();
    if (icrConsent && docType !== "other") runOCR(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700">
        {label} <span className="text-[11px] text-gray-400 font-normal ml-1">(PDF, JPG, PNG allowed)</span>
      </label>
      <input ref={cameraInputRef} type="file" accept="image/png, image/jpeg, image/jpg" capture="environment" hidden onChange={handleFileChange} />
      <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/jpg, application/pdf" hidden onChange={handleFileChange} />
      {hasFile || loading ? (
        <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-2 ${hasFile ? "border-green-400 bg-green-50" : "border-blue-200 bg-blue-50"}`}>
          {hasFile && <CheckCircle2 size={24} className="text-green-500" />}
          <span className="font-bold text-sm text-green-600">{loading ? "Reading document..." : fileName}</span>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 py-8 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-6">
            <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center gap-1.5 active:opacity-70">
              <Camera size={24} className="text-[#1DA1FA]" />
              <span className="text-xs font-bold text-[#1DA1FA]">Camera</span>
            </button>
            <div className="w-px h-10 bg-gray-200" />
            <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1.5 active:opacity-70">
              <File size={24} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-400">Gallery</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function ConsultationSection({ consultationUploaded, setConsultationUploaded, icrConsent }) {
  const addMore = () => setConsultationUploaded((prev) => [...prev, false]);
  const indices = Array.from({ length: consultationUploaded.length }, (_, i) => i);

  return (
    <div className="bg-white rounded-[24px] shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-[13px] font-bold text-gray-700 uppercase tracking-wider">Consultation Papers</span>
      </div>
      {indices.map((index) => (
        <UploadField
          key={index}
          label={index === 0 ? "Consultation Papers and Reports Suggesting Hospitalization" : `Document ${index + 1}`}
          docType="other"
          fileField={`consultationDoc_${index}`}
          icrConsent={icrConsent}
          onFileSet={() => setConsultationUploaded((prev) => {
            const next = [...prev];
            next[index] = true;
            return next;
          })}
        />
      ))}
      <button onClick={addMore} className="mt-1 w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#1DA1FA] rounded-2xl py-3 text-[#1DA1FA] text-[12px] font-bold bg-blue-50 active:opacity-70 transition-all">
        <span className="text-lg leading-none">+</span> Add Another Document
      </button>
    </div>
  );
}