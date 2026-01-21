import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '@/features/auth/login/store/loginSlice';
import signupReducer from '@/features/auth/signup/store/signupSlice';


export const store = configureStore({
  reducer: {
    login:loginReducer,
    signup:signupReducer
  },
});