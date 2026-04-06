// features/upload/store/uploadSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFile, getFilesByPrefix, clearFiles } from "./fileStore";


const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
  });

const combineImagesToPDFBase64 = async (frontFile, backFile) => {
  const { PDFDocument } = await import("pdf-lib");
  const pdfDoc = await PDFDocument.create();

  const addImagePage = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    let img;
    if (file.type === "image/png") {
      img = await pdfDoc.embedPng(arrayBuffer);
    } else {
      img = await pdfDoc.embedJpg(arrayBuffer);
    }
    const page = pdfDoc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  };

  await addImagePage(frontFile);
  if (backFile) await addImagePage(backFile);

  const pdfBytes = await pdfDoc.save();
  const base64 = btoa(
    new Uint8Array(pdfBytes).reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
  return base64;
};

const uploadDoc = async (ssrName, token, documentName, file) => {
  const content = await toBase64(file);
  const file_type = file.type === "application/pdf" ? "pdf" : "jpg";
  const res = await fetch("/api/method/weassist.api.ssr.upload_ssr_docs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Basic ${token}` : "",
    },
    body: JSON.stringify({
      name: ssrName,
      docs: [{ document: documentName, file_type, content }],
    }),
  });
  return res.json();
};

export const uploadSSRDocs = createAsyncThunk(
  "upload/uploadSSRDocs",
  async (ssrName, { rejectWithValue, getState }) => {
    try {
      const token = getState().login?.userToken;

      const patientFront      = getFile("patientFront");
      const patientBack       = getFile("patientBack");
      const proposerFront     = getFile("proposerFront");
      const proposerBack      = getFile("proposerBack");
      const proposerPAN       = getFile("proposerPAN");
      const patientInsurance  = getFile("patientInsurance");
      const proposerPolicy    = getFile("proposerPolicy");
      const consultationDocs  = getFilesByPrefix("consultationDoc_");

      console.log("uploadSSRDocs called with SSR:", ssrName);
      console.log("files found:", {
        patientFront: !!patientFront,
        patientBack: !!patientBack,
        proposerFront: !!proposerFront,
        proposerBack: !!proposerBack,
        proposerPAN: !!proposerPAN,
        patientInsurance: !!patientInsurance,
        proposerPolicy: !!proposerPolicy,
        consultationDocs: consultationDocs.length,
      });

      const allPromises = [];

      if (patientFront) {
        let content;
        let file_type;

        if (patientBack && patientFront.type === "image/jpeg" && patientBack.type === "image/jpeg") {
          content = await combineImagesToPDFBase64(patientFront, patientBack);
          file_type = "pdf";
        } else if (patientFront.type === "application/pdf") {
          content = await toBase64(patientFront);
          file_type = "pdf";
        } else {
          content = await toBase64(patientFront);
          file_type = "jpg";
        }

        allPromises.push(
          fetch("/api/method/weassist.api.ssr.upload_ssr_docs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Basic ${token}` : "",
            },
            body: JSON.stringify({
              name: ssrName,
              docs: [{ document: "Id Card - Patient (O-1)*", file_type, content }],
            }),
          })
            .then((r) => r.json())
            .then((res) => { console.log("Patient Aadhaar upload result:", res); return res; })
        );
      }

      // Aadhar (Insured) - Front (O-1)* and Back (O-1)* are separate docs
      if (proposerFront) {
        allPromises.push(
          uploadDoc(ssrName, token, "Aadhar (Insured) - Front (O-1)*", proposerFront)
            .then((res) => { console.log("Proposer Aadhaar Front upload result:", res); return res; })
        );
      }
      if (proposerBack) {
        allPromises.push(
          uploadDoc(ssrName, token, "Aadhar (Insured) - Back (O-1)*", proposerBack)
            .then((res) => { console.log("Proposer Aadhaar Back upload result:", res); return res; })
        );
      }

      if (proposerPAN) {
        allPromises.push(
          uploadDoc(ssrName, token, "PAN Card - Pri. Insured (O-1)*", proposerPAN)
            .then((res) => { console.log("Proposer PAN upload result:", res); return res; })
        );
      }

      if (patientInsurance) {
        allPromises.push(
          uploadDoc(ssrName, token, "e-Card - Family (O-1)*", patientInsurance)
            .then((res) => { console.log("e-Card Family upload result:", res); return res; })
        );
      }

      if (proposerPolicy) {
        allPromises.push(
          uploadDoc(ssrName, token, "Employee ID (O-1)*", proposerPolicy)
            .then((res) => { console.log("Employee ID upload result:", res); return res; })
        );
      }

      for (const doc of consultationDocs) {
        allPromises.push(
          uploadDoc(ssrName, token, "Documents Sent to Ins Comp (O-N)*", doc)
            .then((res) => { console.log("Consultation paper upload result:", res); return res; })
        );
      }



      if (allPromises.length === 0) {
        console.log("No files found in fileStore — nothing to upload");
        return [];
      }

      const results = await Promise.all(allPromises);
      clearFiles();
      return results;
    } catch (err) {
      console.log("uploadSSRDocs error:", err);
      return rejectWithValue("Failed to upload documents: " + err.message);
    }
  }
);

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    patientFront: null,
    patientBack: null,
    proposerFront: null,
    proposerBack: null,
    proposerPAN: null,
    patientInsurance: null,
    proposerPolicy: null,
    isUploading: false,
    uploadError: null,
    uploadSuccess: false,
  },
  reducers: {
    setUploadFile: (state, action) => {
      const { field, file } = action.payload;
      state[field] = file
        ? { name: file.name, type: file.type, size: file.size }
        : null;
    },
    resetUpload: () => ({
      patientFront: null,
      patientBack: null,
      proposerFront: null,
      proposerBack: null,
      proposerPAN: null,
      patientInsurance: null,
      proposerPolicy: null,
      isUploading: false,
      uploadError: null,
      uploadSuccess: false,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadSSRDocs.pending, (state) => {
        state.isUploading = true;
        state.uploadError = null;
      })
      .addCase(uploadSSRDocs.fulfilled, (state) => {
        state.isUploading = false;
        state.uploadSuccess = true;
      })
      .addCase(uploadSSRDocs.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadError = action.payload;
      });
  },
});

export const { setUploadFile, resetUpload } = uploadSlice.actions;
export default uploadSlice.reducer;