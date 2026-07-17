(function () {
  const state = window.RamboAppState;

  const auth = () => window.RamboFirebase?.auth;
  const db = () => window.RamboFirebase?.db;

  function setAuthUI(user) {
    const loginModal = window.RamboUtils?.getEl('loginModal');
    const userControls = window.RamboUtils?.getEl('userControls');

    if (user) {
      if (loginModal) loginModal.style.display = 'none';
      if (userControls) userControls.style.display = 'block';
    } else {
      if (loginModal) {
        loginModal.style.display = 'flex';
        loginModal.classList.add('active');
      }
      if (userControls) userControls.style.display = 'none';
    }
  }

  function handleAuthState(user) {
    state.currentUser = user;
    setAuthUI(user);

    if (user) {
      const finishLogin = () => {
        window.RamboTraining?.refreshProgram();
        window.RamboTraining?.showDay(state.currentDay);
        window.RamboStrength?.loadStrengthHistory?.();
        window.RamboProgress?.syncDashboard(0, 0, 0, state.currentDay);
      };

      if (window.RamboUserData?.loadFromCloud) {
        window.RamboUserData.loadFromCloud(user.uid).then(finishLogin).catch(finishLogin);
      } else {
        finishLogin();
      }
    } else {
      window.RamboUtils?.setText('loginStatus', 'Please sign in to continue.');
      window.RamboTraining?.showDay(1);
      window.RamboProgress?.syncDashboard(0, 0, 0, 1);
    }
  }

  function getStoredPreviewUser() {
    try {
      const raw = localStorage.getItem('ramboPreviewUser');
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function persistPreviewUser(user) {
    try {
      localStorage.setItem('ramboPreviewUser', JSON.stringify(user));
    } catch (err) {
      // Ignore storage failures in preview mode.
    }
  }

  function clearPreviewUser() {
    try {
      localStorage.removeItem('ramboPreviewUser');
    } catch (err) {
      // Ignore storage failures in preview mode.
    }
  }

  function previewAuth(email, password) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedPassword = (password || '').trim();

    if (!normalizedEmail || !normalizedPassword) {
      return Promise.reject(new Error('Please enter your email and password.'));
    }

    const previewUser = {
      uid: `preview-${Math.random().toString(36).slice(2, 10)}`,
      email: normalizedEmail,
      displayName: normalizedEmail.split('@')[0]
    };

    persistPreviewUser(previewUser);
    state.currentUser = previewUser;
    handleAuthState(previewUser);

    return Promise.resolve(previewUser);
  }

  function login() {
    const email = window.RamboUtils?.getEl('email')?.value || '';
    const password = window.RamboUtils?.getEl('password')?.value || '';

    if (!email || !password) {
      window.RamboUtils?.setText('loginStatus', 'Please enter your email and password.');
      return;
    }

    if (!auth()) {
      previewAuth(email, password)
        .then(() => {
          window.RamboUtils?.setText('loginStatus', 'Preview mode active. You are signed in locally.');
        })
        .catch((err) => {
          window.RamboUtils?.setText('loginStatus', err.message || 'Login failed.');
        });
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
      previewAuth(email, password)
        .then(() => {
          window.RamboUtils?.setText('loginStatus', 'Preview account created locally.');
        })
        .catch((err) => {
          window.RamboUtils?.setText('loginStatus', err.message || 'Registration failed.');
        });
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

  function resetPassword() {
    const email = window.RamboUtils?.getEl('email')?.value || '';

    if (!email) {
      window.RamboUtils?.setText('loginStatus', 'Please enter your email to reset your password.');
      return;
    }

    if (!auth()) {
      window.RamboUtils?.setText('loginStatus', 'Password reset is available in Firebase-enabled mode.');
      return;
    }

    auth().sendPasswordResetEmail(email)
      .then(() => {
        window.RamboUtils?.setText('loginStatus', 'Password reset email sent.');
      })
      .catch((err) => {
        window.RamboUtils?.setText('loginStatus', err.message || 'Password reset failed.');
      });
  }

  function logout() {
    if (!auth()) {
      clearPreviewUser();
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
      const savedPreviewUser = getStoredPreviewUser();
      if (savedPreviewUser) {
        state.currentUser = savedPreviewUser;
        handleAuthState(savedPreviewUser);
      } else {
        handleAuthState(null);
      }
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