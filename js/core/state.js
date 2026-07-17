(function () {
  window.RamboAppState = window.RamboAppState || {
    currentUser: null,
    currentProgram: localStorage.getItem('currentProgram') || '5day',
    currentWorkouts: [],
    currentDay: Number(localStorage.getItem('currentDay') || 1)
  };
})();