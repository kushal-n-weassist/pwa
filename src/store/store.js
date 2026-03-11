import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import loginReducer from "@/features/auth/login/store/loginSlice";
import signupReducer from "@/features/auth/signup/store/signupSlice";
import detailsReducer from "@/features/details/store/detailsSlice";
import dashboardReducer from "@/features/dashboard/store/dashboardSlice";
import uploadReducer from "@/features/upload/store/uploadSlice";
import legalReducer from "@/features/profile/store/legalSlice";



const rootReducer = combineReducers({
  login: loginReducer,
  signup: signupReducer,
  details: detailsReducer,
  dashboard: dashboardReducer,
  upload: uploadReducer,
  legal: legalReducer,

});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["dashboard"], 
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
