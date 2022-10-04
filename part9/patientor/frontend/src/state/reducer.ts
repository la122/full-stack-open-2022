import { State } from "./state";
import { Diagnosis, Entry, Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "ADD_ENTRY";
      payload: { patientId: string; entry: Entry };
    }
  | {
      type: "SET_DIAGNOSIS_LIST";
      payload: Diagnosis[];
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case "ADD_ENTRY":
      const patient = state.patients[action.payload.patientId];
      const entriesUpdated = [...patient.entries, action.payload.entry];
      const patientUpdated = { ...patient, entries: entriesUpdated };
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.patientId]: patientUpdated,
        },
      };
    case "SET_DIAGNOSIS_LIST": {
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses,
        },
      };
    }
    default:
      return state;
  }
};

export const setPatientList = (payload: Patient[]): Action => {
  console.log("setPatientList creator");
  return {
    type: "SET_PATIENT_LIST",
    payload,
  };
};

export const addPatient = (payload: Patient): Action => {
  console.log("addPatient creator");
  return {
    type: "ADD_PATIENT",
    payload,
  };
};

export const addEntry = (patientId: string, entry: Entry): Action => {
  console.log("addEntry creator");
  return {
    type: "ADD_ENTRY",
    payload: { patientId, entry },
  };
};

export const setDiagnosisList = (payload: Diagnosis[]): Action => {
  console.log("setDiagnosisList creator");
  return {
    type: "SET_DIAGNOSIS_LIST",
    payload,
  };
};
