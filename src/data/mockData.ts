// Simple seeded random number generator for deterministic mock data
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export interface SleepPosition {
  type: "back" | "left" | "right" | "stomach";
  startHour: number;
  startMinute: number;
  duration: number; // minutes
}

export interface NeckAlignmentPoint {
  hour: number;
  minute: number;
  alignment: number; // 0-100, 100 = perfect
}

export interface Fix {
  id: string;
  title: string;
  reason: string;
  icon: "pillow" | "stretch" | "posture" | "temp" | "movement";
  completed: boolean;
  reminderTime?: string;
}

export interface Night {
  date: string; // YYYY-MM-DD
  score: number; // 0-100
  sleepDuration: number; // hours
  positions: SleepPosition[];
  neckAlignment: NeckAlignmentPoint[];
  mainReason: string;
  riskLevel: "low" | "medium" | "high";
  positionChangeCount: number;
  morningPainRating?: number; // 0-10
  fixes: Fix[];
}

function generateNight(daysAgo: number, seed: number): Night {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const dateStr = date.toISOString().split("T")[0];

  // Score: generally 65-85, with variation
  const baseScore = 70 + (seededRandom(seed * 2) - 0.5) * 30;
  const score = Math.max(40, Math.min(95, Math.round(baseScore)));

  // Sleep duration: 6-8 hours
  const sleepDuration = 6 + seededRandom(seed * 3) * 2;

  // Positions: simulate the night
  const positions: SleepPosition[] = [];
  const positionTypes: Array<"back" | "left" | "right" | "stomach"> = [
    "back",
    "left",
    "right",
    "stomach",
  ];
  let currentHour = 22;
  let currentMinute = 0;
  let remainingMinutes = sleepDuration * 60;
  let posIndex = Math.floor(seededRandom(seed * 4) * 4);

  while (remainingMinutes > 0) {
    const duration = Math.max(
      30,
      Math.min(remainingMinutes, 45 + Math.floor(seededRandom(seed * posIndex) * 60))
    );
    positions.push({
      type: positionTypes[posIndex % 4],
      startHour: currentHour,
      startMinute: currentMinute,
      duration,
    });
    currentMinute += duration;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
    remainingMinutes -= duration;
    posIndex++;
  }

  // Neck alignment: varies throughout the night
  const neckAlignment: NeckAlignmentPoint[] = [];
  for (let h = 0; h < sleepDuration; h++) {
    for (let m = 0; m < 60; m += 15) {
      const alignment = Math.max(
        20,
        Math.min(100, 70 + seededRandom(seed * (h * 4 + m / 15)) * 40 - 20)
      );
      neckAlignment.push({
        hour: 22 + h,
        minute: m,
        alignment: Math.round(alignment),
      });
    }
  }

  // Last night (daysAgo = 0): specific data from requirements
  if (daysAgo === 0) {
    const mainReasons = [
      "Your head was turned right for about 3 hours",
      "Slept on your right side most of the night",
      "Only 6.5 hours of sleep",
    ];
    return {
      date: dateStr,
      score: 72,
      sleepDuration: 6.5,
      positions: positions.slice(0, 4),
      neckAlignment: neckAlignment.slice(0, 26),
      mainReason: mainReasons[0],
      riskLevel: "high",
      positionChangeCount: positions.length,
      morningPainRating: undefined,
      fixes: [
        {
          id: "fix-1",
          title: "Adjust your pillow height",
          reason: "Right-side sleeping needs better neck support",
          icon: "pillow",
          completed: false,
        },
        {
          id: "fix-2",
          title: "Morning neck stretch",
          reason: "Loosen the muscles after extended right-side time",
          icon: "stretch",
          completed: false,
        },
      ],
    };
  }

  const reasonIndex = Math.floor(seededRandom(seed * 10) * 10) % 5;
  const reasons = [
    "Slept on your right side most of the night",
    "Only 6.5 hours of sleep",
    "Frequent position changes",
    "Head turned for extended periods",
    "Lower neck alignment overall",
  ];

  const riskLevels: Array<"low" | "medium" | "high"> = ["low", "medium", "high"];
  const riskIndex = Math.floor(score / 33);
  const riskLevel = riskLevels[Math.min(2, riskIndex)];

  const positionChangeCount = positions.length;

  // Generate fixes based on score and reason
  const fixOptions: Fix[] = [
    {
      id: "fix-1",
      title: "Adjust your pillow height",
      reason: "Better neck support during sleep",
      icon: "pillow",
      completed: false,
    },
    {
      id: "fix-2",
      title: "Morning neck stretch",
      reason: "Loosen muscles after sleep",
      icon: "stretch",
      completed: false,
    },
    {
      id: "fix-3",
      title: "Try back-sleeping position",
      reason: "More neutral neck alignment",
      icon: "posture",
      completed: false,
    },
    {
      id: "fix-4",
      title: "Cool bedroom temp",
      reason: "Reduces restlessness",
      icon: "temp",
      completed: false,
    },
  ];

  const fixes = [
    fixOptions[Math.floor(seededRandom(seed * 11) * fixOptions.length)],
    fixOptions[Math.floor(seededRandom(seed * 12) * fixOptions.length)],
  ];

  return {
    date: dateStr,
    score,
    sleepDuration,
    positions,
    neckAlignment,
    mainReason: reasons[reasonIndex],
    riskLevel,
    positionChangeCount,
    morningPainRating: undefined,
    fixes: fixes.slice(0, 2),
  };
}

export function generateMockData(): Night[] {
  const nights: Night[] = [];
  for (let i = 29; i >= 0; i--) {
    nights.push(generateNight(i, 1000 + i));
  }
  return nights;
}
