import { Input } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../store/detailsSlice";
import { useEffect } from "react";

export default function PolicyDetails() {
  const dispatch = useDispatch();
  const policyData = useSelector((state) => state.details.policy);

    const state = useSelector((state)=>state);


    useEffect(()=>{
      console.log("the state ",state)
    },[state])

  const handleChange = (field, value) => {
    dispatch(updateField({ section: "policy", field, value }));
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

  const fields = [
    { label: "Insurance Company", key: "insuranceCompany" },
    { label: "TPA", key: "tpa" },
    { label: "Policy Number", key: "policyNumber" },
    { label: "Policy inception Date", key: "policyInceptionDate", type: "date" },
    { label: "Registered Email", key: "registeredEmail", type: "email" },
    { label: "Policy Type", key: "policyType" },
    { label: "Policy Subtype", key: "policySubtype" },
    { label: "Employee id", key: "employeeId" },
    { label: "Member ID", key: "memberId" }
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1">
        <h2 className="text-[20px] font-extrabold text-gray-900">
          Fill in Policy details
        </h2>
        <p className="text-[13px] text-gray-500 font-medium mt-0.5">
          Fill in all the appropriate details.
        </p>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto max-h-[55vh] pr-1 pb-4">
        {fields.map((f) => (
          <div key={f.key}>
            <CustomLabel>{f.label}</CustomLabel>
            <Input
              type={f.type || "text"}
              placeholder="XXXXXXXXXXXXXX"
              variant="bordered"
              classNames={f.type === "date" ? { ...inputStyles, input: [inputStyles.input, "appearance-none"] } : inputStyles}
              value={policyData[f.key] || ""}
              onChange={(e) => handleChange(f.key, e.target.value)}
              onClick={f.type === "date" ? (e) => e.target.showPicker?.() : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}