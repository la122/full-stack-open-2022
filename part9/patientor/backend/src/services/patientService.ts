import patientData from "../../data/patients.json";
import { Patient, NonSensitivePatient, NewPatient } from "../types";
import { v1 as uuid } from "uuid";

const patients: Patient[] = patientData;

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return patients.map(({ ssn, ...rest }) => rest);
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
