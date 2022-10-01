import patientData from "../../data/patients.json";
import { Patient, NonSensitivePatient, NewPatient } from "../types";
import { v1 as uuid } from "uuid";
import { parseGender } from "../utils";

const patients: Array<Patient> = patientData.map((p) => ({
  ...p,
  gender: parseGender(p.gender),
}));

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ ssn: _omitted, ...rest }) => rest);
};

const addPatient = (newPatient: NewPatient) => {
  const patient = { id: uuid(), ...newPatient };
  patients.push(patient);
  console.log("added", patient);
  return patient;
};

export default {
  getNonSensitiveEntries,
  addPatient,
};
