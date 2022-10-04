import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { addPatient, useStateValue } from "../state";
import { Entry, Gender, Patient } from "../types";
import TransgenderIcon from "@mui/icons-material/Transgender";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import EntryDetails from "../components/EntryDetails";
import { Box } from "@material-ui/core";
import AddEntryForm from "../components/AddEntryForm";

const GenderIcon = ({ gender }: { gender: Gender }) => {
  if (gender == Gender.Female) {
    return <FemaleIcon />;
  }
  if (gender == Gender.Male) {
    return <MaleIcon />;
  }
  return <TransgenderIcon />;
};

const Entries = ({ entries }: { entries: Entry[] }) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Box
      sx={{
        display: "grid",
        gridGap: 3,
      }}
    >
      <AddEntryForm />

      {entries.map((entry) => (
        <Box
          key={entry.id}
          border="2px solid grey"
          borderRadius="borderRadius"
          sx={{ p: 2 }}
        >
          <EntryDetails entry={entry} />
          <ul>
            {entry.diagnosisCodes?.map((code) => (
              <li key={code}>
                {code} - <i>{diagnoses[code].name}</i>
              </li>
            ))}
          </ul>
          <div>diagnose by {entry.specialist}</div>
        </Box>
      ))}
    </Box>
  );
};

const PatientInfoPage = () => {
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
        <Entries entries={patient.entries} />
      </div>
    )
  );
};

export default PatientInfoPage;
