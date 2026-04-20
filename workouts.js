const weeks = [
  {
    days: [
      { day: 1, title: "Cardio & Core", exercises: ["Treadmill Run or Incline Walk - 20 minutes", "Single Kettlebell Swing - 5x10", "Ab Curls - 3x20", "Leg Raises - 3x20", "Plank - 2 min 30 sec hold"] },
      { day: 2, title: "Back & Triceps", exercises: ["Wide-Grip Lat Pulldowns - 3x30", "Reverse Fly Machine - 3x30", "Seated Rows w/ Straight Bar 3x30-20-10 (Raise weight each set)", "Underhand Lat Pulldown - 2x20, 2x15, 1x10", "Tricep Rope Pulldown - 4x20", "V-Bar Pulldowns - 3x30"] },
      { day: 3, title: "Legs", exercises: ["Kettlebell Squats - 5 x 20", "Kettlebell Lunges - 3x20", "Kettlebell Deadlifts - 3x20", "Leg Extension - 4x25", "Leg Curls - 4x25"] },
      { day: 4, title: "Chest & Bicep", exercises: ["Machine Fly - 3x30", "Dumbbell Bench Press - 3x20", "Incline Cable Flys or Dumbbell Flys - 3x30", "Dumbbell Curls 1x20, 1x18, 1x16, 1x12, 1x10", "Rope Curls 3x30"] },
      { day: 5, title: "Fat Burn Core Mix", exercises: ["Treadmill Run - 20 minutes", "Jump Rope - 5x1 min", "Russian Twists - 4x25 each side", "Leg Raises - 4x20", "Plank - 2 min"] },
      { day: 6, title: "Rest Day", exercises: [] },
      { day: 7, title: "Rest Day", exercises: [] },
    ]
  },
  {
    days: [
      { day: 8, title: "Incline Core Burn", exercises: ["Incline Walk - 25 minutes", "Kettlebell Swings - 5x15", "Ab Curls - 4x25", "Mountain Climbers - 4x40 sec", "Side Plank - 2x1 min each side"] },
      { day: 9, title: "Shoulders & Abs", exercises: ["Front Shoulder Raises - 4x15", "Kettlebell Lawn Mowers - 3x15 each arm", "Shoulder Side Raises - 4x12", "Shoulder Press - 2x20, 2x15, 1x10", "Planks - 2 min 30 sec hold", "Romanian Twist - 2x30 each side", "Ab curls - 3x30"] },
      { day: 10, title: "Arms", exercises: ["Superset Bicep Curls + Tricep Pulldown with rope - 5x20", "Seated Dumbbell Curls - 3x15", "Overhead Ticep Extension - 3x15", "Preacher Curls - 3x20", "Dumbbell Kickbacks 3x15"] },
      { day: 11, title: "Legs", exercises: ["Kettlebell Deadlifts - 5x10", "Reverse Hack Squats - 3x20, 3x10", "Deep Squats - 5x10", "Straight Leg Deadlifts - 3x30", "Leg Curls - 3x30, 2x10 (Heavy), 1x30"] },
      { day: 12, title: "Core Stability Day", exercises: ["Treadmill Jog - 20 minutes", "Dead Bug - 4x12 each side", "Slow Leg Raises - 4x15", "Plank Shoulder Taps - 4x20", "Hollow Hold - 3x30 sec"] },
      { day: 13, title: "Rest Day", exercises: [] },
      { day: 14, title: "Rest Day", exercises: [] },
    ]
  },
  {
    days: [
      { day: 15, title: "Endurance Burn", exercises: ["Incline Walk - 30 minutes", "Bicycle Crunches - 4x30", "Russian Twists - 4x25 each side", "Leg Raises - 4x20", "Plank - 3 min total"] },
      { day: 16, title: "Back & Abs", exercises: ["Bent Over Rows - 3x15, 2x20", "Closed Grip Pulldowns - 3x30", "Shoulder Shrugs - 5x20", "Wide Grip Lat Pulldowns - 3x30", "Decline Ab Curls 3x20", "Side Planks - 3x30 seconds each side", "Oblique Twist - 5x15 each side"] },
      { day: 17, title: "Shoulders", exercises: ["Incline Dumbbell Bench Press - 3x15, 2x10", "Bent-over Reverse Flys - 5x15", "Underhand Seated Rows - 2x20, 2x15, 1x10", "Superset Front Shoulder Raise + Side Shoulder Raise - 5x12"] },
      { day: 18, title: "Legs", exercises: ["Leg Extension - 5x20", "Leg Curls - 5x20", "Walking Lunges - 3x8 each leg, 3x5 each leg", "Leg Press - 2x30, 2x20, 2x10", "Calf Raises - 5x20", "Reverse Hack Squat - 5x15"] },
      { day: 19, title: "HIIT Core Blast", exercises: ["Treadmill Sprints - 10 rounds (30 sec sprint / 60 sec walk)", "Kettlebell Swings - 6x15", "Burpees - 4x12", "Mountain Climbers - 4x40 sec", "Plank - 2 min total"] },
      { day: 20, title: "Rest Day", exercises: [] },
      { day: 21, title: "Rest Day", exercises: [] },
    ]
  },
  {
    days: [
      { day: 22, title: "Fat Burn Flow", exercises: ["Treadmill Run - 25 minutes", "Ab Curls - 4x25", "Leg Raises - 4x20", "Russian Twists - 4x30", "Plank - 3 min"] },
      { day: 23, title: "Chest & Triceps", exercises: ["Seated Cable Fly - 5x30", "Superset Dumbbell Bench Press - 2x20, 2x10 + Dumbbell Fly - 4x20", "Machine Fly - 5x20", "Overhead Tricep Extension w/ Rope - 3x30", "Dumbbell Kickbacks - 3x15", "Tricep Extension w/ Rope 3xToFailure"] },
      { day: 24, title: "Back & Biceps", exercises: ["Standing Rows - 2x30, 2x20, 2x10", "Single Arm Seated Rows - 3x15", "Superset Wide Grip Lat Pulldown - 4x10 + Underhand Lat Pulldown - 4x10", "Bicep Curls w/ Rope 3x20", "Dumbbell Curls - 5x10"] },
      { day: 25, title: "Shoulders", exercises: ["Straight Bar Front Raises + Dumbbell Side Shoulder Raises - 1x20, 1x15, 1x12, 1x8", "Dumbbell Shoulder Prewss + Dumbbell Reverse Fly - 4x20", "Bent-over Rows - 1x20, 1x15, 1x12, 1x8", "Dumbbell Front Shoulder Raise - 4x20"] },
      { day: 26, title: "Core Conditioning", exercises: ["Incline Walk - 25 minutes", "Flutter Kicks - 4x30 sec", "Leg Raises - 4x20", "Bicycle Crunches - 4x30", "Side Plank - 2x1 min"] },
      { day: 27, title: "Rest Day", exercises: [] },
      { day: 28, title: "Rest Day", exercises: [] },
    ]
  },
  {
    days: [
      { day: 29, title: "Steady Burn Core", exercises: ["Treadmill Run - 20 minutes", "Slow Leg Raises - 3x20", "Plank - 3 min", "Russian Twists - 3x25 each side", "Mountain Climbers - 3x40 sec"] },
      { day: 30, title: "Legs & Abs", exercises: ["Front Squats - 2x12, 2x10, 1x8", "Hack Squats - 5x8", "Single-leg Leg Press - 2x30, 2x20, 1x10", "Leg Extension - 3x30", "Leg Curls - 3x30", "Ab Curls - 3x30", "Planks - 2 min 30 sec hold", "Seated Ab Curl Machine - 4x20"] },
      { day: 31, title: "Chest", exercises: ["Bench Press - 4x12", "Machine Flys - 5x20", "Decline Bench Press - 4x10", "Incline Dumbbell Flys - 4x25", "Cable Fly (upper, mid, lower chest) - 1x30 each chest area"] },
      { day: 32, title: "Arms", exercises: ["Single-arm Cable Curls - 4x20", "Tricep Pulldowns w/ Rope - 4x20", "Dumbbell Curls - 1x40, 1x30, 1x24, 1x20", "Overhead Tricep Extension - 2x20, 2x10", "Preacher Curls - 1x20, 1x15, 1x10, 1x30", "Skull Crushers - 2x20, 2x10, 1x30", "Seated Machine Curls - 1x50 each arm"] },
      { day: 33, title: "Conditioning Core Day", exercises: ["Treadmill Intervals - 8 rounds", "Jump Rope - 5x1 min", "Ab Curls - 4x25", "Kettlebell Swings - 5x20", "Plank - 2 min"] },
      { day: 34, title: "Rest Day", exercises: [] },
      { day: 35, title: "Rest Day", exercises: [] },
    ]
  },

  {
    days: [
      { day: 36, title: "Core Strength Focus", exercises: ["Incline Walk - 20 minutes", "Dead Bug - 4x12", "Leg Raises - 4x20", "Plank Shoulder Taps - 3x20", "Hollow Hold - 3x30 sec"] },
      { day: 37, title: "Back", exercises: ["Reverse DB Flys - 3x30", "Seated Rows - 1x30, 1x20, 1x 15, 1x10, 1x5", "Deadlifts - 1x12, 1x10, 1x8, 1x5, 1x3", "Close Grip Lat Pulldowns - 1x30, 1x20, 1x 15, 1x10, 1x5", "Standing Kettlebell Rows - 4x16"] },
      { day: 38, title: "Shoulder", exercises: ["Arnold Press - 5x12 + Seated Front Raises - 5x10", "Straight Bar Cable Overhead Raises - 1x20, 1x15, 1x12, 1x10, 1x5", "Machine Reverse Flys - 4x25", "Chin Raises - 3x30", "Straight Bar Rows - 1x20, 1x15, 1x10, 1x5"] },
      { day: 39, title: "Legs", exercises: ["Kettlebell Squats - 10x10", "Leg Press - 5x30", "Kettlebell Walking Lunges - 5x15 each leg", "Reverse Hack Squat - 5x10", "Kettlebell Straight-Leg Deadlift - 5x10"] },
      { day: 40, title: "Fat Burn Core Circuit", exercises: ["Treadmill Run - 25 minutes", "Burpees - 4x12", "Russian Twists - 4x30", "Leg Raises - 4x20", "Plank - 3 min"] },
      { day: 41, title: "Rest Day", exercises: [] },
      { day: 42, title: "Rest Day", exercises: [] },
    ]
  },
  {
    days: [
      { day: 43, title: "Final Core Challenge", exercises: ["Incline Walk - 20 minutes", "Bicycle Crunches - 5x30", "Leg Raises - 5x20", "Russian Twists - 5x25", "Plank - max hold (goal: 3 min+)"] },
      {day: 44, title: "Chest", exercises:["Incline Bench Press - 2x20, 2x10, 2x5", "Incline Chest Flys - 6x25", "Bench Press - 2x20, 2x10, 2x5", "Bench Chest Flys - 6x25", "Decline Bench Press - 4x15", "Decline Chest Flys - 6x25"]},
      {day: 45, title: "Back & Biceps", exercises:["Underhand Lat Pulldown - 4x20", "Bent-Over Rows - 3x20", "Straight Arm Lat Pulldowns - 4x20", "Reverse Machine Fly - 3x30", "Bicep Curls w/ rope - 4x25", "Straight Bar Curls - 4x25"]},
      {day: 46, title: "Shoulders & Triceps", exercises:["KB or DB Shoulder Press - 5x10", "Single Arm Lateral Raises - 5x10", "KB Lawn Mowers - 5x10", "DB Side Raises - 5x10", "Incline Bench Press - 5x12", "Rope Pulldowns - 4x25", "V-Bar Pulldowns - 4x25"]},
      { day: 47, title: "Core Finisher Burn", exercises: ["Treadmill Sprint Intervals - 10 rounds (30 sec sprint / 60 sec walk)", "Kettlebell Swings - 5x20", "Burpees - 4x15", "Bicycle Crunches - 4x30", "Plank - max hold (aim 3+ minutes)"] },
      {day: 48, title: "Rest Day", exercises: [] },
      {day: 49, title: "Rest Day", exercises: [] },
    ]
  }
];

// Flatten weeks into a single array for navigation
const workouts = weeks.flatMap(week => week.days);