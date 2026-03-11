// features/upload/store/fileStore.js
const fileStore = {
  patientFront: null,
  patientBack: null,
  insuredFront: null,
  insuredBack: null,
  insuredPAN: null,
};

export const setFile = (field, file) => {
  fileStore[field] = file;
  console.log(`fileStore.${field} set:`, file?.name); 
};

export const getFile = (field) => fileStore[field];

export const clearFiles = () => {
  Object.keys(fileStore).forEach((k) => (fileStore[k] = null));
  console.log("fileStore cleared");
};