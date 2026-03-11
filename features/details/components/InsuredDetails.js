import { Input, Select, SelectItem, Checkbox } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateField, setSameAsPatient } from "../store/detailsSlice"; 
import { useEffect } from "react";

export default function InsuredDetails() {
  const dispatch = useDispatch();
  const insuredData = useSelector((state) => state.details.insured);
  
  const docStatus = useSelector((state) => state.details.docStatus);
  const isReadOnly = docStatus === 1;

  const professionOptions = [
    { label: "Salaried", value: "Salaried" },
    { label: "Business", value: "Business" },
    { label: "Pensioners", value: "Pensioners" },
    { label: "No Income", value: "No Income" }
  ];

  const handleChange = (field, value) => {
    dispatch(updateField({ section: "insured", field, value }));
  };

  const handleCheckboxToggle = (isSelected) => {
    dispatch(setSameAsPatient(isSelected));
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
        <h2 className="text-[20px] font-extrabold text-gray-900">Fill in Insured details</h2>
        <p className="text-[13px] text-gray-500 font-medium mt-0.5">Fill in all the appropriate details.</p>
      </div>

      <div className="flex items-center justify-between py-2">
        <span className="text-[13px] font-bold text-gray-700">Is The Patient Same As Insured?</span>
        <Checkbox 
          isDisabled={isReadOnly}
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
              isDisabled={isReadOnly}
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
                isDisabled={isReadOnly}
                type="date" 
                value={insuredData.dob || ""}
                onChange={(e) => handleChange("dob", e.target.value)}
                variant="bordered" 
                classNames={{...inputStyles, input: [inputStyles.input, "appearance-none"]}}
                onClick={(e) => !isReadOnly && e.target.showPicker?.()}
              />
            </div>
            <div className="flex-1">
              <CustomLabel>Gender</CustomLabel>
              <Select 
                isDisabled={isReadOnly}
                placeholder="Select" 
                variant="bordered" 
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
              isDisabled={isReadOnly}
              value={insuredData.relationship || ""}
              onChange={(e) => handleChange("relationship", e.target.value)}
              placeholder="XXXXXXXXXXXXXX" 
              variant="bordered" 
              classNames={inputStyles} 
            />
          </div>

          <div>
            <CustomLabel>Profession</CustomLabel>
            <Select 
              isDisabled={isReadOnly}
              placeholder="Select Profession" 
              variant="bordered" 
              classNames={selectStyles}
              selectedKeys={insuredData.profession ? [insuredData.profession] : []}
              onSelectionChange={(keys) => handleChange("profession", Array.from(keys)[0])}
            >
              {professionOptions.map((opt) => (
                <SelectItem key={opt.value} textValue={opt.label}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div>
            <CustomLabel>Company name</CustomLabel>
            <Input 
              isDisabled={isReadOnly}
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
              isDisabled={isReadOnly}
              type="date"
              value={insuredData.employmentSince || ""}
              onChange={(e) => handleChange("employmentSince", e.target.value)}
              variant="bordered" 
              classNames={{...inputStyles, input: [inputStyles.input, "appearance-none"]}}
              onClick={(e) => !isReadOnly && e.target.showPicker?.()}
            />
          </div>
        </div>
      )}
    </div>
  );
}