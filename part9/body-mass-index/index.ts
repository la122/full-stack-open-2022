import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    return res.status(400).send({
      error: "malformatted parameters",
    });
  }

  const bmi = calculateBmi({ height, weight });

  return res.send({ weight, height, bmi });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).send({
      error: "parameters missing",
    });
  }

  const targetAmount = Number(target);

  if (isNaN(targetAmount)) {
    return res.status(400).send({
      error: "malformatted parameters",
    });
  }

  if (targetAmount <= 0) {
    return res.status(400).send({
      error: "target must be > 0",
    });
  }

  if (!Array.isArray(daily_exercises)) {
    return res.status(400).send({
      error: "malformatted parameters",
    });
  }

  const dailyExerciseHours = daily_exercises.map((hours) => Number(hours));

  for (const hours of dailyExerciseHours) {
    if (isNaN(hours)) {
      return res.status(400).send({
        error: "malformatted parameters",
      });
    }

    if (hours < 0) {
      return res.status(400).send({
        error: "hours must >= 0",
      });
    }
  }

  const result = calculateExercises({
    dailyExerciseHours,
    targetAmount,
  });

  return res.send(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
