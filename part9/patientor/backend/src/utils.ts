import { Gender, NewPatient } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseName = (text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error(`Incorrect or missing name`);
  }
  return text;
};

const parseSSN = (text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error(`Incorrect or missing SSN`);
  }
  return text;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

export const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

const parseOccupation = (text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error(`Incorrect or missing occupation`);
  }
  return text;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

export const toNewPatient = (object: unknown): NewPatient => {
  const patient = object as NewPatient;
  return {
    name: parseName(patient.name),
    dateOfBirth: parseDate(patient.dateOfBirth),
    ssn: parseSSN(patient.ssn),
    gender: parseGender(patient.gender),
    occupation: parseOccupation(patient.occupation),
  };
};
