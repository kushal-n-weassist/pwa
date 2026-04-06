import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchFintechPartners = createAsyncThunk(
  "fintech/fetchPartners",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().login?.userToken;
      const response = await fetch("/api/method/weassist.api.ssr.fetch_finetech_partners", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Basic ${token}` : "",
        },
      });

      const data = await response.json();
      if (data.message && data.message.success) {
        return data.message.data;
      }
      return rejectWithValue(data.message?.message || "Failed to fetch partners");
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch partners");
    }
  }
);

const fintechSlice = createSlice({
  name: "fintech",
  initialState: {
    partners: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFintech: (state) => {
      state.partners = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFintechPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFintechPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload;
      })
      .addCase(fetchFintechPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFintech } = fintechSlice.actions;
export default fintechSlice.reducer;
