import diagnoseData from "../../data/diagnoses.json";
import { DiagnoseEntry } from "../types";

const diagnoses: DiagnoseEntry[] = diagnoseData;

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
