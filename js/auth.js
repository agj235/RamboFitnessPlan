(function () {
  const state = window.RamboAppState = window.RamboAppState || {
    currentUser: null,
    currentProgram: localStorage.getItem('currentProgram') || '5day',
    currentWorkouts: [],
    currentDay: 1
  };

  const auth = () => window.RamboFirebase?.auth;
  const db = () => window.RamboFirebase?.db;

  function setAuthUI(user) {
    const loginModal = window.RamboUtils?.getEl('loginModal');
    const userControls = window.RamboUtils?.getEl('userControls');

    if (user) {
      if (loginModal) loginModal.style.display = 'none';
      if (userControls) userControls.style.display = 'block';
    } else {
      if (loginModal) loginModal.style.display = 'flex';
      if (userControls) userControls.style.display = 'none';
    }
  }

  function handleAuthState(user) {
    state.currentUser = user;
    setAuthUI(user);

    if (user) {
      window.RamboTraining?.refreshProgram();
      window.RamboTraining?.showDay(state.currentDay);
      window.RamboStrength?.loadStrengthHistory?.();
      window.RamboProgress?.syncDashboard(0, 0, 0, state.currentDay);
    } else {
      window.RamboUtils?.setText('loginStatus', 'Please sign in to continue.');
      window.RamboTraining?.showDay(1);
      window.RamboProgress?.syncDashboard(0, 0, 0, 1);
    }
  }

  function login() {
    const email = window.RamboUtils?.getEl('email')?.value || '';
    const password = window.RamboUtils?.getEl('password')?.value || '';

    if (!email || !password) {
      window.RamboUtils?.setText('loginStatus', 'Please enter your email and password.');
      return;
    }

    if (!auth()) {
      window.RamboUtils?.setText('loginStatus', 'Firebase is unavailable in this preview.');
      return;
    }

    auth().signInWithEmailAndPassword(email, password)
      .catch((err) => {
        window.RamboUtils?.setText('loginStatus', err.message || 'Login failed.');
      });
  }

  function register() {
    const email = window.RamboUtils?.getEl('email')?.value || '';
    const password = window.RamboUtils?.getEl('password')?.value || '';

    if (!email || !password) {
      window.RamboUtils?.setText('loginStatus', 'Please enter your email and password.');
      return;
    }

    if (!auth()) {
      window.RamboUtils?.setText('loginStatus', 'Firebase is unavailable in this preview.');
      return;
    }

    auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        window.RamboUtils?.setText('loginStatus', 'Account created!');
      })
      .catch((err) => {
        window.RamboUtils?.setText('loginStatus', err.message || 'Registration failed.');
      });
  }

  function logout() {
    if (!auth()) {
      state.currentUser = null;
      handleAuthState(null);
      return;
    }

    auth().signOut().then(() => {
      state.currentUser = null;
      handleAuthState(null);
    });
  }

  function initAuth() {
    if (!auth()) {
      handleAuthState(null);
      return;
    }

    auth().onAuthStateChanged(handleAuthState);
  }

  window.RamboAuth = {
    initAuth,
    login,
    register,
    logout,
    handleAuthState
  };
})();
