import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      if (username === 'Admin' && password === 'Password') {
        return { username, success: true };
      } else {
        return rejectWithValue("Invalid username or password");
      }
    } catch (error) {
      return rejectWithValue("Network or Server Error");
    }
  }
);


const initialState = {
  username: "",
  password: "",
  loading: false,
  error: null,
  isAuthenticated:null
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoginField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetLogin: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state,action) => {
        console.log("succesfull loign in",action);
        state.loading = false;
        state.isAuthenticated=true;
        state.username=action.payload.username;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log("failed ",action);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLoginField, resetLogin } = loginSlice.actions;
export default loginSlice.reducer;
