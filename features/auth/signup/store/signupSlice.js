import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createUser = createAsyncThunk(
  "signup/createUser",
  async ({ first_name, email, mobile_no }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/method/weassist.api.auth.create_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, email, mobile_no }),
      });
      if (!res.ok) throw await res.json();
      return await res.json();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const sendEmailOtp = createAsyncThunk(
  "signup/sendEmailOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/method/weassist.api.auth.generate_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: email, device_id: "web" }),
      });
      if (!res.ok) throw await res.json();
      return await res.json();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const verifyEmailOtp = createAsyncThunk(
  "signup/verifyEmailOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/method/weassist.api.auth.verify_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: email, otp: otp }),
      });
      if (!res.ok) throw await res.json();
      return await res.json();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const signupSlice = createSlice({
  name: "signup",
  initialState: {
    first_name: "",
    email: "",
    mobile_no: "",
    otp: "",
    loading: false,
    error: null,
  },
  reducers: {
    setField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetSignup: (state) => {
        state.otp = "";
        state.loading = false;
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => { state.loading = true; })
      .addCase(createUser.fulfilled, (state) => { state.loading = false; })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyEmailOtp.pending, (state) => { state.loading = true; });
  },
});

export const { setField, resetSignup } = signupSlice.actions;
export default signupSlice.reducer;