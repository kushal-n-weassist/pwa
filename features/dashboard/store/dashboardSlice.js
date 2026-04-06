import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSSR = createAsyncThunk(
  "dashboard/fetchSSR",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().login.userToken;

      const res = await fetch("/api/method/weassist.api.ssr.get_ssr", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
      });

      const data = await res.json();

      if (data.message?.success === false)
        return rejectWithValue(data.message.message);

      return data.message;
    } catch (err) {
      return rejectWithValue("Failed to load SSR data");
    }
  }
);


export const fetchHospitals = createAsyncThunk(
  "dashboard/fetchHospitals",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().login.userToken;
      const res = await fetch("/api/method/weassist.api.pfa_dashboard.fetch_permitted_hospital", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
        body: JSON.stringify({})
      });

      const data = await res.json();
      if (!data.message?.success) return rejectWithValue(data.message?.message || "Error");

      return data.message.data;
    } catch (err) {
      return rejectWithValue("Failed to load hospitals");
    }
  }
);


const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    ssrList: [],
    loading: false,
    error: null,
    hospitals: [],
    selectedHospitalName: null,
    selectedSSRName: null,
  },
  reducers: {
    setSelectedSSR: (state, action) => {
      state.selectedSSRName = action.payload;
    },

    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSSR.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSSR.fulfilled, (state, action) => {
        state.loading = false;
        state.ssrList = action.payload || [];
      })
      .addCase(fetchSSR.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAllDetails, setSelectedSSR } = dashboardSlice.actions;
export default dashboardSlice.reducer;
