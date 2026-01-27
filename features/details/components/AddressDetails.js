import { Input } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../store/detailsSlice";
import { useEffect } from "react";

export default function AddressDetails() {
  const dispatch = useDispatch();
  const addressData = useSelector((state) => state.details.address);


  const handleChange = (field, value) => {
    dispatch(updateField({ section: "address", field, value }));
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
        <div className="flex gap-3">
          <div className="flex-1">
            <CustomLabel>Pin Code</CustomLabel>
            <Input
              placeholder="XXXX"
              variant="bordered"
              classNames={inputStyles}
              value={addressData.pincode || ""}
              onChange={(e) => handleChange("pincode", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <CustomLabel>City</CustomLabel>
            <Input
              placeholder="XXXX"
              variant="bordered"
              classNames={inputStyles}
              value={addressData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>
        </div>

        <div>
          <CustomLabel>State</CustomLabel>
          <Input
            placeholder="XXXX"
            variant="bordered"
            classNames={inputStyles}
            value={addressData.state || ""}
            onChange={(e) => handleChange("state", e.target.value)}
          />
        </div>

        <div>
          <CustomLabel>Address line 1</CustomLabel>
          <Input
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={addressData.address1 || ""}
            onChange={(e) => handleChange("address1", e.target.value)}
          />
        </div>

        <div>
          <CustomLabel>Address line 2</CustomLabel>
          <Input
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={addressData.address2 || ""}
            onChange={(e) => handleChange("address2", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}