"use client";

import { Input, Select, SelectItem } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { updateField, fetchPincodeDetails } from "../store/detailsSlice";
import toast from "react-hot-toast";
import { z } from "zod";

export const patientSchema = z.object({
  fullName: z.string().min(1),
});

export function validatePatient(data) {
  return patientSchema.safeParse(data).success;
}

// Utility to convert DD/MM/YYYY (OCR) to YYYY-MM-DD (Input Date)
const formatOcrDate = (dateStr) => {
  if (!dateStr || !dateStr.includes("/")) return dateStr;
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    // If it's already YYYY/MM/DD, reverse it carefully
    if (parts[0].length === 4) return parts.join("-");
    // If it's DD/MM/YYYY, convert to YYYY-MM-DD
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
};

export default function PatientDetails() {
  const dispatch = useDispatch();

  const patientData = useSelector((state) => state.details.patient);
  const docStatus = useSelector((state) => state.details.docStatus);
  const pincodeAreas = useSelector((state) => state.details.pincodeAreas);
  const isFetchingPincode = useSelector((state) => state.details.isFetchingPincode);
  const isReadOnly = docStatus === 1;

  const prevPincodeRef = useRef(null);

  const handleChange = (field, value) => {
    // If the field is dob, ensure we are storing it in a format the HTML input likes
    const finalValue = field === "dob" ? formatOcrDate(value) : value;
    dispatch(updateField({ section: "patient", field, value: finalValue }));
  };

  useEffect(() => {
    const currentPincode = patientData.pincode;
    if (
      currentPincode &&
      currentPincode.length === 6 &&
      currentPincode !== prevPincodeRef.current &&
      !isReadOnly
    ) {
      prevPincodeRef.current = currentPincode;
      const fetchAndFill = async () => {
        const result = await dispatch(fetchPincodeDetails(currentPincode));
        if (fetchPincodeDetails.fulfilled.match(result)) {
          const areas = result.payload;
          if (areas.length > 0) {
            dispatch(updateField({ section: "patient", field: "city", value: areas[0].city }));
            dispatch(updateField({ section: "patient", field: "state", value: areas[0].state }));
            if (areas.length === 1) {
              dispatch(updateField({ section: "patient", field: "area", value: areas[0].area }));
            }
          }
        } else {
          toast.error("Invalid pincode. Please check and try again.");
        }
      };
      fetchAndFill();
    } else {
      prevPincodeRef.current = currentPincode;
    }
  }, [patientData.pincode, isReadOnly, dispatch]);

  const handlePincodeBlur = async () => {
    const pincode = patientData.pincode?.trim();
    if (!pincode || pincode.length !== 6) return;
    const result = await dispatch(fetchPincodeDetails(pincode));
    if (fetchPincodeDetails.fulfilled.match(result)) {
      const areas = result.payload;
      if (areas.length > 0) {
        dispatch(updateField({ section: "patient", field: "city", value: areas[0].city }));
        dispatch(updateField({ section: "patient", field: "state", value: areas[0].state }));
        if (areas.length === 1) {
          dispatch(updateField({ section: "patient", field: "area", value: areas[0].area }));
        }
      }
    } else {
      toast.error("Invalid pincode. Please check and try again.");
    }
  };

  const handleAreaChange = (keys) => {
    const selectedArea = Array.from(keys)[0];
    const selected = pincodeAreas.find((a) => a.area === selectedArea);
    if (selected) {
      dispatch(updateField({ section: "patient", field: "area", value: selected.area }));
      dispatch(updateField({ section: "patient", field: "city", value: selected.city }));
      dispatch(updateField({ section: "patient", field: "state", value: selected.state }));
    }
  };

  const selectStyles = {
    label: "hidden",
    trigger: "heroui-select-custom",
    value: "heroui-select-value truncate max-w-[120px]",
    popoverContent: "bg-white border border-gray-100 shadow-lg rounded-[12px] p-1",
    innerWrapper: "flex items-center justify-between h-full overflow-hidden",
    selectorIcon: "text-gray-400 w-4 h-4 static flex-shrink-0",
  };

  const inputStyles = {
    label: "hidden",
    inputWrapper: "heroui-input-custom",
    input: "heroui-input-field",
    innerWrapper: "h-full flex items-center py-0",
  };

  const CustomLabel = ({ children, required }) => (
    <label className="text-[13px] font-bold text-gray-900 mb-1 block">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  return (
    <div className="flex flex-col gap-3 relative">

      {isFetchingPincode && (
        <div className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center gap-3 shadow-2xl">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#1DA1FA] rounded-full animate-spin" />
            <p className="text-sm font-semibold text-gray-600">Fetching pincode details...</p>
          </div>
        </div>
      )}

      <div className="mb-1">
        <h2 className="text-[20px] font-extrabold text-gray-900">Fill in Patient details</h2>
        <p className="text-[13px] text-gray-500 font-medium mt-0.5">Fill in all the appropriate details.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <CustomLabel required>Full Name</CustomLabel>
          <Input
            isDisabled={isReadOnly}
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            label=""
            classNames={inputStyles}
            value={patientData.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <CustomLabel>Date of birth</CustomLabel>
            <Input
              isDisabled={isReadOnly}
              type="date"
              label=""
              variant="bordered"
              classNames={{ ...inputStyles, input: [inputStyles.input, "appearance-none"] }}
              onClick={(e) => !isReadOnly && e.target.showPicker?.()}
              value={patientData.dob || ""}
              onChange={(e) => handleChange("dob", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <CustomLabel>Gender</CustomLabel>
            <Select
              isDisabled={isReadOnly}
              placeholder="XXXX"
              label=""
              variant="bordered"
              aria-label="Gender"
              disableAnimation
              classNames={selectStyles}
              selectedKeys={patientData.gender ? [patientData.gender] : []}
              onSelectionChange={(keys) => handleChange("gender", Array.from(keys)[0])}
            >
              <SelectItem key="Male" textValue="Male">Male</SelectItem>
              <SelectItem key="Female" textValue="Female">Female</SelectItem>
              <SelectItem key="Others" textValue="Others">Others</SelectItem>
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <CustomLabel>Pin Code</CustomLabel>
            <Input
              isDisabled={isReadOnly}
              placeholder="XXXXXX"
              label=""
              variant="bordered"
              classNames={inputStyles}
              value={patientData.pincode || ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                handleChange("pincode", val);
              }}
              onBlur={handlePincodeBlur}
            />
          </div>
          <div className="flex-1">
            <CustomLabel>Area</CustomLabel>
            {pincodeAreas.length > 0 ? (
              <Select
                isDisabled={isReadOnly}
                placeholder="Select area"
                variant="bordered"
                aria-label="Area"
                label=""
                classNames={selectStyles}
                selectedKeys={patientData.area ? [patientData.area] : []}
                onSelectionChange={handleAreaChange}
              >
                {pincodeAreas.map((a) => (
                  <SelectItem key={a.area} textValue={a.area}>
                    {a.area}
                  </SelectItem>
                ))}
              </Select>
            ) : (
              <Input
                isDisabled={isReadOnly}
                placeholder="Enter pincode first"
                variant="bordered"
                label=""
                classNames={inputStyles}
                value={patientData.area || ""}
                onChange={(e) => handleChange("area", e.target.value)}
              />
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <CustomLabel>City</CustomLabel>
            <Input
              isDisabled
              placeholder="Auto filled"
              variant="bordered"
              label=""
              classNames={{ ...inputStyles, inputWrapper: `${inputStyles.inputWrapper} opacity-70` }}
              value={patientData.city || ""}
            />
          </div>
          <div className="flex-1">
            <CustomLabel>State</CustomLabel>
            <Input
              isDisabled
              placeholder="Auto filled"
              variant="bordered"
              label=""
              classNames={{ ...inputStyles, inputWrapper: `${inputStyles.inputWrapper} opacity-70` }}
              value={patientData.state || ""}
            />
          </div>
        </div>

        <div>
          <CustomLabel>Address line 1</CustomLabel>
          <Input
            isDisabled={isReadOnly}
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            label=""
            classNames={inputStyles}
            value={patientData.address1 || ""}
            onChange={(e) => handleChange("address1", e.target.value)}
          />
        </div>

        <div>
          <CustomLabel>Address line 2</CustomLabel>
          <Input
            isDisabled={isReadOnly}
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            label=""
            classNames={inputStyles}
            value={patientData.address2 || ""}
            onChange={(e) => handleChange("address2", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}