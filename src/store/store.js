import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import loginReducer from "@/features/auth/login/store/loginSlice";
import signupReducer from "@/features/auth/signup/store/signupSlice";
import detailsReducer from "@/features/details/store/detailsSlice";
import dashboardReducer from "@/features/dashboard/store/dashboardSlice";
import uploadReducer from "@/features/upload/store/uploadSlice";
import legalReducer from "@/features/profile/store/legalSlice";
import verifyReducer from "@/features/verifydetails/store/verifySlice";
import ticketReducer from "@/features/issue-raise/storage/issueraiseSlice";
import stagesReducer from "@/features/stages/storage/stagesSlice";
import fintechReducer from "@/features/fintech-partners/store/fintechSlice";
import paymentReducer from "@/features/payments/store/paymentSlice";

const dashboardPersistConfig = {
  key: "dashboard",
  storage,
  blacklist: ["selectedSSRName"], 
};

const rootReducer = combineReducers({
  login: loginReducer,
  signup: signupReducer,
  details: detailsReducer,
  dashboard: persistReducer(dashboardPersistConfig, dashboardReducer), 
  upload: uploadReducer,
  legal: legalReducer,
  verify: verifyReducer,
  ticket:ticketReducer,
  stages: stagesReducer,
  fintech: fintechReducer,
  payments: paymentReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["dashboard", "verify"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);