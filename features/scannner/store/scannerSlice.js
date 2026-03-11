import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchHospitals = createAsyncThunk(
  "scanner/fetchHospitals",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().login.userToken; 
      const res = await fetch("/api/method/weassist.api.pfa_dashboard.fetch_permitted_hospital", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
      });

      const data = await res.json();
      if (data.message?.success === false) return rejectWithValue(data.message.message);

      return data.message.data; 
    } catch (err) {
      return rejectWithValue("Failed to fetch permitted hospitals");
    }
  }
);

const scannerSlice = createSlice({
  name: "scanner",
  initialState: {
    hospitals: [],
    scannedHospital: null, 
    loading: false,
    error: null,
  },
  reducers: {
    setScannerData: (state, action) => {
      const scannedId = action.payload; 
      const match = state.hospitals.find((h) => h.name === scannedId);
      
      if (match) {
        state.scannedHospital = match;
      } else {
        state.scannedHospital = { title: "Unknown Hospital", name: scannedId };
      }
    },
    resetScanner: (state) => {
      state.scannedHospital = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitals = action.payload || [];
      })
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setScannerData, resetScanner } = scannerSlice.actions;
export default scannerSlice.reducer;