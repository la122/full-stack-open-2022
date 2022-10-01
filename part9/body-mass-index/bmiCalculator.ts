interface BmiArgs {
  height: number;
  weight: number;
}

export const calculateBmi = ({ height, weight }: BmiArgs) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  switch (true) {
    case bmi < 18.5:
      return "Underweight";

    case bmi >= 18.5 && bmi < 25:
      return "Normal (healthy weight)";

    case bmi >= 25.0:
      return "Overweight";

    default:
      throw "Something went wrong";
  }
};

const parseArguments = (args: Array<string>): BmiArgs => {
  if (args.length < 4) {
    throw new Error("Not enough arguments");
  }

  if (args.length > 4) {
    throw new Error("Too many arguments");
  }

  const height = Number(args[2]);
  const weight = Number(args[3]);

  if (isNaN(height) || isNaN(weight)) {
    throw new Error("Provided values were not numbers!");
  }

  if (height <= 0 || weight <= 0) {
    throw new Error("Provided values must be positive!");
  }

  return { height, weight };
};

if (process.argv.length > 2) {
  try {
    console.log(calculateBmi(parseArguments(process.argv)));
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
