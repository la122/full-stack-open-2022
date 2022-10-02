import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Gender, Patient } from "../types";
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
        console.log("fetchted", data);
        dispatch({ type: "ADD_PATIENT", payload: data });
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
      </div>
    )
  );
};

export default PatientInfoPage;
