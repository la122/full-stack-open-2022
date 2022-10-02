import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container } from "@material-ui/core";

import { apiBaseUrl } from "./constants";
import { setPatientlist, useStateValue } from "./state";
import { Diagnosis, Patient } from "./types";

import PatientListPage from "./PatientListPage";
import { Typography } from "@material-ui/core";
import PatientInfoPage from "./pages/PatientInfoPage";

const App = () => {
  const [, dispatch] = useStateValue();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  React.useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
        dispatch(setPatientlist(patientListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatientList();
  }, [dispatch]);

  React.useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const { data } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        setDiagnoses(data);
      } catch (e) {
        console.error(e);
      }
    };
    void fetchDiagnoses();
  }, []);

  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/" element={<PatientListPage />} />
            <Route
              path="/patients/:id"
              element={<PatientInfoPage diagnoses={diagnoses} />}
            />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
