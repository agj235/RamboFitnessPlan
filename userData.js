(function () {
  function db() {
    return window.RamboFirebase?.db;
  }

  function currentUid() {
    return window.RamboAppState?.currentUser?.uid || null;
  }

  // Only currentProgram is pushed through here — checkboxes/currentDay go via
  // progress.js's direct write, and strengthTest/strengthHistory go via strength.js.
  const SYNCED_KEYS = ['currentProgram'];

  function isSyncedKey(key) {
    return SYNCED_KEYS.includes(key);
  }

 async function loadFromCloud(uid) {
  if (!db() || !uid) return;

  const docRef = db().collection('users').doc(uid);
  const snap = await docRef.get();

  if (!snap.exists) return;

  const data = snap.data() || {};
  const state = window.RamboAppState;

  if (data.progress && typeof data.progress === 'object') {
    Object.entries(data.progress).forEach(([boxId, checked]) => {
      localStorage.setItem(boxId, checked ? 'true' : 'false');
    });
  }

  if (data.currentDay !== undefined) {
    localStorage.setItem('currentDay', data.currentDay);
    if (state) state.currentDay = Number(data.currentDay);
  }

  if (data.currentProgram !== undefined) {
    localStorage.setItem('currentProgram', data.currentProgram);
    if (state) state.currentProgram = data.currentProgram;
  }

  if (data.strengthTest !== undefined) {
    localStorage.setItem('strengthTest', JSON.stringify(data.strengthTest));
  }
}

  let pendingWrites = {};
  let saveTimer = null;

  function flushSave() {
    const uid = currentUid();
    if (!db() || !uid || Object.keys(pendingWrites).length === 0) {
      pendingWrites = {};
      return;
    }
    const payload = pendingWrites;
    pendingWrites = {};
    db().collection('users').doc(uid).set(payload, { merge: true }).catch((err) => {
      console.warn('Cloud save failed:', err);
    });
  }

  function queueSave(key, value) {
    if (!isSyncedKey(key)) return; // ignore anything progress.js/strength.js already own
    if (!db() || !currentUid()) return; // preview mode — local only

    pendingWrites[key] = value;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flushSave, 800);
  }

  window.RamboUserData = {
    loadFromCloud,
    queueSave
  };
})();