import { Colors } from "../constants/colors";

export const calculateHealthData = (user) => {
  const { weight, height, age, gender } = user;
  if (!weight || !height || !age) return { bmi: "0.0", status: "N/A", tdee: 0, bmr: 0 };
  
  const bmi = weight / ((height / 100) ** 2);
  let bmiStatus = { status: "ปกติ", color: Colors.success };
  if (bmi < 18.5) bmiStatus = { status: "ผอม", color: Colors.warning };
  else if (bmi >= 23.0 && bmi < 25.0) bmiStatus = { status: "ท้วม", color: Colors.warning };
  else if (bmi >= 25.0 && bmi < 30.0) bmiStatus = { status: "อ้วน", color: Colors.danger };
  else if (bmi >= 30.0) bmiStatus = { status: "อ้วนมาก", color: Colors.danger };
  
  let bmr = (gender === "Male") 
    ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  const roundedBmr = Math.round(bmr);
    
  return { bmi: bmi.toFixed(1), ...bmiStatus, bmr: roundedBmr, tdee: Math.round(bmr * 1.2) };
};

export const calculateMacros = (tdee) => ({
  protein: Number(((tdee * 0.30) / 4).toFixed(0)),
  carbs: Number(((tdee * 0.40) / 4).toFixed(0)),
  fat: Number(((tdee * 0.30) / 9).toFixed(0))
});

