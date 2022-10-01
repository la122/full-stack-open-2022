import patientData from "../../data/patients.json";
import { Patient, PatientNonSensitive } from "../types";

const patients: Patient[] = patientData;

const getNonSensitiveEntries = (): PatientNonSensitive[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return patients.map(({ ssn, ...rest }) => rest);
};

const addPatient = () => {
  return null;
};

export default {
  getNonSensitiveEntries,
  addPatient,
};
