import patientData from "../../data/patients.json";
import { Patient, PublicPatient, NewPatient } from "../types";
import { v1 as uuid } from "uuid";
import { parseGender } from "../utils";

const patients: Array<Patient> = patientData.map((p) => ({
  ...p,
  gender: parseGender(p.gender),
}));

const getNonSensitiveEntries = (): PublicPatient[] => {
  return patients.map(({ ssn: _omitted, ...rest }) => rest);
};

const getPatient = (id: string) => {
  return patients.find((p) => p.id === id);
};

const addPatient = (newPatient: NewPatient) => {
  const patient = { id: uuid(), entries: [], ...newPatient };
  patients.push(patient);
  console.log("added", patient);
  return patient;
};

export default {
  getNonSensitiveEntries,
  addPatient,
  getPatient,
};
