import { Input, Select, SelectItem } from "@heroui/react";
import { CalendarIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../store/detailsSlice"; 
import { useEffect } from "react";

export default function PatientDetails() {
  const dispatch = useDispatch();
  
  const patientData = useSelector((state) => state.details.patient);




  const handleChange = (field, value) => {
    dispatch(updateField({ section: "patient", field, value }));
  };

  const selectStyles = {
    label: "hidden",
    trigger: [
      "h-[42px]", "min-h-[42px]", "rounded-[10px]", "border-gray-200", "bg-white",
      "shadow-none", "transition-none", "flex items-center justify-between",
      "group-data-[focus=true]:border-gray-300", "after:hidden", "before:hidden"
    ],
    popoverContent: ["bg-white", "border border-gray-100", "shadow-lg", "rounded-[12px]", "p-1"],
    value: "text-[14px] text-gray-700 font-medium pt-0",
    innerWrapper: "flex items-center justify-between h-full",
    selectorIcon: "text-gray-400 w-4 h-4 static",
  };

  const inputStyles = {
    label: "hidden",
    inputWrapper: [
      "h-[42px]", "min-h-[42px]", "rounded-[10px]", "border-gray-100", "bg-white",
      "shadow-none", "transition-none", "group-data-[focus=true]:border-gray-100",
      "after:hidden", "before:hidden"
    ],
    input: "placeholder:text-gray-300 text-gray-700 text-[14px] outline-none",
  };

  const CustomLabel = ({ children }) => (
    <label className="text-[13px] font-bold text-gray-900 mb-1 block">{children}</label>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1">
        <h2 className="text-[20px] font-extrabold text-gray-900">Fill in Patient details</h2>
        <p className="text-[13px] text-gray-500 font-medium mt-0.5">Fill in all the appropriate details.</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Full Name */}
        <div>
          <CustomLabel>Full Name</CustomLabel>
          <Input
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={patientData.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </div>

        {/* DOB + Gender */}
        <div className="flex gap-3">
          <div className="flex-1">
            <CustomLabel>Date of birth</CustomLabel>
            <Input
              type="date"
              variant="bordered"
              classNames={{ ...inputStyles, input: [inputStyles.input, "appearance-none"] }}
              onClick={(e) => e.target.showPicker?.()}
              value={patientData.dob || ""}
              onChange={(e) => handleChange("dob", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <CustomLabel>Gender</CustomLabel>
            <Select
              placeholder="XXXX"
              variant="bordered"
              disableAnimation
              classNames={selectStyles}
              selectedKeys={patientData.gender ? [patientData.gender] : []}
              onSelectionChange={(keys) => handleChange("gender", Array.from(keys)[0])}
            >
              <SelectItem key="male" textValue="Male">Male</SelectItem>
              <SelectItem key="female" textValue="Female">Female</SelectItem>
            </Select>
          </div>
        </div>

        {/* Pin Code + Area */}
        <div className="flex gap-3">
          <div className="flex-1">
            <CustomLabel>Pin Code</CustomLabel>
            <Input
              placeholder="XXXX"
              variant="bordered"
              classNames={inputStyles}
              value={patientData.pincode || ""}
              onChange={(e) => handleChange("pincode", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <CustomLabel>Area</CustomLabel>
            <Select
              placeholder="XXXX"
              variant="bordered"
              classNames={selectStyles}
              selectedKeys={patientData.area ? [patientData.area] : []}
              onSelectionChange={(keys) => handleChange("area", Array.from(keys)[0])}
            >
              <SelectItem key="area1" textValue="Area 1">Area 1</SelectItem>
            </Select>
          </div>
        </div>

        {/* City + State */}
        <div className="flex gap-3">
          <div className="flex-1">
            <CustomLabel>City</CustomLabel>
            <Input
              placeholder="XXXX"
              variant="bordered"
              classNames={inputStyles}
              value={patientData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <CustomLabel>State</CustomLabel>
            <Input
              placeholder="XXXX"
              variant="bordered"
              classNames={inputStyles}
              value={patientData.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
            />
          </div>
        </div>

        {/* Address Lines */}
        <div>
          <CustomLabel>Address line 1</CustomLabel>
          <Input
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={patientData.address1 || ""}
            onChange={(e) => handleChange("address1", e.target.value)}
          />
        </div>

        <div>
          <CustomLabel>Address line 2</CustomLabel>
          <Input
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={patientData.address2 || ""}
            onChange={(e) => handleChange("address2", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}