import patientData from "../../data/patients";
import { Patient, PublicPatient, NewPatient, NewEntry } from "../types";
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
  console.log("added patient", patient.id);
  return patient;
};

const addEntry = (patient: Patient, newEntry: NewEntry) => {
  const entry = { id: uuid(), ...newEntry };
  patient.entries.push(entry);
  console.log("added entry", entry.id);
  return entry;
};

export default {
  getNonSensitiveEntries,
  addPatient,
  getPatient,
  addEntry,
};
