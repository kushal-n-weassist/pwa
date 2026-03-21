import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { extractErrorMessage } from "@/features/utils/helpers";


const toTitleCase = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


export const submitSSR = createAsyncThunk(
  "details/submitSSR",
  async (ssrName, { rejectWithValue, getState }) => {
    try {
      const token = getState().login?.userToken;
      const state = getState().details;

      const payload = {
        hospital: state.hospital,
        claim_type: state.claimType,
        city: state.city,
        patient_first_name: state.patient.fullName,
        patient_dob: state.patient.dob,
        patient_gender: toTitleCase(state.patient.gender),
        patient_pin_code: state.patient.pincode,
        patient_area: state.patient.area,
        patient_city: state.patient.city,
        patient_state: state.patient.state,
        patient_address_line1: state.patient.address1,
        patient_address_line2: state.patient.address2,


        insured_first_name: state.insured.fullName,
        insured_dob: state.insured.dob,
        insured_gender: toTitleCase(state.insured.gender),
        insured_mobile: state.identity.mobileNumber,
        insured_email: state.identity.email,
        insured_pan: state.identity.panNumber,
        insured_aadhaar: state.identity.aadharNumber,
        insured_profession: state.insured.profession,
        insured_relation: state.insured.relationship,
        insured_company_name: state.insured.companyName,
        insured_employement_since: state.insured.employmentSince,

        insured_pin_code: state.address.pincode,
        insured_area: state.address.area,
        insured_city: state.address.city,
        insured_state: state.address.state,
        insured_address_line1: state.address.address1,
        insured_address_line2: state.address.address2,

        insurance_company: state.policy.insuranceCompany,
        tpa: state.policy.tpa,
        policy_number: state.policy.policyNumber,
        policy_inception: state.policy.policyInceptionDate,
        registered_email: state.policy.registeredEmail,
        policy_type: state.policy.policyType,
        policy_subtype: state.policy.policySubtype,
        employee_id: state.policy.employeeId,
        member_id: state.policy.memberId,

        account_no: state.banking.accountNumber,
        bank: state.banking.bankName,
        branch: state.banking.branchName,
        ifsc_code: state.banking.ifscCode,
        holder_name: state.banking.accountHolderName,


        emergency_name_1: state.identity.emergencyName1,
        emergency_contact_1: state.identity.emergencyNumber1,
        emergency_name_2: state.identity.emergencyName2,
        emergency_contact_2: state.identity.emergencyNumber2,

      };

      const res = await fetch(`/api/method/weassist.api.ssr.create_ssr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("the response of ssr creation ", data)
      if (data.exc) return rejectWithValue(extractErrorMessage(data.exc));
      return data.message;
    } catch (err) {
      return rejectWithValue("Failed to submit details");
    }
  }
);

export const updateSSR = createAsyncThunk(
  "details/updateSSR",
  async (ssrName, { rejectWithValue, getState }) => {
    try {
      const token = getState().login?.userToken;
      const state = getState().details;

      const payload = {
        name: ssrName,
        hospital: state.hospital,
        claim_type: state.claimType,
        city: state.city,
        patient_first_name: state.patient.fullName,
        patient_dob: state.patient.dob,
        patient_gender: toTitleCase(state.patient.gender),
        patient_pin_code: state.patient.pincode,
        patient_area: state.patient.area,
        patient_city: state.patient.city,
        patient_state: state.patient.state,
        patient_address_line1: state.patient.address1,
        patient_address_line2: state.patient.address2,
        bankSuccess: null,
        insured_first_name: state.insured.fullName,
        insured_dob: state.insured.dob,
        insured_gender: toTitleCase(state.insured.gender),
        insured_mobile: state.identity.mobileNumber,
        insured_email: state.identity.email,
        insured_pan: state.identity.panNumber,
        insured_aadhaar: state.identity.aadharNumber,
        insured_profession: state.insured.profession,
        insured_relation: state.insured.relationship,
        insured_company_name: state.insured.companyName,
        insured_employement_since: state.insured.employmentSince,

        insured_pin_code: state.address.pincode,
        insured_area: state.address.area,
        insured_city: state.address.city,
        insured_state: state.address.state,
        insured_address_line1: state.address.address1,
        insured_address_line2: state.address.address2,

        insurance_company: state.policy.insuranceCompany,
        tpa: state.policy.tpa,
        policy_number: state.policy.policyNumber,
        policy_inception: state.policy.policyInceptionDate,
        registered_email: state.policy.registeredEmail,
        policy_type: state.policy.policyType,
        policy_subtype: state.policy.policySubtype,
        employee_id: state.policy.employeeId,
        member_id: state.policy.memberId,

        account_no: state.banking.accountNumber,
        bank: state.banking.bankName,
        branch: state.banking.branchName,
        ifsc_code: state.banking.ifscCode,
        holder_name: state.banking.accountHolderName,

        emergency_name_1: state.identity.emergencyName1,
        emergency_contact_1: state.identity.emergencyNumber1,
        emergency_name_2: state.identity.emergencyName2,
        emergency_contact_2: state.identity.emergencyNumber2,
      };

      console.log("the payload of create or update ", payload)

      const res = await fetch(`/api/method/weassist.api.ssr.update_ssr`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.exc) return rejectWithValue(extractErrorMessage(data.exc));

      if (data._server_messages) {
        const messages = JSON.parse(data._server_messages);
        const firstMsgObj = JSON.parse(messages[0]);

        const cleanMsg = firstMsgObj.message.replace(/<\/?[^>]+(>|$)/g, "");

        return rejectWithValue(cleanMsg);
      }

      if (data.exc_type === "PermissionError") {
        return rejectWithValue(data._error_message || "Permission Denied");
      }

      return data.message;
    } catch (err) {
      return rejectWithValue("Failed to update details");
    }
  }
);

export const fetchHospitals = createAsyncThunk(
  "details/fetchHospitals",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().login?.userToken;
      const res = await fetch("/api/method/weassist.api.pfa_dashboard.fetch_permitted_hospital", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify({})
      });

      const data = await res.json();
      console.log("the data ,", data)
      if (data.message?.success === false) return rejectWithValue(data.message.message);
      return data.message.data || [];
    } catch (err) {
      return rejectWithValue("Failed to load permitted hospitals");
    }
  }
);


export const fetchSingleSSR = createAsyncThunk(
  "dashboard/fetchSingleSSR",
  async (ssrName, { rejectWithValue, getState }) => {
    try {
      const token = getState().login?.userToken;
      const res = await fetch(`api/method/weassist.api.ssr.get_doc_ssr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify({ "name": ssrName })
      });
      const data = await res.json();

      return data.message;
    } catch (err) {
      return rejectWithValue("Failed to fetch details");
    }
  }
);



export const validateBank = createAsyncThunk(
  "details/validateBank",
  async ({ ifsc, bank_name }, { rejectWithValue, getState }) => {
    try {
      const token = getState().login?.userToken;
      const res = await fetch("/api/method/weassist.api.ssr.validate_bank_account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify({
          ifsc: ifsc,
          bank_name: toTitleCase(bank_name)
        }),
      });

      const data = await res.json();
      if (data.exc || data.message?.success === false) {
        return rejectWithValue(data.message?.message || "Validation failed");
      }
      return data.message;
    } catch (err) {
      return rejectWithValue("Failed to connect to validation server");
    }
  }
);

export const fetchInsuranceCompanies = createAsyncThunk(
  "details/fetchInsuranceCompanies",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().login?.userToken;
      const res = await fetch("/api/method/weassist.api.generic.get_insurance_companies", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
      });
      const data = await res.json();
      return data.message || [];
    } catch (err) {
      return rejectWithValue("Failed to load insurance companies");
    }
  }
);

const initialState = {
  hospital: "",
  hospitalName: "",
  claimType: "",
  name: "",
  city: "",
  patient: {},
  docStatus: 0,
  permittedHospitals: [],
  insured: { isSameAsPatient: false },
  address: {},
  identity: {},
  banking: {},
  policy: {},
  insuranceCompanies: [],
  loadingCompanies: false,
  companiesError: null,
  isValidatingBank: false,
  bankError: null,
  isSubmitting: false,
  submitError: null,
  submissionSuccess: false,

};

export const detailsSlice = createSlice({
  name: "details",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { section, field, value } = action.payload;
      state[section][field] = value;
    },
    setSameAsPatient: (state, action) => {
      const isSame = action.payload;
      state.insured.isSameAsPatient = isSame;

      if (isSame) {
        state.insured.fullName = state.patient.fullName || "";
        state.insured.dob = state.patient.dob || "";
        state.insured.gender = state.patient.gender || "";

        state.address = {
          pincode: state.patient.pincode || "",
          city: state.patient.city || "",
          state: state.patient.state || "",
          address1: state.patient.address1 || "",
          address2: state.patient.address2 || "",
          area: state.patient.area || ""
        };
      }
    },
    setScannerData: (state, action) => {
      const { hospitalId, hospitalName, claim_type, city } = action.payload;

      if (hospitalId) state.hospital = hospitalId;
      if (hospitalName) state.hospitalName = hospitalName;
      if (claim_type) state.claimType = claim_type;
      if (city) state.city = city;
    },

    setAllDetails: (state, action) => {
      const d = action.payload;
      state.hospital = d.hospital;
      state.name = d.name;
      state.claimType = d.claim_type;
      state.city = d.city;
      state.docStatus = d.docstatus;

      state.hospital = d.hospital;
      state.name = d.name;
      state.claimType = d.claim_type;
      state.city = d.city;
      state.docStatus = d.docstatus;
      state.doctor = d.doctor;
      state.date_of_admission = d.date_of_admission;
      state.ip_number = d.ip_number;
      state.rta_mlc = d.rta_mlc;
      state.treatment_type = d.treatment_type;
      state.room_type_opted = d.room_type_opted;
      state.laser_implant_cost = d.laser_implant_cost;
      state.room_charges_opted = d.room_charges_opted;
      state.approx_estimate = d.approx_estimate;
      state.icu_charges_opted = d.icu_charges_opted;
      state.risk = d.risk;
      state.presented_problem = d.presented_problem;
      state.line_of_treatment = d.line_of_treatment;


      state.diabetes = d.diabetes;
      state.htn = d.htn;
      state.alcohol = d.alcohol;
      state.smokingdrug_abuse = d.smokingdrug_abuse;
      state.other_health_conditions = d.other_health_conditions;
      state.any_other_ailment = d.any_other_ailment;

      state.patient = {
        fullName: d.patient_first_name,
        dob: d.patient_dob,
        gender: d.patient_gender,
        pincode: d.patient_pin_code,
        area: d.patient_area,
        city: d.patient_city,
        state: d.patient_state,
        address1: d.patient_address_line1,
        address2: d.patient_address_line2,
      };

      state.insured = {
        isSameAsPatient: d.patient_first_name === d.insured_first_name,
        fullName: d.insured_first_name,
        dob: d.insured_dob,
        gender: d.insured_gender,
        relationship: d.insured_relation,
        profession: d.insured_profession,
        companyName: d.insured_company_name,
        employmentSince: d.insured_employement_since,
      };

      state.identity = {
        panNumber: d.insured_pan,
        aadharNumber: d.insured_aadhaar,
        email: d.insured_email,
        mobileNumber: d.insured_mobile,
        emergencyName1: d.emergency_name_1 || "",
        emergencyNumber1: d.emergency_contact_1 || "",
        emergencyName2: d.emergency_name_2 || "",
        emergencyNumber2: d.emergency_contact_2 || "",

      };

      state.policy = {
        insuranceCompany: d.insurance_company,
        tpa: d.tpa,
        policyNumber: d.policy_number,
        policyInceptionDate: d.policy_inception,
        registeredEmail: d.registered_email,
        policyType: d.policy_type,
        policySubtype: d.policy_subtype,
        employeeId: d.employee_id,
        memberId: d.member_id,
      };

      state.address = {
        pincode: d.insured_pin_code,
        city: d.insured_city,
        state: d.insured_state,
        address1: d.insured_address_line1,
        address2: d.insured_address_line2,
      };

      state.banking = {
        accountNumber: d.account_no,
        bankName: d.bank,
        branchName: d.branch,
        ifscCode: d.ifsc_code,
        accountHolderName: d.holder_name,
      };
    },

    resetSuccessState: (state) => {
      // state.submissionSuccess = false;
      state.submitError = null;
      // We usually keep lastCreatedSsr so the success page can still show the ID 
      // until the user fully navigates away.
    },


    resetAllDetails: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsuranceCompanies.pending, (state) => {
        state.loadingCompanies = true;
      })
      .addCase(fetchInsuranceCompanies.fulfilled, (state, action) => {
        state.loadingCompanies = false;
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.insuranceCompanies = payload;
        } else {
          state.insuranceCompanies = Object.entries(payload || {}).map(([id, data]) => ({
            id,
            ...data,
          }));
        }
      })
      .addCase(validateBank.pending, (state) => {
        state.isValidatingBank = true;
        state.bankError = null;
        state.bankSuccess = null;
      })
      .addCase(validateBank.fulfilled, (state, action) => {
        state.isValidatingBank = false;
        state.bankSuccess = action.payload.message; // "Valid IFSC and bank name matched"
      })
      .addCase(validateBank.rejected, (state, action) => {
        state.isValidatingBank = false;
        state.bankError = action.payload; // "Error validating IFSC"
      })
      .addCase(submitSSR.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(submitSSR.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.submissionSuccess = true;
        state.lastCreatedSsr = action.payload.ssr;
      })
      .addCase(submitSSR.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload;
      })
      .addCase(fetchHospitals.pending, (state) => {
        state.loadingHospitals = true;
      })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.loadingHospitals = false;
        state.permittedHospitals = action.payload;
      })
      .addCase(fetchHospitals.rejected, (state) => {
        state.loadingHospitals = false;
      })
      .addCase(updateSSR.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(updateSSR.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.submissionSuccess = true;
        console.log("the f payload ", action);
        // state.lastCreatedSsr = action.payload.name || action.payload.ssr;
      })
      .addCase(updateSSR.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload;
      });
  },
});

export const { updateField, setScannerData, setSameAsPatient, resetSuccessState, resetAllDetails, setAllDetails, } = detailsSlice.actions;
export default detailsSlice.reducer;