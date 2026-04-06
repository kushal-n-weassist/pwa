// features/upload/store/fileStore.js
const fileStore = {};

export const setFile = (field, file) => {
  fileStore[field] = file;
  console.log(`fileStore.${field} set:`, file?.name);
};

export const getFile = (field) => fileStore[field];

// Returns all files whose key starts with the given prefix
export const getFilesByPrefix = (prefix) =>
  Object.entries(fileStore)
    .filter(([k, v]) => k.startsWith(prefix) && v != null)
    .map(([, v]) => v);

export const clearFiles = () => {
  Object.keys(fileStore).forEach((k) => (fileStore[k] = null));
  console.log("fileStore cleared");
};