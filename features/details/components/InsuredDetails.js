import { Input, Select, SelectItem, Checkbox } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateField, setSameAsPatient } from "../store/detailsSlice"; 
import { useEffect } from "react";

export default function InsuredDetails() {
  const dispatch = useDispatch();
  
  const insuredData = useSelector((state) => state.details.insured);

    const state = useSelector((state)=>state);
  
  useEffect(()=>{
    console.log("the state ",state)
  },[state])



  const handleChange = (field, value) => {
    dispatch(updateField({ section: "insured", field, value }));
  };

  const handleCheckboxToggle = (isSelected) => {
    dispatch(setSameAsPatient(isSelected));
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

  const selectStyles = {
    label: "hidden",
    trigger: [
      "h-[42px]", "min-h-[42px]", "rounded-[10px]", "border-gray-200", "bg-white",
      "shadow-none", "flex items-center justify-between", "after:hidden", "before:hidden"
    ],
    popoverContent: ["bg-white", "border border-gray-100", "shadow-lg", "rounded-[12px]"],
    value: "text-[14px] text-gray-700 font-medium pt-0",
    innerWrapper: "flex items-center justify-between h-full",
    selectorIcon: "text-gray-400 w-4 h-4 static",
  };

  const CustomLabel = ({ children }) => (
    <label className="text-[13px] font-bold text-gray-900 mb-1 block">{children}</label>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1">
        <h2 className="text-[20px] font-extrabold text-gray-900">Fill in Insured details</h2>
        <p className="text-[13px] text-gray-500 font-medium mt-0.5">Fill in all the appropriate details.</p>
      </div>

      <div className="flex items-center justify-between py-2">
        <span className="text-[13px] font-bold text-gray-700">Is The Patient Same As Insured?</span>
        <Checkbox 
          isSelected={insuredData.isSameAsPatient}
          onValueChange={handleCheckboxToggle}
          radius="sm" 
          classNames={{ wrapper: "after:bg-[#1DA1FA] border-gray-300 w-6 h-6 rounded-md" }} 
        />
      </div>

      {!insuredData.isSameAsPatient && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <CustomLabel>Full Name</CustomLabel>
            <Input 
              value={insuredData.fullName || ""}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="XXXXXXXXXXXXXX" 
              variant="bordered" 
              classNames={inputStyles} 
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <CustomLabel>Date of birth</CustomLabel>
              <Input 
                type="date" 
                value={insuredData.dob || ""}
                onChange={(e) => handleChange("dob", e.target.value)}
                variant="bordered" 
                classNames={{...inputStyles, input: [inputStyles.input, "appearance-none"]}}
                onClick={(e) => e.target.showPicker?.()}
              />
            </div>
            <div className="flex-1">
              <CustomLabel>Gender</CustomLabel>
              <Select 
                placeholder="XXXX" 
                variant="bordered" 
                disableAnimation 
                classNames={selectStyles}
                selectedKeys={insuredData.gender ? [insuredData.gender] : []}
                onSelectionChange={(keys) => handleChange("gender", Array.from(keys)[0])}
              >
                <SelectItem key="male" textValue="Male">Male</SelectItem>
                <SelectItem key="female" textValue="Female">Female</SelectItem>
              </Select>
            </div>
          </div>

          <div>
            <CustomLabel>Relationship</CustomLabel>
            <Input 
              value={insuredData.relationship || ""}
              onChange={(e) => handleChange("relationship", e.target.value)}
              placeholder="XXXXXXXXXXXXXX" 
              variant="bordered" 
              classNames={inputStyles} 
            />
          </div>

          <div>
            <CustomLabel>Profession</CustomLabel>
            <Input 
              value={insuredData.profession || ""}
              onChange={(e) => handleChange("profession", e.target.value)}
              placeholder="XXXXXXXXXXXXXX" 
              variant="bordered" 
              classNames={inputStyles} 
            />
          </div>

          <div>
            <CustomLabel>Company name</CustomLabel>
            <Input 
              value={insuredData.companyName || ""}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder="XXXXXXXXXXXXXX" 
              variant="bordered" 
              classNames={inputStyles} 
            />
          </div>

          <div>
            <CustomLabel>Employment since</CustomLabel>
            <Input 
              value={insuredData.employmentSince || ""}
              onChange={(e) => handleChange("employmentSince", e.target.value)}
              placeholder="XXXXXXXXXXXXXX" 
              variant="bordered" 
              classNames={inputStyles} 
            />
          </div>
        </div>
      )}
    </div>
  );
}