import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DEVICE_ID } from '@/features/utils/constants';
import { verifyEmailOtp } from '@/features/auth/signup/store/signupSlice';

const getStoredAuth = () => {
  if (typeof window !== "undefined") {
    return {
      isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
      token: localStorage.getItem("userToken") || null,
      username: localStorage.getItem("username") || "",
      email: localStorage.getItem("email") || "",
      gender: localStorage.getItem("gender") || null,
    };
  }
  return { isLoggedIn: false, token: null, username: "", email: "", gender: null };
};

const initialAuth = getStoredAuth();

export const generateLoginOtp = createAsyncThunk(
  "login/generateOtp",
  async ({ email, deviceId }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/method/weassist.api.auth.generate_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ user_id: email, device_id: deviceId }),
        body:JSON.stringify({user_id:email,device_id:'3fd6eb18ba049a5b3fb4c785d2bcfa7c'})
        // body:JSON.stringify({user_id:email,device_id:'47338d84b6026ed93a75e1571bd5e619'})

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
  async ({ email, otp, deviceId }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/method/weassist.api.auth.verify_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ user_id: email, otp, device_id: deviceId }),
        body:JSON.stringify({user_id:email,otp,device_id:'3fd6eb18ba049a5b3fb4c785d2bcfa7c'})
        // body:JSON.stringify({user_id:email,otp,device_id:'47338d84b6026ed93a75e1571bd5e619'})

   
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
    profilePic: typeof window !== "undefined" ? localStorage.getItem("user_profile_pic") : null,
    error: null,
    gender: null
  },
  reducers: {
    setLoginField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    updateProfilePic: (state, action) => {
      state.profilePic = action.payload;
      localStorage.setItem("user_profile_pic", action.payload);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userToken = null;
      state.email = "";
      state.username = "";
      state.otp = "";
      state.error = null;
      state.gender = null;
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
        const { token, email, full_name, gender } = action.payload.message;

        state.loading = false;
        state.isAuthenticated = true;
        state.userToken = token;
        state.email = email;
        state.username = full_name;
        state.gender = gender

        if (typeof window !== "undefined") {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userToken", token);
          localStorage.setItem("username", full_name);
          localStorage.setItem("email", email);
          localStorage.setItem("gender", gender)

          document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log("login verification failed ", action)
      })
      // ── Signup OTP verified → hydrate login state immediately ──
      .addCase(verifyEmailOtp.fulfilled, (state, action) => {
        const msg = action.payload?.message;
        if (!msg?.token) return;
        state.isAuthenticated = true;
        state.userToken = msg.token;
        state.email = msg.email || "";
        state.username = msg.full_name || msg.first_name || "";
        state.gender = msg.gender || null;
      });
  },
});

export const { setLoginField, logout ,updateProfilePic} = loginSlice.actions;
export default loginSlice.reducer;