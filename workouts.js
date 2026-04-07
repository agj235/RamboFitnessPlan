const weeks = [
  {
    days: [
      { day: 1, title: "Cardio & Core Day", exercises: ["Treadmill Run or Incline Walk - 20 minutes", "Single Kettlebell Swing - 5x10 ", "Ab Curls - 3x20", "Leg Raises - 3x20", "Plank - 2 min 30 sec hold", "Optional: Bike - 15 minutes"] },
      { day: 2, title: "Back & Tricep Day", exercises: ["Wide-Grip Lat Pulldowns - 3x30", "Reverse Fly Machine - 3x30", "Seated Rows w/ Straight Bar 3x30-20-10 (Raise weight each set)", "Underhand Lat Pulldown - 2x20, 2x15, 1x10", "Tricep Rope Pulldown - 4x20", "V-Bar Pulldowns - 3x30"] },
      { day: 3, title: "Leg Day", exercises: ["Kettlebell Squats - 5 x 20", "Kettlebell Lunges - 3x20", "Kettlebell Deadlifts - 3x20", "Leg Extension - 4x25", "Leg Curls - 4x25"] },
      { day: 4, title: "Chest & Bicep Day", exercises: ["Machine Fly - 3x30", "Dumbbell Bench Press - 3x20", "Incline Cable Flys or Dumbbell Flys - 3x30", "Dumbbell Curls 1x20, 1x18, 1x16, 1x12, 1x10", "Rope Curls 3x30"] },
      { day: 5, title: "Cardio & Core Day", exercises: ["Treadmill Run or Incline Walk - 15 minutes", "Romanian Twist - 4x30 each side", "Leg Raises - 4x20", "Ab Curls - 5x30", "Oblique Twist - 5x12", "Optional: Bike - 20 Minutes"] },
      { day: 6, title: "Rest Day", exercises: [] },
      { day: 7, title: "Rest Day", exercises: [] },
    ]
  },
  {
    days: [
      { day: 8, title: "Cardio & Core Day", exercises: ["Treadmill Run or Incline Walk - 20 minutes", "Single Kettlebell Swing - 5x10 ", "Ab Curls - 3x20", "Leg Raises - 3x20", "Plank - 2 min 30 sec hold", "Optional: Bike - 15 minutes"] },
      { day: 9, title: "Shoulders & Abs Day", exercises: ["Front Shoulder Raises - 4x15", "Kettlebell Lawn Mowers - 3x15 each arm", "Shoulder Side Raises - 4x12", "Shoulder Press - 2x20, 2x15, 1x10", "Planks - 2 min 30 sec hold", "Romanian Twist - 2x30 each side", "Ab curls - 3x30"] },
      { day: 10, title: "Arm Day", exercises: ["Superset Bicep Curls + Tricep Pulldown with rope - 5x20", "Seated Dumbbell Curls - 3x15", "Overhead Ticep Extension - 3x15", "Preacher Curls - 3x20", "Dumbbell Kickbacks 3x15"] },
      { day: 11, title: "Leg Day", exercises: ["Kettlebell Deadlifts - 5x10", "Reverse Hack Squats - 3x20, 3x10", "Deep Squats - 5x10", "Straight Leg Deadlifts - 3x30", "Leg Curls - 3x30, 2x10 (Heavy), 1x30"] },
      { day: 12, title: "Cardio & Core Day", exercises: ["Treadmill Run or Incline Walk - 15 minutes", "Romanian Twist - 4x30 each side", "Leg Raises - 4x20", "Ab Curls - 5x30", "Oblique Twist - 5x12", "Optional: Bike - 20 Minutes"] },
      { day: 13, title: "Rest Day", exercises: [] },
      { day: 14, title: "Rest Day", exercises: [] },
    ]
  },
  {
    days: [
      { day: 15, title: "Cardio & Core Day", exercises: ["Treadmill Run or Incline Walk - 20 minutes", "Single Kettlebell Swing - 5x10 ", "Ab Curls - 3x20", "Leg Raises - 3x20", "Plank - 2 min 30 sec hold", "Optional: Bike - 15 minutes"] },
      { day: 16, title: "Back & Ab Day", exercises: ["Bent Over Rows - 3x15, 2x20", "Closed Grip Pulldowns - 3x30", "Shoulder Shrugs - 5x20", "Wide Grip Lat Pulldowns - 3x30", "Decline Ab Curls 3x20", "Side Planks - 3x30 seconds each side", "Oblique Twist - 5x15 each side"] },
      { day: 17, title: "Shoulder Day", exercises: ["Incline Dumbbell Bench Press - 3x15, 2x10", "Bent-over Reverse Flys - 5x15", "Underhand Seated Rows - 2x20, 2x15, 1x10", "Superset Front Shoulder Raise + Side Shoulder Raise - 5x12"] },
      { day: 18, title: "Leg Day", exercises: ["Leg Extension - 5x20", "Leg Curls - 5x20", "Walking Lunges - 3x8 each leg, 3x5 each leg", "Leg Press - 2x30, 2x20, 2x10", "Calf Raises - 5x20", "Reverse Hack Squat - 5x15"] },
      { day: 19, title: "Cardio & Core Day", exercises: ["Treadmill Run or Incline Walk - 15 minutes", "Romanian Twist - 4x30 each side", "Leg Raises - 4x20", "Ab Curls - 5x30", "Oblique Twist - 5x12", "Optional: Bike - 20 Minutes"] },
      { day: 20, title: "Rest Day", exercises: [] },
      { day: 21, title: "Rest Day", exercises: [] },
    ]
  },
  {
    days: [
      { day: 22, title: "Cardio & Core Day", exercises: ["Treadmill Run or Incline Walk - 20 minutes", "Single Kettlebell Swing - 5x10 ", "Ab Curls - 3x20", "Leg Raises - 3x20", "Plank - 2 min 30 sec hold", "Optional: Bike - 15 minutes"] },
      { day: 23, title: "Chest & Tricep Day", exercises: ["Seated Cable Fly - 5x30", "Superset Dumbbell Bench Press - 2x20, 2x10 + Dumbbell Fly - 4x20", "Machine Fly - 5x20", "Overhead Tricep Extension w/ Rope - 3x30", "Dumbbell Kickbacks - 3x15", "Tricep Extension w/ Rope 3xToFailure"] },
      { day: 24, title: "Back & Bicep Day", exercises: ["Standing Rows - 2x30, 2x20, 2x10", "Single Arm Seated Rows - 3x15", "Superset Wide Grip Lat Pulldown - 4x10 + Underhand Lat Pulldown - 4x10", "Bicep Curls w/ Rope 3x20", "Dumbbell Curls - 5x10"] },
      { day: 25, title: "Shoulder Day", exercises: ["Straight Bar Front Raises + Dumbbell Side Shoulder Raises - 1x20, 1x15, 1x12, 1x8", "Dumbbell Shoulder Prewss + Dumbbell Reverse Fly - 4x20", "Bent-over Rows - 1x20, 1x15, 1x12, 1x8", "Dumbbell Front Shoulder Raise - 4x20"] },
      { day: 26, title: "Cardio & Core Day", exercises: ["Treadmill Run or Incline Walk - 15 minutes", "Romanian Twist - 4x30 each side", "Leg Raises - 4x20", "Ab Curls - 5x30", "Oblique Twist - 5x12", "Optional: Bike - 20 Minutes"] },
      { day: 27, title: "Rest Day", exercises: [] },
      { day: 28, title: "Rest Day", exercises: [] },
    ]
  },
  {
    days: [
      { day: 29, title: "Cardio & Core Day", exercises: ["Treadmill Run or Incline Walk - 20 minutes", "Single Kettlebell Swing - 5x10 ", "Ab Curls - 3x20", "Leg Raises - 3x20", "Plank - 2 min 30 sec hold", "Optional: Bike - 15 minutes"] },
      { day: 30, title: "Legs & Ab Day", exercises: ["Front Squats - 2x12, 2x10, 1x8", "Hack Squats - 5x8", "Single-leg Leg Press - 2x30, 2x20, 1x10", "Leg Extension - 3x30", "Leg Curls - 3x30", "Ab Curls - 3x30", "Planks - 2 min 30 sec hold", "Seated Ab Curl Machine - 4x20"] },
      { day: 31, title: "Chest Day", exercises: ["Bench Press - 4x12", "Machine Flys - 5x20", "Decline Bench Press - 4x10", "Incline Dumbbell Flys - 4x25", "Cable Fly (upper, mid, lower chest) - 1x30 each chest area"] },
      { day: 32, title: "Arm Day", exercises: ["Single-arm Cable Curls - 4x20", "Tricep Pulldowns w/ Rope - 4x20", "Dumbbell Curls - 1x40, 1x30, 1x24, 1x20", "Overhead Tricep Extension - 2x20, 2x10", "Preacher Curls - 1x20, 1x15, 1x10, 1x30", "Skull Crushers - 2x20, 2x10, 1x30", "Seated Machine Curls - 1x50 each arm"] },
      { day: 33, title: "Cardio & Core Day", exercises: ["Treadmill Run or Incline Walk - 15 minutes", "Romanian Twist - 4x30 each side", "Leg Raises - 4x20", "Ab Curls - 5x30", "Oblique Twist - 5x12", "Optional: Bike - 20 Minutes"] },
      { day: 34, title: "Rest Day", exercises: [] },
      { day: 35, title: "Rest Day", exercises: [] },
    ]
  },

  {
    days: [
      { day: 36, title: "Cardio & Core Day", exercises: ["Treadmill Run or Incline Walk - 20 minutes", "Single Kettlebell Swing - 5x10 ", "Ab Curls - 3x20", "Leg Raises - 3x20", "Plank - 2 min 30 sec hold", "Optional: Bike - 15 minutes"] },
      { day: 37, title: "Back Day", exercises: ["Reverse DB Flys - 3x30", "Seated Rows - 1x30, 1x20, 1x 15, 1x10, 1x5", "Deadlifts - 1x12, 1x10, 1x8, 1x5, 1x3", "Close Grip Lat Pulldowns - 1x30, 1x20, 1x 15, 1x10, 1x5", "Standing Kettlebell Rows - 4x16"] },
      { day: 38, title: "Shoulder Day", exercises: ["Arnold Press - 5x12 + Seated Front Raises - 5x10", "Straight Bar Cable Overhead Raises - 1x20, 1x15, 1x12, 1x10, 1x5", "Machine Reverse Flys - 4x25", "Chin Raises - 3x30", "Straight Bar Rows - 1x20, 1x15, 1x10, 1x5"] },
      { day: 39, title: "Leg Day", exercises: ["Kettlebell Squats - 10x10", "Leg Press - 5x30", "Kettlebell Walking Lunges - 5x15 each leg", "Reverse Hack Squat - 5x10", "Kettlebell Straight-Leg Deadlift - 5x10"] },
      { day: 40, title: "Cardio & Core Day", exercises: ["Treadmill Run or Incline Walk - 15 minutes", "Romanian Twist - 4x30 each side", "Leg Raises - 4x20", "Ab Curls - 5x30", "Oblique Twist - 5x12", "Optional: Bike - 20 Minutes"] },
      { day: 41, title: "Rest Day", exercises: [] },
      { day: 42, title: "Rest Day", exercises: [] },
    ]
  },
  {
    days: [
      {day: 43, title: "Cardio & Core Day", exercises: ["Treadmill Run or Incline Walk - 20 minutes", "Single Kettlebell Swing - 5x10 ", "Ab Curls - 3x20", "Leg Raises - 3x20", "Plank - 2 min 30 sec hold", "Optional: Bike - 15 minutes"] },
      {day: 44, title: "Chest Day", exercises:["Incline Bench Press - 2x20, 2x10, 2x5", "Incline Chest Flys - 6x25", "Bench Press - 2x20, 2x10, 2x5", "Bench Chest Flys - 6x25", "Decline Bench Press - 4x15", "Decline Chest Flys - 6x25"]},
      {day: 45, title: "Back & Biceps Day", exercises:["Underhand Lat Pulldown - 4x20", "Bent-Over Rows - 3x20", "Straight Arm Lat Pulldowns - 4x20", "Reverse Machine Fly - 3x30", "Bicep Curls w/ rope - 4x25", "Straight Bar Curls - 4x25"]},
      {day: 46, title: "Shoulders & Triceps Day", exercises:["KB or DB Shoulder Press - 5x10", "Single Arm Lateral Raises - 5x10", "KB Lawn Mowers - 5x10", "DB Side Raises - 5x10", "Incline Bench Press - 5x12", "Rope Pulldowns - 4x25", "V-Bar Pulldowns - 4x25"]},
      {day: 47, title: "Cardio & Core Day", exercises: ["Treadmill Run or Incline Walk - 15 minutes", "Romanian Twist - 4x30 each side", "Leg Raises - 4x20", "Ab Curls - 5x30", "Oblique Twist - 5x12", "Optional: Bike - 20 Minutes"] },
      {day: 48, title: "Rest Day", exercises: [] },
      {day: 49, title: "Rest Day", exercises: [] },
    ]
  }
];

// Flatten weeks into a single array for navigation
const workouts = weeks.flatMap(week => week.days);