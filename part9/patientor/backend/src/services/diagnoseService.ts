import diagnoseData from "../../data/diagnoses.json";
import { Diagnose } from "../types";

const diagnoses: Diagnose[] = diagnoseData;

const getEntries = () => {
  return diagnoses;
};

const addDiagnose = () => {
  return null;
};

export default {
  getEntries,
  addDiagnose,
};
