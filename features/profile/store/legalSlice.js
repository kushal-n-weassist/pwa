
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchLegalContent = createAsyncThunk(
    "legal/fetchLegalContent",
    async (field, { getState }) => {
        try {
            const token = getState().login?.userToken;
            const response = await fetch(
                "/api/method/weassist.api.generic.get_legal_content",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Basic ${token}` : "",
                    },
                    body: JSON.stringify({ field }),
                }
            );

            if (!response.ok) {
                // Permission denied or other error — return empty so profile still loads
                return { field, data: null };
            }

            const data = await response.json();
            return { field, data };

        } catch {
            // Network error — return empty so profile still loads
            return { field, data: null };
        }
    }
);

const legalSlice = createSlice({
    name: "legal",
    initialState: {
        privacy_policy: null,
        terms_of_use: null,
        contact_us: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLegalContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLegalContent.fulfilled, (state, action) => {
                state.loading = false;
                const { field, data } = action.payload;
                state[field] = data;
            })
            .addCase(fetchLegalContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = legalSlice.actions;

export const selectLegalContent = (field) => (state) => state.legal[field];
export const selectLegalLoading = (state) => state.legal.loading;
export const selectLegalError = (state) => state.legal.error;

export default legalSlice.reducer;