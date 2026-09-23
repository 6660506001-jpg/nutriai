import { getTodayKey } from "./dailyArchive";

export const ACTIVITY_INTENSITY_OPTIONS = [
  {
    id: "light",
    label: "เบา",
    hint: "พูดได้สบาย ไม่หอบ",
    multiplier: 0.8,
  },
  {
    id: "moderate",
    label: "เหนื่อยปานกลาง",
    hint: "พอพูดเป็นประโยคได้",
    multiplier: 1,
  },
  {
    id: "vigorous",
    label: "เหนื่อยมาก",
    hint: "หอบ พูดไม่เป็นประโยค",
    multiplier: 1.35,
  },
];

const BASE_DURATION_MINUTES = 30;
export const MAX_ACTIVITY_DURATION_MINUTES = 600;

export function splitDurationParts(totalMinutes) {
  const total = Math.max(0, Math.round(Number(totalMinutes) || 0));
  return {
    hours: Math.floor(total / 60),
    minutes: total % 60,
  };
}

export function combineDurationMinutes(hours, minutes) {
  const h = Math.max(0, Number(hours) || 0);
  const m = Math.max(0, Number(minutes) || 0);
  return Math.round(h * 60 + m);
}

export function formatActivityDuration(totalMinutes) {
  const { hours, minutes } = splitDurationParts(totalMinutes);
  if (hours > 0 && minutes > 0) return `${hours} ชม. ${minutes} น.`;
  if (hours > 0) return `${hours} ชม.`;
  return `${minutes} น.`;
}

export const getIntensityOption = (intensityId) =>
  ACTIVITY_INTENSITY_OPTIONS.find((option) => option.id === intensityId)
  || ACTIVITY_INTENSITY_OPTIONS[1];

/** DB calories = ประมาณการต่อ 30 นาที ระดับปานกลาง */
export const calculateActivityCalories = ({
  activity,
  durationMinutes,
  intensity = "moderate",
  userWeight,
}) => {
  const minutes = Math.max(1, Number(durationMinutes) || 0);
  const intensityOption = getIntensityOption(intensity);
  const basePer30 = Number(activity?.calories) || 150;

  let calories = basePer30 * (minutes / BASE_DURATION_MINUTES) * intensityOption.multiplier;

  if (userWeight && Number(userWeight) > 0) {
    const weightFactor = Number(userWeight) / 70;
    calories *= weightFactor;
  }

  return Math.max(1, Math.round(calories));
};

export const buildActivityLogEntry = ({
  activity,
  durationMinutes,
  intensity,
  userWeight,
}) => {
  const intensityOption = getIntensityOption(intensity);
  const calories = calculateActivityCalories({
    activity,
    durationMinutes,
    intensity,
    userWeight,
  });

  return {
    ...activity,
    name: activity.name,
    calories,
    durationMinutes: Number(durationMinutes),
    intensity: intensityOption.id,
    intensityLabel: intensityOption.label,
    loggedDate: getTodayKey(),
    loggedAt: new Date().toISOString(),
    logLabel: `${activity.name} · ${formatActivityDuration(durationMinutes)} · ${intensityOption.label}`,
  };
};
