interface ExercisesResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (
  dailyExerciseHours: number[],
  targetAmount: number
): ExercisesResult => {
  const periodLength = dailyExerciseHours.length;
  const trainingDays = dailyExerciseHours.filter((hours) => hours > 0).length;
  const hoursTotal = dailyExerciseHours.reduce((acc, it) => acc + it, 0);

  const daysPassed = dailyExerciseHours.reduce(
    (acc, it) => (it >= targetAmount ? acc + 1 : acc),
    0
  );

  const ratio = daysPassed / periodLength;

  let rating: number;
  let ratingDescription: string;

  switch (true) {
    case ratio < 0.3: {
      rating = 1;
      ratingDescription = "not good :(";
      break;
    }
    case ratio < 0.9: {
      rating = 2;
      ratingDescription = "not too bad but could be better";
      break;
    }
    default: {
      rating = 3;
      ratingDescription = "nice, keep it up!";
    }
  }

  return {
    periodLength,
    trainingDays,
    success: daysPassed === periodLength,
    rating,
    ratingDescription,
    target: targetAmount,
    average: hoursTotal / periodLength,
  };
};

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
