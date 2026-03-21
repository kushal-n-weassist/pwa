import { Input, Select, SelectItem } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../store/detailsSlice";
import { useEffect, useMemo } from "react";
import { fetchInsuranceCompanies } from "@/features/details/store/detailsSlice";

export default function PolicyDetails() {
  const dispatch = useDispatch();
  
  const { insuranceCompanies, loadingCompanies, docStatus } = useSelector((state) => state.details);
  const policyData = useSelector((state) => state.details.policy);
  
  const isReadOnly = docStatus === 1;

  const companiesArray = useMemo(() => {
    if (!insuranceCompanies || Array.isArray(insuranceCompanies)) {
      return Array.isArray(insuranceCompanies) ? insuranceCompanies : [];
    }
    return Object.entries(insuranceCompanies).map(([id, data]) => ({
      id,
      ...data,
    }));
  }, [insuranceCompanies]);

  useEffect(() => {
    if (!insuranceCompanies || Object.keys(insuranceCompanies).length === 0) {
      dispatch(fetchInsuranceCompanies());
    }
  }, [dispatch, insuranceCompanies]);


  const availableTPAs = useMemo(() => {
    if (!policyData.insuranceCompany || !insuranceCompanies.length) return [];
    const selectedCompany = insuranceCompanies.find(
      (c) => c.id === policyData.insuranceCompany
    );
    return selectedCompany?.tpa ?? [];
  }, [policyData.insuranceCompany, insuranceCompanies]);

  const handleChange = (field, value) => {
    // Prevent state updates if document is submitted
    if (isReadOnly) return;

    dispatch(updateField({ section: "policy", field, value }));

    if (field === "insuranceCompany") {
      dispatch(updateField({ section: "policy", field: "tpa", value: "" }));
    }
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
        <h2 className="text-[20px] font-extrabold text-gray-900">Fill in Policy details</h2>
        <p className="text-[13px] text-gray-500 font-medium mt-0.5">Fill in all the appropriate details.</p>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2 pb-6">

        <div>
          <CustomLabel>Insurance Company</CustomLabel>
          <Select
            isDisabled={isReadOnly}
            placeholder="Select Company"
            variant="bordered"
            aria-label="InsuranceCompany"
            classNames={selectStyles}
            isLoading={loadingCompanies}
            selectedKeys={policyData.insuranceCompany ? [policyData.insuranceCompany] : []}
            onSelectionChange={(keys) => handleChange("insuranceCompany", Array.from(keys)[0])}
          >
            {insuranceCompanies.map((company) => (
              <SelectItem key={company.id} textValue={company.company_name}>
                {company.company_name}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <CustomLabel>TPA</CustomLabel>
          <Select
            labelPlacement="outside"
            placeholder={policyData.insuranceCompany ? "Select TPA" : "Select Company first"}
            variant="bordered"
            aria-label="TPA"
            classNames={selectStyles}
            isDisabled={isReadOnly || availableTPAs.length === 0}
            scrollShadow={false}
            disableAnimation={false}
            selectedKeys={policyData.tpa ? [policyData.tpa] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0];
              handleChange("tpa", value);
            }}
          >
            {availableTPAs.map((tpaItem) => (
              <SelectItem
                key={`${tpaItem.tpa}`}
                textValue={tpaItem.short_code || tpaItem.company_name}
              >
                {tpaItem.short_code || tpaItem.company_name}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <CustomLabel>Policy Number</CustomLabel>
          <Input
            isDisabled={isReadOnly}
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={policyData.policyNumber || ""}
            onChange={(e) => handleChange("policyNumber", e.target.value)}
          />
        </div>

        <div>
          <CustomLabel>Policy inception Date</CustomLabel>
          <Input
            isDisabled={isReadOnly}
            type="date"
            variant="bordered"
            classNames={{ ...inputStyles, input: [inputStyles.input, "appearance-none"] }}
            value={policyData.policyInceptionDate || ""}
            onChange={(e) => handleChange("policyInceptionDate", e.target.value)}
            onClick={(e) => !isReadOnly && e.target.showPicker?.()}
          />
        </div>

        <div>
          <CustomLabel>Registered Email</CustomLabel>
          <Input
            isDisabled={isReadOnly}
            type="email"
            placeholder="example@mail.com"
            variant="bordered"
            classNames={inputStyles}
            value={policyData.registeredEmail || ""}
            onChange={(e) => handleChange("registeredEmail", e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <CustomLabel>Policy Type</CustomLabel>
            <Select
              isDisabled={isReadOnly}
              placeholder="Select"
              variant="bordered"
              aria-label="PolicyType"
              classNames={selectStyles}
              selectedKeys={policyData.policyType ? [policyData.policyType] : []}
              onSelectionChange={(keys) => handleChange("policyType", Array.from(keys)[0])}
            >
              <SelectItem key="Retail" textValue="Retail">Retail</SelectItem>
              <SelectItem key="Corporate" textValue="Corporate">Corporate</SelectItem>
            </Select>
          </div>
          <div className="flex-1">
            <CustomLabel>Policy Subtype</CustomLabel>
            <Select
              isDisabled={isReadOnly}
              placeholder="Select"
              variant="bordered"
              aria-label="PolicySubtype"
              classNames={selectStyles}
              selectedKeys={policyData.policySubtype ? [policyData.policySubtype] : []}
              onSelectionChange={(keys) => handleChange("policySubtype", Array.from(keys)[0])}
            >
              <SelectItem key="Base" textValue="Base">Base</SelectItem>
              <SelectItem key="Top" textValue="Top">Top</SelectItem>
            </Select>
          </div>
        </div>

        <div>
          <CustomLabel>Employee ID</CustomLabel>
          <Input
            isDisabled={isReadOnly}
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={policyData.employeeId || ""}
            onChange={(e) => handleChange("employeeId", e.target.value)}
          />
        </div>

        <div>
          <CustomLabel>Member ID</CustomLabel>
          <Input
            isDisabled={isReadOnly}
            placeholder="XXXXXXXXXXXXXX"
            variant="bordered"
            classNames={inputStyles}
            value={policyData.memberId || ""}
            onChange={(e) => handleChange("memberId", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}