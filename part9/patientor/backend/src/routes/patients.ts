import express from "express";
import patientService from "../services/patientService";
import patentService from "../services/patientService";
import { NewPatient } from "../types";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patentService.getNonSensitiveEntries());
});

router.post("/", (req, res) => {
  const newPatient = patientService.addPatient(req.body as NewPatient);
  res.json(newPatient);
});

export default router;
