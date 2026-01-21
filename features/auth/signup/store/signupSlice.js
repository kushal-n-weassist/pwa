import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  password: "",
  confirmPassword: "",
  loading: false,
  error: null,
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setSignupField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetSignup: () => initialState,
  },
});

export const { setSignupField, resetSignup } = signupSlice.actions;
export default signupSlice.reducer;
