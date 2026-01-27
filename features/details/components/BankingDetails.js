import { Input } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../store/detailsSlice";

export default function BankingDetails() {
  const dispatch = useDispatch();
  const bankingData = useSelector((state) => state.details.banking);

  const handleChange = (field, value) => {
    dispatch(updateField({ section: "banking", field, value }));
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
          Fill in all the banking details.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <CustomLabel>IFSC Code</CustomLabel>
          <Input
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={bankingData.ifscCode || ""}
            onChange={(e) => handleChange("ifscCode", e.target.value)}
          />
        </div>

        <div>
          <CustomLabel>Bank Name</CustomLabel>
          <Input
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={bankingData.bankName || ""}
            onChange={(e) => handleChange("bankName", e.target.value)}
          />
        </div>

        <div>
          <CustomLabel>Branch Name</CustomLabel>
          <Input
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={bankingData.branchName || ""}
            onChange={(e) => handleChange("branchName", e.target.value)}
          />
        </div>

        <div>
          <CustomLabel>Account Number</CustomLabel>
          <Input
            type="number"
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={bankingData.accountNumber || ""}
            onChange={(e) => handleChange("accountNumber", e.target.value)}
          />
        </div>

        <div>
          <CustomLabel>Account Holder Name</CustomLabel>
          <Input
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={bankingData.accountHolderName || ""}
            onChange={(e) => handleChange("accountHolderName", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}