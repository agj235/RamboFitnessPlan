(function () {
  const state = window.RamboAppState;

  const previewPlans = {
    '5day': [
      { day: 1, title: 'Upper Body + Conditioning', exercises: ['Bench Press 4x8', 'Row 4x10', 'Burpees 3x20'] },
      { day: 2, title: 'Lower Body Strength', exercises: ['Squat 5x5', 'Romanian Deadlift 3x8', 'Lunges 3x12'] },
      { day: 3, title: 'Core & Mobility', exercises: ['Plank 4x60s', 'Hanging Knee Raises 3x15', 'Stretch Flow 15 min'] },
      { day: 4, title: 'Cardio Intervals', exercises: ['Bike 20 min', 'HIIT 8 rounds', 'Cooldown 5 min'] },
      { day: 5, title: 'Full Body Power', exercises: ['Deadlift 4x6', 'Push Press 3x8', 'Farmer Carries 3x40m'] }
    ],
    '4day': [
      { day: 1, title: 'Push + Core', exercises: ['Incline Press 4x8', 'Dips 3x10', 'Plank 3x45s'] },
      { day: 2, title: 'Pull + Legs', exercises: ['Pull-Ups 4x8', 'Leg Press 3x12', 'Calf Raises 3x15'] },
      { day: 3, title: 'Conditioning', exercises: ['Rowing 25 min', 'Shadow Boxing 10 min', 'Breathing Drill'] },
      { day: 4, title: 'Strength Circuit', exercises: ['Goblet Squat 3x10', 'RDL 3x8', 'Push-Ups 3x20'] }
    ]
  };

  function getActiveWorkouts() {
    return state.currentWorkouts?.length ? state.currentWorkouts : previewPlans[state.currentProgram || '5day'];
  }

function getWorkoutDataCandidates(programKey) {

    const fileName = programKey === '4day'
        ? 'workouts4day.json'
        : 'workouts5day.json';

    const cacheBuster = Date.now();

    const candidates = [
        `./data/${fileName}`,
        `data/${fileName}`
    ];

    return candidates.map((candidate) => {
        return `${candidate}?v=${cacheBuster}`;
    });
}

  async function loadWorkoutData(programKey) {
    const candidates = getWorkoutDataCandidates(programKey);

    for (const url of candidates) {
      try {
        const response = await fetch(url, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (!response.ok) continue;
        const data = await response.json();
        if (Array.isArray(data) && data.length) {
          return data;
        }
      } catch (err) {
        // Try the next candidate.
      }
    }

    throw new Error('Unable to load workout data from any candidate URL.');
  }

  function parseExerciseDetail(exercise) {
    const match = exercise.match(/(.+?)\s+(\d[\dx\s\w]+)/i);
    return match ? { name: match[1], detail: match[2] } : { name: exercise, detail: '' };
  }

  function renderWorkouts() {
    const container = window.RamboUtils?.getEl('workoutContainer');
    if (!container) return;

    const dayPlans = getActiveWorkouts();
    const day = dayPlans[Math.max(0, state.currentDay - 1)] || dayPlans[0];
    if (!day) return;

    const total = day.exercises.length;
    const completedCount = day.exercises.reduce((sum, _, index) => {
      return sum + (localStorage.getItem(`d${day.day}-e${index}`) === 'true' ? 1 : 0);
    }, 0);
    const percentComplete = total ? Math.round((completedCount / total) * 100) : 0;

    let html = `
      <div class="day-summary card">
        <div>
          <span class="card-label">Day ${day.day}</span>
          <strong>${day.title}</strong>
          <p>${total} exercises · ${completedCount} completed</p>
        </div>
        <div class="progress-pill">${percentComplete}%</div>
      </div>
    `;

    day.exercises.forEach((exercise, index) => {
      const id = `d${day.day}-e${index}`;
      const checked = localStorage.getItem(id) === 'true';
      const { name, detail } = parseExerciseDetail(exercise);
      const progress = checked ? 100 : 12;

      html += `
        <label class="workout-card ${checked ? 'done' : ''}" for="${id}">
          <div class="workout-ring" style="--progress:${progress}">
            <span class="ring-fill"></span>
            <span class="ring-label">${checked ? '100%' : 'Ready'}</span>
          </div>
          <div class="exercise-details">
            <strong>${name}</strong>
            <span class="exercise-meta">${detail}</span>
          </div>
          <div class="exercise-state">
            <span class="status-pill">${checked ? 'Completed' : 'Pending'}</span>
            <span class="action-text">${checked ? 'Tap to undo' : 'Mark done'}</span>
          </div>
          <input type="checkbox" hidden id="${id}" ${checked ? 'checked' : ''}>
        </label>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('input[type="checkbox"]').forEach((box) => {
      box.addEventListener('change', () => {
        window.RamboProgress?.updateProgress();
        renderWorkouts();
      });
    });

    window.RamboProgress?.updateProgress();
  }

  function showDay(day) {
    state.currentDay = day;
    localStorage.setItem('currentDay', day);
    renderWorkouts();
    window.updateHomeSummary?.();
  }

  function changeDay(delta) {
    const dayPlans = getActiveWorkouts();
    if (!dayPlans.length) return;
    const nextDay = ((state.currentDay - 1 + delta + dayPlans.length) % dayPlans.length) + 1;
    showDay(nextDay);
  }

 async function refreshProgram() {

    const programKey = state.currentProgram === '4day'
      ? '4day'
      : '5day';


    // Preview users get fallback workouts
    if (state.currentUser?.uid?.startsWith('preview-')) {

        state.currentWorkouts = previewPlans[programKey];

        renderWorkouts();

        console.log("Preview workout plan loaded");

        return;
    }


    // Registered users get full programs
    try {
        const data = await loadWorkoutData(programKey);
        state.currentWorkouts = data;

    } catch (err) {
        state.currentWorkouts = previewPlans[programKey];
        console.warn('Falling back to bundled workout plan.', err);
    }

    renderWorkouts();
}

  function handleProgramChange(value) {
    state.currentProgram = value;
    localStorage.setItem('currentProgram', value);
    window.RamboUserData?.queueSave('currentProgram', value);
    state.currentDay = 1;
    refreshProgram();
  }

  function initTraining() {
    const programSelect = window.RamboUtils?.getEl('programSelect');
    if (programSelect) {
      programSelect.value = state.currentProgram;
      programSelect.addEventListener('change', (event) => {
        handleProgramChange(event.target.value);
      });
    }

    const prevBtn = window.RamboUtils?.getEl('prevBtn');
    const nextBtn = window.RamboUtils?.getEl('nextBtn');
    const resetBtn = window.RamboUtils?.getEl('resetProgress');

    if (prevBtn) {
      prevBtn.onclick = () => changeDay(-1);
    }

    if (nextBtn) {
      nextBtn.onclick = () => changeDay(1);
    }

    if (resetBtn) {
      resetBtn.onclick = () => window.RamboProgress?.resetProgress();
    }

    refreshProgram();
    showDay(state.currentDay);
  }

  window.RamboTraining = {
    initTraining,
    refreshProgram,
    renderWorkouts,
    showDay,
    changeDay,
    handleProgramChange,
    getActiveWorkouts
  };
})();