import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DEVICE_ID } from '@/features/utils/constants';


export const verifyDetailsOtp = createAsyncThunk(
    "verify/verifyOtp",
    async ({ email, otp }, { rejectWithValue }) => {
        console.log("calling")
        try {
            const res = await fetch("/api/method/weassist.api.auth.verify_otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: email,
                    otp: otp,
                    device_id: DEVICE_ID
                }),
            });
            console.log("res",res);
            const data = await res.json();
            console.log("called ",data)

            if (data.message?.success === false) {
                return rejectWithValue(data.message.message);
            }

            return data.message;
        } catch (err) {
            return rejectWithValue("Verification failed");
        }
    }
);

export const submitSSRForVerification = createAsyncThunk(
  "verifyDetails/submitSSR",
  async (ssrName, { rejectWithValue, getState }) => {
    try {
      const token = getState().login?.userToken;
      const res = await fetch("/api/method/weassist.api.ssr.submit_ssr_for_verification", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify({ ssr: ssrName }),
      });
      
      const data = await res.json();
      
      if (data.exc) return rejectWithValue("System error during submission");
      if (data.message?.success === false) return rejectWithValue(data.message.message);
      
      return data.message;
    } catch (err) {
      return rejectWithValue("Final submission failed");
    }
  }
);

export const generateVerifyOtp = createAsyncThunk(
    "verifyDetails/generateOtp",
    async (identifier, { rejectWithValue }) => {
        try {
            const res = await fetch("/api/method/weassist.api.auth.generate_otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: identifier, device_id: DEVICE_ID }),
            });
            const data = await res.json();
            if (data.message?.success === false) return rejectWithValue(data.message.message);
            return data;
        } catch (err) {
            return rejectWithValue("Failed to send OTP");
        }
    }
);

const verifySlice = createSlice({
    name: "verify",
    initialState: {
        loading: false,
        error: null,
        isVerified: false,
    },
    reducers: {
        resetVerifyState: (state) => {
            state.loading = false;
            state.error = null;
            state.isVerified = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateVerifyOtp.pending, (state) => { state.loading = true; })
            .addCase(generateVerifyOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(verifyDetailsOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyDetailsOtp.fulfilled, (state) => {
                state.loading = false;
                state.isVerified = true;
            })
            .addCase(verifyDetailsOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetVerifyState } = verifySlice.actions;
export default verifySlice.reducer;