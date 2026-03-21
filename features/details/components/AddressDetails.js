"use client";
import { Input } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../store/detailsSlice";

export default function AddressDetails() {
  const dispatch = useDispatch();
  
  const isSameAsPatient = useSelector((state) => state.details.insured.isSameAsPatient);
  const patientData = useSelector((state) => state.details.patient);
  const addressData = useSelector((state) => state.details.address);
  const docStatus = useSelector((state) => state.details.docStatus);
  
  const isReadOnly = docStatus === 1;


  const displayData = isSameAsPatient ? patientData : addressData;

  const handleChange = (field, value) => {
    if (!isSameAsPatient) {
      dispatch(updateField({ section: "address", field, value }));
    }
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
        <h2 className="text-[20px] font-extrabold text-gray-900">Address Details</h2>
        <p className="text-[13px] text-gray-500 font-medium mt-0.5">
          {isSameAsPatient ? "Synced with Patient address." : "Fill in the insured's address."}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <CustomLabel>Pin Code</CustomLabel>
            <Input
              isDisabled={isReadOnly || isSameAsPatient}
              value={displayData.pincode || ""}
              onChange={(e) => handleChange("pincode", e.target.value)}
              placeholder="XXXX" variant="bordered" classNames={inputStyles}
            />
          </div>
          <div className="flex-1">
            <CustomLabel>City</CustomLabel>
            <Input
              isDisabled={isReadOnly || isSameAsPatient}
              value={displayData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="XXXX" variant="bordered" classNames={inputStyles}
            />
          </div>
        </div>

        <div>
          <CustomLabel>State</CustomLabel>
          <Input
            isDisabled={isReadOnly || isSameAsPatient}
            value={displayData.state || ""}
            onChange={(e) => handleChange("state", e.target.value)}
            placeholder="XXXX" variant="bordered" classNames={inputStyles}
          />
        </div>

        <div>
          <CustomLabel>Address line 1</CustomLabel>
          <Input
            isDisabled={isReadOnly || isSameAsPatient}
            value={displayData.address1 || ""}
            onChange={(e) => handleChange("address1", e.target.value)}
            placeholder="XXXXXXXXXXXXXX" variant="bordered" classNames={inputStyles}
          />
        </div>

        <div>
          <CustomLabel>Address line 2</CustomLabel>
          <Input
            isDisabled={isReadOnly || isSameAsPatient}
            value={displayData.address2 || ""}
            onChange={(e) => handleChange("address2", e.target.value)}
            placeholder="XXXXXXXXXXXXXX" variant="bordered" classNames={inputStyles}
          />
        </div>
      </div>
    </div>
  );
}