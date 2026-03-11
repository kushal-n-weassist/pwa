import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DEVICE_ID } from '@/features/utils/constants';

const getStoredAuth = () => {
  if (typeof window !== "undefined") {
    return {
      isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
      token: localStorage.getItem("userToken") || null,
      username: localStorage.getItem("username") || "",
      email: localStorage.getItem("email") || "",
    };
  }
  return { isLoggedIn: false, token: null, username: "", email: "" };
};

const initialAuth = getStoredAuth();

export const generateLoginOtp = createAsyncThunk(
  "login/generateOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/method/weassist.api.auth.generate_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: email, device_id: DEVICE_ID }),
      });
      const data = await res.json();
      if (data.message?.success === false) return rejectWithValue(data.message.message);
      return data;
    } catch (err) {
      return rejectWithValue("Failed to connect to server");
    }
  }
);

export const verifyLoginOtp = createAsyncThunk(
  "login/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/method/weassist.api.auth.verify_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: email, otp: otp, device_id: DEVICE_ID, }),
      });
      const data = await res.json();

      if (data.message?.success === false) {
        return rejectWithValue(data.message.message);
      }

      return data;
    } catch (err) {
      return rejectWithValue("Verification failed");
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: {
    email: initialAuth.email,
    otp: "",
    username: initialAuth.username,
    isAuthenticated: initialAuth.isLoggedIn,
    userToken: initialAuth.token,
    loading: false,
    error: null,
  },
  reducers: {
    setLoginField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userToken = null;
      state.email = "";        
      state.username = "";   
      state.otp = "";          
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.clear();
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateLoginOtp.fulfilled, (state) => { state.loading = false; })
      .addCase(generateLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        const { token, email, full_name } = action.payload.message;

        state.loading = false;
        state.isAuthenticated = true;
        state.userToken = token;
        state.email = email;
        state.username = full_name;

        if (typeof window !== "undefined") {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userToken", token);
          localStorage.setItem("username", full_name);
          localStorage.setItem("email", email);

          document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLoginField, logout } = loginSlice.actions;
export default loginSlice.reducer;