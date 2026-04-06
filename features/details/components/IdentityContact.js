"use client";
import { Input } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../store/detailsSlice";
import toast from "react-hot-toast";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function IdentityContact() {
  const dispatch = useDispatch();
  const identityData = useSelector((state) => state.details.identity);
  const docStatus = useSelector((state) => state.details.docStatus);
  const isReadOnly = docStatus === 1;
  const [showAadhar, setShowAadhar] = useState(false);
  const [isAadharFocused, setIsAadharFocused] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleFocus = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: false }));
  };

  const handleChange = (field, value) => {
    if (["mobileNumber", "emergencyNumber1", "emergencyNumber2"].includes(field)) {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      
      if (digitsOnly.length === 10) {
        // Checking if Mobile matches Emergency
        if (field === "mobileNumber") {
          if (digitsOnly === identityData.emergencyNumber1) {
            toast.error("Mobile Number cannot be same as Contact 1", { id: "phone-val" });
          } else if (digitsOnly === identityData.emergencyNumber2) {
            toast.error("Mobile Number cannot be same as Contact 2", { id: "phone-val" });
          }
        }
        // Checking if Emergency 1 matches Mobile
        if (field === "emergencyNumber1" && digitsOnly === identityData.mobileNumber) {
          toast.error("Cannot be same as Mobile Number", { id: "phone-val" });
        }
        // Checking if Emergency 2 matches Mobile or Emergency 1
        if (field === "emergencyNumber2") {
          if (digitsOnly === identityData.mobileNumber) {
            toast.error("Cannot be same as Mobile Number", { id: "phone-val" });
          } else if (digitsOnly === identityData.emergencyNumber1) {
            toast.error("Cannot be same as Contact 1", { id: "phone-val" });
          }
        }
      }
      
      dispatch(updateField({ section: "identity", field, value: digitsOnly }));
      return;
    }
    dispatch(updateField({ section: "identity", field, value }));
  };

  const getPartialAadhar = (value) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 6) return digits;
    const first3 = digits.slice(0, 3);
    const last3 = digits.slice(-3);
    const middleLen = digits.length - 6;
    const middle = "X".repeat(middleLen);
    const full = first3 + middle + last3;
    return full.match(/.{1,4}/g)?.join(" ") || full;
  };

  const getFormattedAadhar = (value) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");
    return digits.match(/.{1,4}/g)?.join(" ") || digits;
  };

  const inputStyles = {
    label: "hidden",
    inputWrapper: "heroui-input-custom",
    input: "heroui-input-field",
    innerWrapper: "h-full flex items-center py-0"
  };

  const getInputStyles = (isError) => ({
    label: "hidden",
    inputWrapper: `heroui-input-custom ${isError ? "!border-red-400" : ""}`,
    input: "heroui-input-field",
    innerWrapper: "h-full flex items-center py-0"
  });

  // Show error after blur: if empty OR invalid format
  const isEmailInvalid = touchedFields.email &&
    (!identityData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identityData.email));
  const emailErrorMsg = !identityData.email
    ? "Email is required"
    : "Please enter a valid email";

  const m = identityData.mobileNumber || "";
  const e1 = identityData.emergencyNumber1 || "";
  const e2 = identityData.emergencyNumber2 || "";

  // Show error after blur: if empty or less than 10
  const isMInvalid = touchedFields.mobileNumber && (!m || m.length < 10);
  const mErrorMsg = !m ? "Mobile number is required" : "Must be exactly 10 digits";
  const isE1Invalid = e1.length > 0 && (e1.length < 10 || e1 === m);
  const isE2Invalid = e2.length > 0 && (e2.length < 10 || e2 === m || e2 === e1);

  const CustomLabel = ({ children, required }) => (
    <label className="text-[13px] font-bold text-gray-900 mb-1 block">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  const aadharValue = identityData.aadharNumber || "";

  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1">
        <h2 className="text-[20px] font-extrabold text-gray-900">Identity & Contact</h2>
        <p className="text-[13px] text-gray-500 font-medium mt-0.5">Primary contact and identity details.</p>
      </div>

      <div className="flex flex-col gap-4">

        <div>
          <CustomLabel>PAN Number</CustomLabel>
          <Input
            isDisabled={isReadOnly}
            placeholder="XXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={identityData.panNumber || ""}
            onChange={(e) => handleChange("panNumber", e.target.value)}
          />
        </div>

        <div>
          <CustomLabel>Aadhar Number</CustomLabel>
          <Input
            readOnly={isReadOnly}
            type="text"
            placeholder="XXXX XXXX XXXX"
            variant="bordered"
            classNames={{
              ...inputStyles,
              input: `${inputStyles.input} tracking-widest font-mono`,
            }}
            value={
              showAadhar || isAadharFocused
                ? getFormattedAadhar(aadharValue)
                : getPartialAadhar(aadharValue)
            }
            onFocus={() => !isReadOnly && setIsAadharFocused(true)}
            onBlur={() => !isReadOnly && setIsAadharFocused(false)}
            onChange={(e) => {
              if (isReadOnly) return;
              const raw = e.target.value.replace(/X/gi, "").replace(/\D/g, "").slice(0, 12);
              handleChange("aadharNumber", raw);
            }}
            endContent={
              <button
                type="button"
                onClick={() => setShowAadhar((prev) => !prev)}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                {showAadhar ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
        </div>

        <div>
          <CustomLabel required>Email</CustomLabel>
          <Input
            isDisabled={isReadOnly}
            type="email"
            placeholder="example@mail.com"
            variant="bordered"
            classNames={getInputStyles(isEmailInvalid)}
            value={identityData.email || ""}
            onFocus={() => handleFocus("email")}
            onBlur={() => handleBlur("email")}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {isEmailInvalid && (
            <p className="text-red-500 text-[11px] mt-1 font-medium">{emailErrorMsg}</p>
          )}
        </div>

        <div>
          <CustomLabel required>Mobile Number</CustomLabel>
          <Input
            isDisabled={isReadOnly}
            type="tel"
            placeholder="XXXXXXXXXX"
            variant="bordered"
            classNames={getInputStyles(isMInvalid)}
            value={identityData.mobileNumber || ""}
            onFocus={() => handleFocus("mobileNumber")}
            onBlur={() => handleBlur("mobileNumber")}
            onChange={(e) => handleChange("mobileNumber", e.target.value)}
          />
          {isMInvalid && (
            <p className="text-red-500 text-[11px] mt-1 font-medium">{mErrorMsg}</p>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-[16px] font-bold text-gray-900 mb-3">Emergency Contact 1</h3>
          <div className="flex flex-col gap-4">
            <div>
              <CustomLabel>Contact Name</CustomLabel>
              <Input
                isDisabled={isReadOnly}
                placeholder="Full Name"
                variant="bordered"
                classNames={inputStyles}
                value={identityData.emergencyName1 || ""}
                onChange={(e) => handleChange("emergencyName1", e.target.value)}
              />
            </div>
            <div>
              <CustomLabel>Contact Number</CustomLabel>
              <Input
                isDisabled={isReadOnly}
                type="tel"
            placeholder="XXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={identityData.emergencyNumber1 || ""}
                onChange={(e) => handleChange("emergencyNumber1", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-[16px] font-bold text-gray-900 mb-3">Emergency Contact 2</h3>
          <div className="flex flex-col gap-4">
            <div>
              <CustomLabel>Contact Name</CustomLabel>
              <Input
                isDisabled={isReadOnly}
                placeholder="Full Name"
                variant="bordered"
                classNames={inputStyles}
                value={identityData.emergencyName2 || ""}
                onChange={(e) => handleChange("emergencyName2", e.target.value)}
              />
            </div>
            <div>
              <CustomLabel>Contact Number</CustomLabel>
              <Input
                isDisabled={isReadOnly}
                type="tel"
            placeholder="XXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={identityData.emergencyNumber2 || ""}
                onChange={(e) => handleChange("emergencyNumber2", e.target.value)}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}