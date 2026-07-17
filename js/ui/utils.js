(function () {
  function getEl(id) {
    return document.getElementById(id);
  }

  function showModal(id, show = true) {
    const el = getEl(id);
    if (el) {
      el.style.display = show ? 'flex' : 'none';
    }
  }

  function setText(id, value) {
    const el = getEl(id);
    if (el) {
      el.textContent = value;
    }
  }

  function setProgressBar(percent) {
    const bar = getEl('progressBar');
    if (bar) {
      bar.style.width = percent + '%';
    }
  }

  function setStorage(key, value) {
    localStorage.setItem(key, String(value));
  }

  function getStorage(key, fallback = null) {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  }

  function clearExerciseStorage() {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('d')) {
        localStorage.removeItem(key);
      }
    });
  }

  function removeStorage(key) {
    localStorage.removeItem(key);
  }

  window.RamboUtils = {
    getEl,
    showModal,
    setText,
    setProgressBar,
    setStorage,
    getStorage,
    removeStorage,
    clearExerciseStorage
  };
})();
