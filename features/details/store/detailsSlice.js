import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  patient: {},
  insured: { isSameAsPatient: false },
  address: {},
  identity: {},
  banking: {},
  policy: {},
};

export const detailsSlice = createSlice({
  name: "details",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { section, field, value } = action.payload;
      state[section][field] = value;
    },
    setSameAsPatient: (state, action) => {
      state.insured.isSameAsPatient = action.payload;
      if (action.payload) {
        state.insured.fullName = state.patient.fullName;
      }
    }
  },
});

export const { updateField, setSameAsPatient } = detailsSlice.actions;
export default detailsSlice.reducer;