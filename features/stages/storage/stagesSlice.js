import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchStageDetails = createAsyncThunk(
  "stages/fetchStageDetails",
  async ({ ssr }, { rejectWithValue, getState }) => {
    try {
      const token = getState().login.userToken;
      const response = await fetch("/api/method/weassist.api.ssr.get_stage_details", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify({ ssr }),
      });
      const data = await response.json();

      if (data.message && data.message.success === false) {
        return rejectWithValue(data.message.message || "Failed to fetch stage details");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch stage details");
    }
  }
);

export const fetchSSREstimate = createAsyncThunk(
  "stages/fetchSSREstimate",
  async ({ ssr }, { rejectWithValue, getState }) => {
    try {
      const token = getState().login.userToken;
      const response = await fetch("/api/method/weassist.api.ssr.submit_ssr_for_verification", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify({ ssr }),
      });
      const data = await response.json();

      if (data.message && data.message.success === true && data.message.message) {
        return data.message.message.approx_estimate || 0;
      }
      return 0;
    } catch (error) {
      return rejectWithValue("Failed to fetch approx estimate");
    }
  }
);

export const fetchIntimateDischarge = createAsyncThunk(
  "stages/fetchIntimateDischarge",
  async ({ ssr }, { rejectWithValue, getState }) => {
    try {
      const token = getState().login.userToken;
      const response = await fetch("/api/method/weassist.api.ssr.intimate_discharge", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify({ ssr }),
      });
      const data = await response.json();

      if (data.message && data.message.success === true) {
        return data.message.message;
      }
      return rejectWithValue("Failed to intimate discharge");
    } catch (error) {
      return rejectWithValue(error.message || "Failed to intimate discharge");
    }
  }
);

export const fetchDifferenceAmountBlockingLink = createAsyncThunk(
  "stages/fetchDifferenceAmountBlockingLink",
  async ({ ssr }, { rejectWithValue, getState }) => {
    try {
      const token = getState().login.userToken;
      const response = await fetch(`/api/method/weassist.api.payments.get_fund_block_link?ssr=${ssr}`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
      });
      const data = await response.json();

      if (data.message && data.message.success === true) {
        return data.message.message || data.message.link || "Payment link generated successfully.";
      }
      return rejectWithValue("Failed to generate block link");
    } catch (error) {
      return rejectWithValue(error.message || "Failed to generate block link");
    }
  }
);

export const downloadHospitalBill = createAsyncThunk(
  "stages/downloadHospitalBill",
  async ({ ssr }, { rejectWithValue, getState }) => {
    try {
      const token = getState().login.userToken;
      const docName = "Draft Hospital Bill - Detailed  (C-N-*)";
      const response = await fetch(`/api/method/weassist.api.ssr.download_car_doc?ssr=${ssr}&doc=${encodeURIComponent(docName)}`, {
        method: "GET",
        headers: { 
          Authorization: token ? `Basic ${token}` : "",
        },
      });

      if (!response.ok) {
        return rejectWithValue("Failed to download hospital bill");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Hospital_Bill_${ssr}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to download hospital bill");
    }
  }
);

export const downloadRequestAcceptanceLetter = createAsyncThunk(
  "stages/downloadRequestAcceptanceLetter",
  async ({ ssr }, { rejectWithValue, getState }) => {
    try {
      const token = getState().login.userToken;
      const response = await fetch(`/api/method/weassist.api.ssr.get_dcn_pdf?ssr=${ssr}&doc=DCN%20Doc`, {
        method: "GET",
        headers: { 
          Authorization: token ? `Basic ${token}` : "",
        },
      });

      if (!response.ok) {
        return rejectWithValue("Failed to download request acceptance letter");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Request_Acceptance_Letter_${ssr}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to download request acceptance letter");
    }
  }
);

export const fetchSSRBlockAmount = createAsyncThunk(
  "stages/fetchSSRBlockAmount",
  async ({ ssr }, { rejectWithValue, getState }) => {
    try {
      const token = getState().login.userToken;
      const response = await fetch("/api/method/weassist.api.ssr.fetch_ssr_block_amount", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify({ ssr }),
      });
      const data = await response.json();

      if (data.message && data.message.success === true) {
        // Assuming the amount is directly under data.message.amount or data.message.data, falling back to 0
        return data.message.amount || data.message.block_amount || data.message.data || 0;
      }

      return 0; // Default zero when not found or success is false
    } catch (error) {
      return rejectWithValue("Failed to fetch block amount");
    }
  }
);

export const fetchCARStatus = createAsyncThunk(
  "stages/fetchCARStatus",
  async ({ ssr }, { rejectWithValue, getState }) => {
    try {
      const token = getState().login.userToken;
      const response = await fetch("/api/method/weassist.api.ssr.fetch_car_status", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify({ ssr }),
      });
      const data = await response.json();

      if (data.message && data.message.success === true) {
        return data.message.car_status || "Created"; // Assuming "Created" if success and no status text
      }
      return null;
    } catch (error) {
      return rejectWithValue("Failed to fetch CAR status");
    }
  }
);

const stagesSlice = createSlice({
  name: "stages",
  initialState: {
    stagesData: [],
    blockAmount: 0,
    approxEstimate: 0,
    intimateDischargeLoading: false,
    intimateDischargeStatus: null,
    diffAmountLoading: false,
    diffAmountStatus: null,
    hospitalBillLoading: false,
    acceptanceLetterLoading: false,
    carStatus: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearStages: (state) => {
      state.stagesData = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStageDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStageDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.stagesData = action.payload.message?.data || [];
      })
      .addCase(fetchStageDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSSRBlockAmount.fulfilled, (state, action) => {
        state.blockAmount = action.payload;
      })
      .addCase(fetchSSREstimate.fulfilled, (state, action) => {
        state.approxEstimate = action.payload;
      })
      .addCase(fetchIntimateDischarge.pending, (state) => {
        state.intimateDischargeLoading = true;
      })
      .addCase(fetchIntimateDischarge.fulfilled, (state, action) => {
        state.intimateDischargeLoading = false;
        state.intimateDischargeStatus = action.payload;
      })
      .addCase(fetchDifferenceAmountBlockingLink.pending, (state) => {
        state.diffAmountLoading = true;
      })
      .addCase(fetchDifferenceAmountBlockingLink.fulfilled, (state, action) => {
        state.diffAmountLoading = false;
        state.diffAmountStatus = action.payload;
      })
      .addCase(downloadHospitalBill.pending, (state) => {
        state.hospitalBillLoading = true;
      })
      .addCase(downloadHospitalBill.fulfilled, (state) => {
        state.hospitalBillLoading = false;
      })
      .addCase(downloadHospitalBill.rejected, (state) => {
        state.hospitalBillLoading = false;
      })
      .addCase(downloadRequestAcceptanceLetter.pending, (state) => {
        state.acceptanceLetterLoading = true;
      })
      .addCase(downloadRequestAcceptanceLetter.fulfilled, (state) => {
        state.acceptanceLetterLoading = false;
      })
      .addCase(downloadRequestAcceptanceLetter.rejected, (state) => {
        state.acceptanceLetterLoading = false;
      })
      .addCase(fetchCARStatus.fulfilled, (state, action) => {
        state.carStatus = action.payload;
      });
  },
});

export const { clearStages } = stagesSlice.actions;
export default stagesSlice.reducer;
