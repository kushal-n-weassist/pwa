import { Input } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateField, validateBank } from "../store/detailsSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function BankingDetails() {
  const dispatch = useDispatch();

  const {
    banking: bankingData,
    isValidatingBank,
    bankError,
    docStatus,
    bankSuccess, 

  } = useSelector((state) => state.details);

  const isReadOnly = docStatus === 1;

  const handleChange = (field, value) => {
    const formattedValue = field === "ifscCode" ? value.toUpperCase() : value;
    dispatch(updateField({ section: "banking", field, value: formattedValue }));
  };

  useEffect(() => {
  if (bankSuccess) toast.success(bankSuccess);
}, [bankSuccess]);

useEffect(() => {
  if (bankError) toast.error(bankError);
}, [bankError]);

  const handleBlur = (field, currentValue) => {
    // if (isReadOnly) return;

    const ifsc = field === "ifscCode" ? currentValue : bankingData.ifscCode;
    const bankName = field === "bankName" ? currentValue : bankingData.bankName;

    if (ifsc?.length === 11 && bankName?.length > 2) {
      dispatch(validateBank({ ifsc, bank_name: bankName }));
    }
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
        <h2 className="text-[20px] font-extrabold text-gray-900">
          Fill in Banking details
        </h2>
        <p className="text-[13px] text-gray-500 font-medium mt-0.5">
          Fill in all the banking details.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <CustomLabel>IFSC Code</CustomLabel>
          <Input
            isDisabled={isReadOnly} //
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={bankingData.ifscCode || ""}
            onChange={(e) => handleChange("ifscCode", e.target.value)}
            onBlur={(e) => handleBlur("ifscCode", e.target.value)}

          />
        </div>

        <div>
          <CustomLabel>Bank Name</CustomLabel>
          <Input
            isDisabled={isReadOnly} //
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={bankingData.bankName || ""}
            onChange={(e) => handleChange("bankName", e.target.value)}
            onBlur={(e) => handleBlur("bankName", e.target.value)} />
        </div>

        <div>
          <CustomLabel>Branch Name</CustomLabel>
          <Input
            isDisabled={isReadOnly} //
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
            isDisabled={isReadOnly} //
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
            isDisabled={isReadOnly} //
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