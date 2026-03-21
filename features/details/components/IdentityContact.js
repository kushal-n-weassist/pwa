"use client";
import { Input } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../store/detailsSlice";
import toast from "react-hot-toast";

export default function IdentityContact() {
  const dispatch = useDispatch();
  const identityData = useSelector((state) => state.details.identity);
  const docStatus = useSelector((state) => state.details.docStatus);
  const isReadOnly = docStatus === 1;

  const handleChange = (field, value) => {
    if (
      (field === "emergencyNumber1" || field === "emergencyNumber2") && 
      value === identityData.mobileNumber && 
      value !== ""
    ) {
      toast.error("Emergency contact cannot be your primary number", { id: 'phone-val' });
      return;
    }
    dispatch(updateField({ section: "identity", field, value }));
  };

  const inputStyles = {
    label: "hidden",
    inputWrapper: "heroui-input-custom",
    input: "heroui-input-field",
    innerWrapper: "h-full flex items-center py-0"
  };

  const CustomLabel = ({ children }) => (
    <label className="text-[13px] font-bold text-gray-900 mb-1 block">
      {children}
    </label>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1">
        <h2 className="text-[20px] font-extrabold text-gray-900">Identity & Contact</h2>
        <p className="text-[13px] text-gray-500 font-medium mt-0.5">Primary contact and identity details.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <CustomLabel>PAN Number</CustomLabel>
            <Input isDisabled={isReadOnly} placeholder="XXXXXXXXXX" variant="bordered" classNames={inputStyles} value={identityData.panNumber || ""} onChange={(e) => handleChange("panNumber", e.target.value)} />
          </div>
          <div>
            <CustomLabel>Aadhar Number</CustomLabel>
            <Input isDisabled={isReadOnly} placeholder="XXXX XXXX XXXX" variant="bordered" classNames={inputStyles} value={identityData.aadharNumber || ""} onChange={(e) => handleChange("aadharNumber", e.target.value)} />
          </div>
        </div>

        <div>
          <CustomLabel>Email</CustomLabel>
          <Input isDisabled={isReadOnly} type="email" placeholder="example@mail.com" variant="bordered" classNames={inputStyles} value={identityData.email || ""} onChange={(e) => handleChange("email", e.target.value)} />
        </div>

        <div>
          <CustomLabel>Mobile Number</CustomLabel>
          <Input isDisabled={isReadOnly} type="tel" placeholder="XXXXXXXXXX" variant="bordered" classNames={inputStyles} value={identityData.mobileNumber || ""} onChange={(e) => handleChange("mobileNumber", e.target.value)} />
        </div>

 
 
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-[16px] font-bold text-gray-900 mb-3">Emergency Contact 1</h3>
          <div className="flex flex-col gap-4">
            <div>
              <CustomLabel>Contact Name</CustomLabel>
              <Input isDisabled={isReadOnly} placeholder="Full Name" variant="bordered" classNames={inputStyles} value={identityData.emergencyName1 || ""} onChange={(e) => handleChange("emergencyName1", e.target.value)} />
            </div>
            <div>
              <CustomLabel>Contact Number</CustomLabel>
              <Input isDisabled={isReadOnly} type="tel" placeholder="XXXXXXXXXX" variant="bordered" classNames={inputStyles} value={identityData.emergencyNumber1 || ""} onChange={(e) => handleChange("emergencyNumber1", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-[16px] font-bold text-gray-900 mb-3">Emergency Contact 2</h3>
          <div className="flex flex-col gap-4">
            <div>
              <CustomLabel>Contact Name</CustomLabel>
              <Input isDisabled={isReadOnly} placeholder="Full Name" variant="bordered" classNames={inputStyles} value={identityData.emergencyName2  || ""} onChange={(e) => handleChange("emergencyName2", e.target.value)} />
            </div>
            <div>
              <CustomLabel>Contact Number</CustomLabel>
              <Input isDisabled={isReadOnly} type="tel" placeholder="XXXXXXXXXX" variant="bordered" classNames={inputStyles} value={identityData.emergencyNumber2 || ""} onChange={(e) => handleChange("emergencyNumber2", e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}