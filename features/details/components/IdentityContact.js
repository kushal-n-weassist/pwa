import { Input } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../store/detailsSlice";

export default function IdentityContact() {
  const dispatch = useDispatch();
  const identityData = useSelector((state) => state.details.identity);

  const handleChange = (field, value) => {
    dispatch(updateField({ section: "identity", field, value }));
  };

  const inputStyles = {
    label: "hidden", 
    inputWrapper: [
      "h-[42px]", 
      "min-h-[42px]",
      "rounded-[10px]", 
      "border-gray-200", 
      "bg-white",
      "shadow-none",
      "transition-none",
      "group-data-[focus=true]:border-gray-300", 
      "after:hidden",
      "before:hidden"
    ],
    input: "placeholder:text-gray-300 text-gray-700 text-[14px] outline-none",
  };

  const CustomLabel = ({ children }) => (
    <label className="text-[13px] font-bold text-gray-900 mb-1 block">
      {children}
    </label>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1">
        <h2 className="text-[20px] font-extrabold text-gray-900">
          Fill in Insured details
        </h2>
        <p className="text-[13px] text-gray-500 font-medium mt-0.5">
          Fill in all the appropriate details.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <CustomLabel>PAN Number</CustomLabel>
          <Input
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={identityData.panNumber || ""}
            onChange={(e) => handleChange("panNumber", e.target.value)}
          />
        </div>

        <div>
          <CustomLabel>Aadhar Number</CustomLabel>
          <Input
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={identityData.aadharNumber || ""}
            onChange={(e) => handleChange("aadharNumber", e.target.value)}
          />
        </div>

        <div>
          <CustomLabel>Email</CustomLabel>
          <Input
            type="email"
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={identityData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div>
          <CustomLabel>Mobile Number</CustomLabel>
          <Input
            type="tel"
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={identityData.mobileNumber || ""}
            onChange={(e) => handleChange("mobileNumber", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}