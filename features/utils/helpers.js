export const extractErrorMessage = (excString) => {
  try {
    const errorLog = JSON.parse(excString);
    const fullError = errorLog[0];

    const valMatch = fullError.match(/frappe\.exceptions\.ValidationError:\s*(.*)/);
    if (valMatch) return valMatch[1].trim();

    const dbMatch = fullError.match(/pymysql\.err\.OperationalError: \(.*?, "(.*?)"\)/);
    if (dbMatch) return dbMatch[1].trim();

    const mandatoryMatch = fullError.match(/frappe\.exceptions\.MandatoryError:\s*(.*)/);
    if (mandatoryMatch) return `Missing required field: ${mandatoryMatch[1]}`;

    return "Server Error: Please check your inputs.";
  } catch (e) {
    return "An unexpected error occurred.";
  }
};