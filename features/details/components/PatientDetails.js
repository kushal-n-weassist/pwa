"use client";

import { Input, Select, SelectItem } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../store/detailsSlice";

export default function PatientDetails() {
  const dispatch = useDispatch();

  const patientData = useSelector((state) => state.details.patient);
  const docStatus = useSelector((state) => state.details.docStatus);
  const isReadOnly = docStatus === 1;

  const handleChange = (field, value) => {
    dispatch(updateField({ section: "patient", field, value }));
  };

  const selectStyles = {
    label: "hidden",
    trigger: "heroui-select-custom",
    value: "heroui-select-value",
    popoverContent: "bg-white border border-gray-100 shadow-lg rounded-[12px] p-1",
    innerWrapper: "flex items-center justify-between h-full",
    selectorIcon: "text-gray-400 w-4 h-4 static",
  };

  const inputStyles = {
    label: "hidden",
    inputWrapper: "heroui-input-custom",
    input: "heroui-input-field",
    innerWrapper: "h-full flex items-center py-0"
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
        <div>
          <CustomLabel>Full Name</CustomLabel>
          <Input
            isDisabled={isReadOnly}
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            label=''
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
              label=''
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
              label=''
              variant="bordered"
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
              placeholder="XXXX"
              label=''
              variant="bordered"
              classNames={inputStyles}
              value={patientData.pincode || ""}
              onChange={(e) => handleChange("pincode", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <CustomLabel>Area</CustomLabel>
            <Select
              isDisabled={isReadOnly}
              placeholder="XXXX"
              variant="bordered"
              label=''
              classNames={selectStyles}
              selectedKeys={patientData.area ? [patientData.area] : []}
              onSelectionChange={(keys) => handleChange("area", Array.from(keys)[0])}
            >
              <SelectItem key="area1" textValue="Area 1">Area 1</SelectItem>
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <CustomLabel>City</CustomLabel>
            <Input
              isDisabled={isReadOnly}
              placeholder="XXXX"
              variant="bordered"
              label=''
              classNames={inputStyles}
              value={patientData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <CustomLabel>State</CustomLabel>
            <Input
              isDisabled={isReadOnly}
              placeholder="XXXX"
              variant="bordered"
              label=''
              classNames={inputStyles}
              value={patientData.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
            />
          </div>
        </div>

        <div>
          <CustomLabel>Address line 1</CustomLabel>
          <Input
            isDisabled={isReadOnly}
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            label=''
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
            label=''
            classNames={inputStyles}
            value={patientData.address2 || ""}
            onChange={(e) => handleChange("address2", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}