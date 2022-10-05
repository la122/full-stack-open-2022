import { Button, Grid } from "@material-ui/core";
import { Box } from "@mui/material";
import axios from "axios";
import { Field, Form, Formik, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { addEntry, useStateValue } from "../state";
import {
  Entry,
  EntryType,
  HealthCheckRating,
  NewEntry,
  NewHealthCheckEntry,
  NewHospitalEntry,
  NewOccupationalHealthcareEntry,
  SickLeave,
} from "../types";
import {
  DiagnosisSelection,
  SelectOption,
  SelectField,
  TextField,
} from "./FormField";
import { isDate } from "../utils";

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

const Submitter = () => {
  const { values, isSubmitting } = useFormikContext<NewEntry>();
  const { id: patientId } = useParams<{ id: string }>();
  const [, dispatch] = useStateValue();

  const handleSubmit = async () => {
    try {
      if (patientId == undefined) {
        throw new Error("patient id undefined");
      }

      const entry = (({
        type,
        description,
        date,
        specialist,
        diagnosisCodes,
      }) => ({
        type,
        description,
        date,
        specialist,
        diagnosisCodes,
      }))(values);

      if (values.type === "HealthCheck") {
        (entry as NewHealthCheckEntry).healthCheckRating =
          values.healthCheckRating;
      } else if (values.type === "Hospital") {
        (entry as NewHospitalEntry).discharge = values.discharge;
      } else if (values.type === "OccupationalHealthcare") {
        (entry as NewOccupationalHealthcareEntry).employerName =
          values.employerName;
        if (values.sickLeave?.startDate && values.sickLeave.endDate) {
          (entry as NewOccupationalHealthcareEntry).sickLeave =
            values.sickLeave;
        }
      }

      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${patientId}/entries`,
        entry
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

  useEffect(() => {
    if (isSubmitting) {
      void handleSubmit();
    }
  }, [isSubmitting]);

  return null;
};

const AddEntryForm = () => {
  const [{ diagnoses }] = useStateValue();
  const [adding, setAdding] = useState<boolean>(false);
  const today = new Date().toISOString().slice(0, 10);

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

  const initialValues = {
    type: EntryType.HealthCheck,
    description: "",
    date: today,
    diagnosisCodes: [],
    healthCheckRating: HealthCheckRating.LowRisk,
    specialist: "",
    discharge: { date: today, criteria: "" },
    employerName: "",
    sickLeave: { startDate: "", endDate: "" },
  };

  const validateSickLeave = ({ startDate, endDate }: SickLeave) => {
    if (startDate === "" && endDate === "") {
      return;
    }
    if (isDate(startDate) && isDate(endDate)) {
      return;
    }
    return "Both must be either YYYY-MM-DD or empty.";
  };

  return (
    <Box border="2px dashed grey" borderRadius="borderRadius" sx={{ p: 2 }}>
      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          setAdding(false);
        }}
        validate={(values) => {
          const requiredError = "Field is required";
          const errors: { [field: string]: string } = {};
          if (!values.description) {
            errors.description = requiredError;
          }
          if (!values.date) {
            errors.date = requiredError;
          }
          if (!isDate(values.date)) {
            errors.date = "Must have form YYYY-MM-DD.";
          }
          if (!values.specialist) {
            errors.specialist = requiredError;
          }
          if (
            values.type === EntryType.Hospital &&
            (!values.discharge.date || !values.discharge.criteria)
          ) {
            errors.discharge = requiredError;
          }
          if (values.type === EntryType.OccupationalHealthcare) {
            if (!values.employerName) {
              errors.employerName = requiredError;
            }
          }
          return errors;
        }}
      >
        {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
          return (
            <Form className="form ui">
              <Submitter />

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <SelectField
                    label="Entry Type"
                    name="type"
                    options={entryTypeOptions}
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

                <Grid item xs={5}>
                  <Field
                    label="Specialist*"
                    placeholder="diagnose by ..."
                    name="specialist"
                    component={TextField}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    fullWidth
                    label="Description*"
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

                {values.type === EntryType.Hospital && (
                  <>
                    <Grid item xs={9} zeroMinWidth>
                      <Field
                        label="Discharge criteria*"
                        name="discharge.criteria"
                        component={TextField}
                      />
                    </Grid>

                    <Grid item xs={3} zeroMinWidth>
                      <Field
                        label="Discharge date*"
                        name="discharge.date"
                        placeholder="YYYY-MM-DD"
                        component={TextField}
                      />
                    </Grid>
                  </>
                )}

                {values.type === EntryType.HealthCheck && (
                  <Grid item xs={7} zeroMinWidth>
                    <SelectField
                      label="Healthcheck Rating*"
                      name="healthCheckRating"
                      options={healthRatingOption}
                    />
                  </Grid>
                )}

                {values.type === EntryType.OccupationalHealthcare && (
                  <>
                    <Grid item xs={3} zeroMinWidth>
                      <Field
                        label="Sick Leave Start"
                        name="sickLeave.startDate"
                        placeholder="YYYY-MM-DD"
                        component={TextField}
                        validate={() => validateSickLeave(values.sickLeave)}
                      />
                    </Grid>

                    <Grid item xs={3} zeroMinWidth>
                      <Field
                        label="Sick Leave End"
                        name="sickLeave.endDate"
                        placeholder="YYYY-MM-DD"
                        component={TextField}
                        validate={() => validateSickLeave(values.sickLeave)}
                      />
                    </Grid>

                    <Grid item xs={6} zeroMinWidth>
                      <Field
                        label="Employer*"
                        name="employerName"
                        component={TextField}
                      />
                    </Grid>
                  </>
                )}

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
