import express from "express";
import patientService from "../services/patientService";
import patentService from "../services/patientService";
import { NewEntry } from "../types";
import { isNewEntry, toNewPatient } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patentService.getNonSensitiveEntries());
});

router.get("/:id", (req, res) => {
  const patient = patentService.getPatient(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.status(404).send("Patient not found.");
  }
});

router.post("/", (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post("/:id/entries", (req, res) => {
  const patient = patentService.getPatient(req.params.id);

  if (!patient) {
    return res.status(404).send("Patient not found.");
  }

  const entry = req.body as NewEntry;

  if (!isNewEntry(entry)) {
    return res.status(400).send("Incorrect or missing attribute.");
  }

  try {
    const addedEntry = patientService.addEntry(patient, entry);
    return res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    return res.status(400).send(errorMessage);
  }
});

export default router;
