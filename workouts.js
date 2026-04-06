const weeks = [
  {
    days: [
      { day: 1, title: "Cardio & Core", exercises: ["Treadmill Run or Incline Walk - 20 minutes", "Single Kettlebell Swing - 5x10 ", "Ab Curls - 3x20", "Leg Raises - 3x20", "Plank - 2 min 30 sec hold", "Optional: Bike - 15 minutes"] },
      { day: 2, title: "Back & Triceps", exercises: ["Wide-Grip Lat Pulldowns - 3x30", "Reverse Fly Machine - 3x30", "Seated Rows w/ Straight Bar 3x30-20-10 (Raise weight each set)", "Underhand Lat Pulldown - 2x20, 2x15, 1x10", "Tricep Rope Pulldown - 4x20", "V-Bar Pulldowns - 3x30"] },
      { day: 3, title: "Legs", exercises: ["Kettlebell Squats - 5 x 20", "Kettlebell Lunges - 3x20", "Kettlebell Deadlifts - 3x20", "Leg Extension - 4x25", "Leg Curls - 4x25"] },
      { day: 4, title: "Chest & Biceps", exercises: ["Machine Fly - 3x30", "Dumbbell Bench Press - 3x20", "Incline Cable Flys or Dumbbell Flys - 3x30", "Dumbbell Curls 1x20, 1x18, 1x16, 1x12, 1x10", "Rope Curls 3x30"] },
      { day: 5, title: "Cardio & Core", exercises: ["Treadmill Run or Incline Walk - 15 minutes", "Romanian Twist - 4x30 each side", "Leg Raises - 4x20", "Ab Curls - 5x30", "Oblique Twist - 5x12", "Optional: Bike - 20 Minutes"] },
      { day: 6, title: "Rest", exercises: [] },
      { day: 7, title: "Rest", exercises: [] },
    ]
  },
  {
    days: [
      { day: 8, title: "Cardio & Core", exercises: ["Treadmill Run or Incline Walk - 20 minutes", "Single Kettlebell Swing - 5x10 ", "Ab Curls - 3x20", "Leg Raises - 3x20", "Plank - 2 min 30 sec hold", "Optional: Bike - 15 minutes"] },
      { day: 9, title: "Shoulders", exercises: ["Pullups", "Hammer Curls", "Rows"] },
      { day: 10, title: "Arms", exercises: ["Squats", "Lunges", "Calf Raises"] },
      { day: 11, title: "Legs", exercises: ["Shoulder Press", "Plank", "Russian Twists"] },
      { day: 12, title: "Cardio & Core", exercises: ["Treadmill Run or Incline Walk - 15 minutes", "Romanian Twist - 4x30 each side", "Leg Raises - 4x20", "Ab Curls - 5x30", "Oblique Twist - 5x12", "Optional: Bike - 20 Minutes"] },
      { day: 13, title: "Rest", exercises: [] },
      { day: 14, title: "Rest", exercises: [] },
    ]
  },
  {
    days: [
      { day: 15, title: "Cardio & Core", exercises: ["Treadmill Run or Incline Walk - 20 minutes", "Single Kettlebell Swing - 5x10 ", "Ab Curls - 3x20", "Leg Raises - 3x20", "Plank - 2 min 30 sec hold", "Optional: Bike - 15 minutes"] },
      { day: 16, title: "Back & Abs", exercises: ["Pullups", "Rows", "Curls"] },
      { day: 17, title: "Shoulders", exercises: ["Lunges", "Squats", "Leg Press"] },
      { day: 18, title: "Legs", exercises: ["Shoulder Press", "Plank", "Situps"] },
      { day: 19, title: "Cardio & Core", exercises: ["Treadmill Run or Incline Walk - 15 minutes", "Romanian Twist - 4x30 each side", "Leg Raises - 4x20", "Ab Curls - 5x30", "Oblique Twist - 5x12", "Optional: Bike - 20 Minutes"] },
      { day: 20, title: "Rest", exercises: [] },
      { day: 21, title: "Rest", exercises: [] },
    ]
  },
  {
    days: [
      { day: 22, title: "Cardio & Core", exercises: ["Treadmill Run or Incline Walk - 20 minutes", "Single Kettlebell Swing - 5x10 ", "Ab Curls - 3x20", "Leg Raises - 3x20", "Plank - 2 min 30 sec hold", "Optional: Bike - 15 minutes"] },
      { day: 23, title: "Chest & Triceps", exercises: ["Pullups", "Hammer Curls", "Rows"] },
      { day: 24, title: "Back & Biceps", exercises: ["Squats", "Lunges", "Calf Raises"] },
      { day: 25, title: "Shoulders", exercises: ["Shoulder Press", "Plank", "Russian Twists"] },
      { day: 26, title: "Cardio & Core", exercises: ["Treadmill Run or Incline Walk - 15 minutes", "Romanian Twist - 4x30 each side", "Leg Raises - 4x20", "Ab Curls - 5x30", "Oblique Twist - 5x12", "Optional: Bike - 20 Minutes"] },
      { day: 27, title: "Rest", exercises: [] },
      { day: 28, title: "Rest", exercises: [] },
    ]
  },
  {
    days: [
      { day: 29, title: "Cardio & Core", exercises: ["Treadmill Run or Incline Walk - 20 minutes", "Single Kettlebell Swing - 5x10 ", "Ab Curls - 3x20", "Leg Raises - 3x20", "Plank - 2 min 30 sec hold", "Optional: Bike - 15 minutes"] },
      { day: 30, title: "Back", exercises: ["Reverse DB Flys - 3x30", "Seated Rows - 1x30, 1x20, 1x 15, 1x10, 1x5", "Deadlifts - 1x12, 1x10, 1x8, 1x5, 1x3", "Close Grip Lat Pulldowns - 1x30, 1x20, 1x 15, 1x10, 1x5", "Standing Kettlebell Rows - 4x16"] },
      { day: 31, title: "Shoulders", exercises: ["Arnold Press - 5x12 + Seated Front Raises - 5x10", "Straight Bar Cable Overhead Raises - 1x20, 1x15, 1x12, 1x10, 1x5", "Machine Reverse Flys - 4x25", "Chin Raises - 3x30", "Straight Bar Rows - 1x20, 1x15, 1x10, 1x5"] },
      { day: 32, title: "Legs", exercises: ["Kettlebell Squats - 10x10", "Leg Press - 5x30", "Kettlebell Walking Lunges - 5x15 each leg", "Reverse Hack Squat - 5x10", "Kettlebell Straight-Leg Deadlift - 5x10"] },
      { day: 33, title: "Cardio & Core", exercises: ["Treadmill Run or Incline Walk - 15 minutes", "Romanian Twist - 4x30 each side", "Leg Raises - 4x20", "Ab Curls - 5x30", "Oblique Twist - 5x12", "Optional: Bike - 20 Minutes"] },
      { day: 34, title: "Rest", exercises: [] },
      { day: 35, title: "Rest", exercises: [] },
    ]
  },
  {
    days: [
      {day: 36, title: "Cardio & Core", exercises: ["Treadmill Run or Incline Walk - 20 minutes", "Single Kettlebell Swing - 5x10 ", "Ab Curls - 3x20", "Leg Raises - 3x20", "Plank - 2 min 30 sec hold", "Optional: Bike - 15 minutes"] },
      {day: 37, title: "Chest", exercises:["Incline Bench Press - 2x20, 2x10, 2x5", "Incline Chest Flys - 6x25", "Bench Press - 2x20, 2x10, 2x5", "Bench Chest Flys - 6x25", "Decline Bench Press - 4x15", "Decline Chest Flys - 6x25"]},
      {day: 38, title: "Back & Biceps", exercises:["Underhand Lat Pulldown - 4x20", "Bent-Over Rows - 3x20", "Straight Arm Lat Pulldowns - 4x20", "Reverse Machine Fly - 3x30", "Bicep Curls w/ rope - 4x25", "Straight Bar Curls - 4x25"]},
      {day: 39, title: "Shoulders & Triceps", exercises:["KB or DB Shoulder Press - 5x10", "Single Arm Lateral Raises - 5x10", "KB Lawn Mowers - 5x10", "DB Side Raises - 5x10", "Incline Bench Press - 5x12", "Rope Pulldowns - 4x25", "V-Bar Pulldowns - 4x25"]},
      {day: 40, title: "Cardio & Core", exercises: ["Treadmill Run or Incline Walk - 15 minutes", "Romanian Twist - 4x30 each side", "Leg Raises - 4x20", "Ab Curls - 5x30", "Oblique Twist - 5x12", "Optional: Bike - 20 Minutes"] },
      {day: 41, title: "Rest", exercises: [] },
      {day: 42, title: "Rest", exercises: [] },
    ]
  }
];

// Flatten weeks into a single array for navigation
const workouts = weeks.flatMap(week => week.days);