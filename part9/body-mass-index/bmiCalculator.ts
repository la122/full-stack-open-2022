const calculateBmi = (height: number, weight: number) => {
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

console.log(calculateBmi(180, 74));
