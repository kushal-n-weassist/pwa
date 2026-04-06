import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createSSRPayment = createAsyncThunk(
  "payments/createSSRPayment",
  async ({ ssr, amount }, { rejectWithValue, getState }) => {
    try {
      const token = getState().login?.userToken;
      const response = await fetch("/api/method/weassist.api.payments.create_ssr_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify(amount !== undefined ? { ssr, amount } : { ssr }),
      });

      const data = await response.json();
      if (data.message && (data.message.id || data.message.success)) {
        return data.message;
      }
      console.error("Error response from create payment API:", data);
      return rejectWithValue(data.message?.message || data.error || "Failed to create payment");
    } catch (error) {
      console.error("Error creating payment:", error);
      return rejectWithValue(error.message || "Failed to create payment");
    }
  }
);

export const fetchHospitalBillEstimate = createAsyncThunk(
  "payments/fetchHospitalBillEstimate",
  async ({ ssr }, { rejectWithValue, getState }) => {
    try {
      const token = getState().login?.userToken;
      const response = await fetch("/api/method/weassist.api.ssr.submit_ssr_for_verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify({ ssr }),
      });

      const data = await response.json();
      if (data.message && data.message.success) {
        return data.message.message; // Contains approx_estimate
      }
      return rejectWithValue(data.message?.message || "Failed to fetch estimate");
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch estimate");
    }
  }
);

export const verifyPaymentSignature = createAsyncThunk(
  "payments/verifyPaymentSignature",
  async (data, { rejectWithValue, getState }) => {
    try {
      const token = getState().login?.userToken;
      const response = await fetch("/api/method/weassist.api.payments.order_payment_success", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (resData.message) {
        return resData.message; // Ideally this returns the payment summary
      }
      return rejectWithValue(resData.error || "Failed to verify signature");
    } catch (error) {
      console.error("Error verifying payment signature:", error);
      return rejectWithValue(error.message || "Failed to verify signature");
    }
  }
);

export const createPdaFundBlock = createAsyncThunk(
  "payments/createPdaFundBlock",
  async ({ ssr, fintech_partner }, { rejectWithValue, getState }) => {
    try {
      const token = getState().login?.userToken;
      const response = await fetch("/api/method/weassist.api.payments.create_pda_fund_block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify({ ssr, fintech_partner }),
      });

      const data = await response.json();
      if (data.message && data.message.success) {
        return data.message;
      }
      return rejectWithValue(data.message?.message || "Failed to create fund block");
    } catch (error) {
      console.error("Error creating PDA fund block:", error);
      return rejectWithValue(error.message || "Failed to create fund block");
    }
  }
);

const paymentSlice = createSlice({
  name: "payments",
  initialState: {
    paymentData: null,
    hospitalBillEstimate: null,
    paymentSummary: null,
    verifying: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearPayment: (state) => {
      state.paymentData = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSSRPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSSRPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload;
      })
      .addCase(createSSRPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHospitalBillEstimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHospitalBillEstimate.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitalBillEstimate = action.payload;
      })
      .addCase(fetchHospitalBillEstimate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyPaymentSignature.pending, (state) => {
        state.verifying = true;
        state.error = null;
      })
      .addCase(verifyPaymentSignature.fulfilled, (state, action) => {
        state.verifying = false;
        state.paymentSummary = action.payload;
      })
      .addCase(verifyPaymentSignature.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload;
      })
      .addCase(createPdaFundBlock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPdaFundBlock.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPdaFundBlock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
