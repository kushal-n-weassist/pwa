// features/ticket/store/ticketSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const raiseTicket = createAsyncThunk(
    "ticket/raiseTicket",
    async ({ ssr_id, reason }, { rejectWithValue, getState }) => {
        try {
            const token = getState().login.userToken;
            const res = await fetch("/api/method/weassist.api.ssr.raise_ticket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Basic ${token}` : "",
                },
                body: JSON.stringify({ ssr_id, reason }),
            });

            const data = await res.json();
            if (!data.message?.success) return rejectWithValue(data.message?.message || "Failed to raise ticket");

            return data.message.data;
        } catch (err) {
            return rejectWithValue("Failed to raise ticket");
        }
    }
);

const ticketSlice = createSlice({
    name: "ticket",
    initialState: {
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetTicketState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(raiseTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(raiseTicket.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(raiseTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetTicketState } = ticketSlice.actions;
export default ticketSlice.reducer;