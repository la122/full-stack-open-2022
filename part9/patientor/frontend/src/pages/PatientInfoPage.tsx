import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { addPatient, useStateValue } from "../state";
import { Diagnosis, Entry, Gender, Patient } from "../types";
import TransgenderIcon from "@mui/icons-material/Transgender";
import FemaleIcon from "@mui/icons-material/Female";
import ManIcon from "@mui/icons-material/Man";

const GenderIcon = ({ gender }: { gender: Gender }) => {
  if (gender == Gender.Female) {
    return <FemaleIcon />;
  }
  if (gender == Gender.Male) {
    return <ManIcon />;
  }
  return <TransgenderIcon />;
};

const Entries = ({
  entries,
  diagnoses,
}: {
  entries: Entry[];
  diagnoses: Diagnosis[];
}) => {
  const description = (code: string) =>
    diagnoses.find((d) => d.code === code)?.name;

  return (
    <div>
      {entries.map((entry) => (
        <div key={entry.id}>
          {entry.date} <i>{entry.description}</i>
          <ul>
            {entry.diagnosisCodes?.map((code) => (
              <li key={code}>
                {code} {description(code)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
const PatientInfoPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (id == undefined) {
          throw new Error("patient id undefined");
        }
        if (patients[id].ssn !== undefined) {
          return;
        }

        const { data } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        console.log("fetchted", data);
        dispatch(addPatient(data));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatient();
  }, []);

  const patient = id ? patients[id] : null;

  return (
    patient && (
      <div>
        <h2>
          {patient.name}
          <GenderIcon gender={patient.gender} />
        </h2>
        <div>SSN: {patient.ssn}</div>
        <div>Occupation: {patient.occupation}</div>
        <div>Gender: {patient.gender}</div>
        <div>Born: {patient.dateOfBirth}</div>

        <h3>Entries</h3>
        <Entries entries={patient.entries} diagnoses={diagnoses} />
      </div>
    )
  );
};

export default PatientInfoPage;
