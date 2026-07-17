(function () {
  const state = window.RamboAppState;

  function syncDashboard(percent, completed, total, day = state.currentDay) {
    window.RamboUtils?.setText('dashPercent', percent + '%');
    window.RamboUtils?.setText('dashDay', day);
    window.RamboUtils?.setText('dashCompleted', completed + '/' + total);
    window.RamboUtils?.setProgressBar(percent);
  }

  function getStreakDays() {
    return Number(window.RamboUtils?.getStorage('streakDays', 0));
  }

  function markDayComplete(day) {
    window.RamboUtils?.setStorage(`dayComplete-${day}`, 'true');
  }

  function isDayComplete(day) {
    return window.RamboUtils?.getStorage(`dayComplete-${day}`, 'false') === 'true';
  }

  function incrementStreak() {
    const next = getStreakDays() + 1;
    window.RamboUtils?.setStorage('streakDays', next);
    return next;
  }

  function updateProgress() {
    const boxes = Array.from(document.querySelectorAll('#workoutContainer input[type="checkbox"]'));
    let completed = 0;

    boxes.forEach((box) => {
      localStorage.setItem(box.id, box.checked ? 'true' : 'false');
      if (box.checked) completed += 1;
    });

    const total = boxes.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    syncDashboard(percent, completed, total, state.currentDay);

    if (window.RamboFirebase?.db && state.currentUser) {
      const progress = {};
      boxes.forEach((box) => {
        progress[box.id] = box.checked;
      });

      window.RamboFirebase.db.collection('users').doc(state.currentUser.uid).set({
        progress,
        currentDay: state.currentDay
      }, { merge: true }).catch(console.error);
    }

    if (percent === 100 && !isDayComplete(state.currentDay)) {
      markDayComplete(state.currentDay);
      const streak = incrementStreak();
      window.RamboUtils?.setText('dashStreak', `${streak} days`);
    }

    if (percent === 100 && window.confetti) {
      window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }

  function resetProgress() {
    window.RamboUtils?.clearExerciseStorage();
    document.querySelectorAll('#workoutContainer input[type="checkbox"]').forEach((box) => {
      box.checked = false;
    });
    syncDashboard(0, 0, 0, 1);
    state.currentDay = 1;
    window.RamboTraining?.showDay(1);

    if (window.RamboFirebase?.db && state.currentUser) {
      window.RamboFirebase.db.collection('users').doc(state.currentUser.uid).set({
        progress: {},
        currentDay: 1
      }, { merge: true }).catch(console.error);
    }
  }

  window.RamboProgress = {
    updateProgress,
    syncDashboard,
    resetProgress
  };
})();