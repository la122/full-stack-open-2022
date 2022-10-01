interface ExercisesArgs {
  targetAmount: number;
  dailyExerciseHours: number[];
}

interface ExercisesResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = ({
  targetAmount,
  dailyExerciseHours,
}: ExercisesArgs): ExercisesResult => {
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

const parseArguments = (args: Array<string>): ExercisesArgs => {
  if (args.length < 4) {
    throw new Error("Not enough arguments");
  }

  const targetAmount = Number(args[2]);

  if (isNaN(targetAmount) || targetAmount <= 0) {
    throw new Error("Target amount must be a positive number!");
  }

  const dailyExerciseHours = args.slice(3).map((str) => {
    const num = Number(str);
    if (isNaN(num) || num < 0) {
      throw new Error("Daily exercise hours must postive numbers or 0!");
    }
    return num;
  });

  return { targetAmount, dailyExerciseHours };
};

if (process.argv.length > 2) {
  try {
    console.log(calculateExercises(parseArguments(process.argv)));
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
