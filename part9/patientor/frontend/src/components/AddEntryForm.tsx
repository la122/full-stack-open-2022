import { Button, Grid } from "@material-ui/core";
import { Box } from "@mui/material";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { addEntry, useStateValue } from "../state";
import { Entry, EntryType, HealthCheckRating } from "../types";
import {
  DiagnosisSelection,
  SelectOption,
  SelectField,
  TextField,
} from "./FormField";

const entryTypeOptions: SelectOption[] = [
  { value: EntryType.HealthCheck, label: "Health Check" },
  { value: EntryType.Hospital, label: "Hospital" },
  { value: EntryType.OccupationalHealthcare, label: "Occupational Healthcare" },
];

const healthRatingOption: SelectOption[] = [
  { value: HealthCheckRating.Healthy, label: 0 },
  { value: HealthCheckRating.LowRisk, label: 1 },
  { value: HealthCheckRating.HighRisk, label: 2 },
  { value: HealthCheckRating.CriticalRisk, label: 3 },
];

const today = new Date().toISOString().slice(0, 10);

const AddEntryForm = () => {
  const [{ diagnoses }, dispatch] = useStateValue();
  const { id: patientId } = useParams<{ id: string }>();
  const [adding, setAdding] = useState<boolean>(false);

  const onSubmit = async (values: Omit<Entry, "id">) => {
    try {
      if (patientId == undefined) {
        throw new Error("patient id undefined");
      }
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${patientId}/entries`,
        values
      );

      dispatch(addEntry(patientId, newEntry));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
      }
    }
  };

  const onCancel = () => {
    setAdding(false);
  };

  if (!adding) {
    return (
      <div>
        <Button variant="contained" onClick={() => setAdding(true)}>
          Add New Entry
        </Button>
      </div>
    );
  }

  return (
    <Box border="2px dashed grey" borderRadius="borderRadius" sx={{ p: 2 }}>
      <Formik
        initialValues={{
          type: EntryType.HealthCheck,
          description: "",
          date: today,
          diagnosisCodes: [],
          healthCheckRating: HealthCheckRating.LowRisk,
          specialist: "",
        }}
        onSubmit={onSubmit}
        validate={(values) => {
          const requiredError = "Field is required";
          const errors: { [field: string]: string } = {};
          if (!values.description) {
            errors.description = requiredError;
          }
          if (!values.date) {
            errors.date = requiredError;
          }
          if (!values.specialist) {
            errors.specialist = requiredError;
          }
          return errors;
        }}
      >
        {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
          return (
            <Form className="form ui">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <SelectField
                    label="Entry Type"
                    name="type"
                    options={entryTypeOptions}
                  />
                </Grid>

                <Grid item xs={6} zeroMinWidth>
                  <SelectField
                    label="Healthcheck Rating"
                    name="healthCheckRating"
                    options={healthRatingOption}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    fullWidth
                    label="Description"
                    placeholder="description..."
                    name="description"
                    component={TextField}
                  />
                </Grid>

                <Grid item xs={12}>
                  <DiagnosisSelection
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    diagnoses={Object.values(diagnoses)}
                  />
                </Grid>

                <Grid item xs={3}>
                  <Field
                    label="Date"
                    placeholder="YYYY-MM-DD"
                    name="date"
                    component={TextField}
                  />
                </Grid>

                <Grid item xs={9}>
                  <Field
                    label="Specialist"
                    placeholder="diagnose by ..."
                    name="specialist"
                    component={TextField}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Button
                    color="secondary"
                    variant="contained"
                    style={{ float: "left" }}
                    type="button"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Button
                    style={{
                      float: "right",
                    }}
                    type="submit"
                    variant="contained"
                    disabled={!dirty || !isValid}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default AddEntryForm;
