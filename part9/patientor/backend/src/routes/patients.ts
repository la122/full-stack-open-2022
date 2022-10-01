import express from "express";
import patentService from "../services/patientService";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patentService.getNonSensitiveEntries());
});

router.post("/", (_req, res) => {
  res.send("Saving a patient!");
});

export default router;
