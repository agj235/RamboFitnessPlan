(function () {
  let strengthChart = null;
  let testMode = 'start';

  function openStrengthModal() {
    const modal = window.RamboUtils?.getEl('rmModal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  function closeStrengthModal() {
    const modal = window.RamboUtils?.getEl('rmModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  function setTestMode(mode) {
    testMode = mode;
  }

  function saveStrengthTest() {
    const state = window.RamboAppState || {};
    if (!state.currentUser || !window.RamboFirebase?.db) return;

    const bench = Number(window.RamboUtils?.getEl('benchInput')?.value || window.RamboUtils?.getEl('bench')?.value) || 0;
    const squat = Number(window.RamboUtils?.getEl('squatInput')?.value || window.RamboUtils?.getEl('squat')?.value) || 0;
    const deadlift = Number(window.RamboUtils?.getEl('deadliftInput')?.value || window.RamboUtils?.getEl('deadlift')?.value) || 0;

    const ref = window.RamboFirebase.db.collection('users').doc(state.currentUser.uid);
    ref.get().then((doc) => {
      const data = doc.data() || {};
      const existing = data.strengthTest || {};
      existing[testMode] = { bench, squat, deadlift };
      return ref.set({ strengthTest: existing }, { merge: true });
    }).then(() => {
      localStorage.setItem('strengthTest', JSON.stringify({ [testMode]: { bench, squat, deadlift } }));
      showStrengthDashboard({ [testMode]: { bench, squat, deadlift } });
    }).catch(console.error);
  }

  function loadStrengthTest() {
    const state = window.RamboAppState || {};
    if (!state.currentUser || !window.RamboFirebase?.db) return;

    window.RamboFirebase.db.collection('users').doc(state.currentUser.uid).get().then((doc) => {
      const data = doc.data() || {};
      const test = data.strengthTest;
      if (!test) return;

      if (test.start) {
        const benchField = window.RamboUtils?.getEl('benchInput') || window.RamboUtils?.getEl('bench');
        const squatField = window.RamboUtils?.getEl('squatInput') || window.RamboUtils?.getEl('squat');
        const deadliftField = window.RamboUtils?.getEl('deadliftInput') || window.RamboUtils?.getEl('deadlift');
        if (benchField) benchField.value = test.start.bench || '';
        if (squatField) squatField.value = test.start.squat || '';
        if (deadliftField) deadliftField.value = test.start.deadlift || '';
      }

      showStrengthDashboard(test);
    }).catch(console.error);
  }

  function showStrengthDashboard(data) {
    const el = window.RamboUtils?.getEl('strengthStats') || window.RamboUtils?.getEl('latestStats');
    if (!el) return;

    const start = data?.start || {};
    const end = data?.end || {};
    const diff = (a, b) => (b || 0) - (a || 0);
    const benchGain = diff(start.bench, end.bench);
    const squatGain = diff(start.squat, end.squat);
    const deadGain = diff(start.deadlift, end.deadlift);
    const format = (val) => (val >= 0 ? `+${val}` : `${val}`);

    el.innerHTML = `
      <div class="rm-row"><span>Bench</span><span>${start.bench || 0} → ${end.bench || 0} (${format(benchGain)})</span></div>
      <div class="rm-row"><span>Squat</span><span>${start.squat || 0} → ${end.squat || 0} (${format(squatGain)})</span></div>
      <div class="rm-row"><span>Deadlift</span><span>${start.deadlift || 0} → ${end.deadlift || 0} (${format(deadGain)})</span></div>
    `;
  }

  function saveStrength() {
    const state = window.RamboAppState || {};
    if (!state.currentUser || !window.RamboFirebase?.db) return;

    const bench = Number(window.RamboUtils?.getEl('bench')?.value) || 0;
    const squat = Number(window.RamboUtils?.getEl('squat')?.value) || 0;
    const deadlift = Number(window.RamboUtils?.getEl('deadlift')?.value) || 0;

    const entry = { date: new Date().toISOString(), bench, squat, deadlift };
    const ref = window.RamboFirebase.db.collection('users').doc(state.currentUser.uid);

    ref.get().then((doc) => {
      const data = doc.data() || {};
      const history = Array.isArray(data.strengthHistory) ? data.strengthHistory : [];
      history.push(entry);
      return ref.set({ strengthHistory: history }, { merge: true });
    }).then(() => {
      loadStrengthHistory();
    }).catch(console.error);
  }

  function loadStrengthHistory() {
    const state = window.RamboAppState || {};
    if (!state.currentUser || !window.RamboFirebase?.db) return;

    window.RamboFirebase.db.collection('users').doc(state.currentUser.uid).get().then((doc) => {
      const data = doc.data() || {};
      const history = data.strengthHistory;
      if (!Array.isArray(history) || history.length === 0) return;
      renderChart(history);
      renderLatest(history);
    }).catch(console.error);
  }

  function renderChart(history) {
    const ctx = window.RamboUtils?.getEl('strengthChart');
    if (!ctx || typeof window.Chart === 'undefined') return;

    if (strengthChart && typeof strengthChart.destroy === 'function') {
      strengthChart.destroy();
    }

    const labels = history.map((entry) => new Date(entry.date).toLocaleDateString());
    strengthChart = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Bench', data: history.map((entry) => entry.bench) },
          { label: 'Squat', data: history.map((entry) => entry.squat) },
          { label: 'Deadlift', data: history.map((entry) => entry.deadlift) }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#fff' } } },
        scales: {
          x: { ticks: { color: '#aaa' } },
          y: { ticks: { color: '#aaa' } }
        }
      }
    });
  }

  function renderLatest(history) {
    const latest = history[history.length - 1];
    const el = window.RamboUtils?.getEl('latestStats');
    if (!el || !latest) return;

    el.innerHTML = `
      <div class="rm-results">
        <h3>Latest Test</h3>
        <div class="rm-row"><span>Bench</span><span>${latest.bench} lbs</span></div>
        <div class="rm-row"><span>Squat</span><span>${latest.squat} lbs</span></div>
        <div class="rm-row"><span>Deadlift</span><span>${latest.deadlift} lbs</span></div>
      </div>
    `;
  }

  function goStrength() {
    window.location.href = 'strength.html';
  }

  function openStrengthAbout() {
    const modal = window.RamboUtils?.getEl('strengthAboutModal');
    if (modal) modal.style.display = 'flex';
  }

  function closeStrengthAbout() {
    const modal = window.RamboUtils?.getEl('strengthAboutModal');
    if (modal) modal.style.display = 'none';
  }

  window.RamboStrength = {
    openStrengthModal,
    closeStrengthModal,
    setTestMode,
    saveStrengthTest,
    loadStrengthTest,
    showStrengthDashboard,
    saveStrength,
    loadStrengthHistory,
    renderChart,
    renderLatest,
    goStrength,
    openStrengthAbout,
    closeStrengthAbout
  };
})();
