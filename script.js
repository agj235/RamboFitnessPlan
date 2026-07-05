// =========================
// FIREBASE INIT
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyARCnBdNuUfPNtZ_otEn-MWpktzShD_NWE",
  authDomain: "rambofitness-81303.firebaseapp.com",
  projectId: "rambofitness-81303",
  storageBucket: "rambofitness-81303.appspot.com",
  messagingSenderId: "3674488945",
  appId: "1:3674488945:web:58e907ce543b1b87bbdbd0"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// =========================
// STATE
// =========================
let currentUser = null;
let currentProgram = localStorage.getItem("currentProgram") || "5day";
let currentWorkouts = [];
let currentDay = 1;

// =========================
// ELEMENTS
// =========================
const workoutContainer = document.getElementById("workoutContainer");
const authMessage = document.getElementById("authMessage");
const loginModal = document.getElementById("loginModal");
const loadingScreen = document.getElementById("loadingScreen");

// =========================
// INIT WORKFLOW (FIX FOR WORKOUT LOADING)
// =========================
function initApp() {
  refreshProgram();
  showDay(currentDay);
}

// =========================
// AUTH STATE
// =========================
auth.onAuthStateChanged(user => {
  currentUser = user;

  if (loadingScreen) loadingScreen.style.display = "none";

  const userControls = document.getElementById("userControls");

  if (user) {
    if (loginModal) loginModal.style.display = "none";
    if (userControls) userControls.style.display = "block";

    refreshProgram();
    loadCloudData();
    showDay(currentDay);

  } else {
    if (loginModal) loginModal.style.display = "flex";
    if (userControls) userControls.style.display = "none";

    resetUI();

    workoutContainer.innerHTML =
      `<div class="day-card"><h3>🔒 Login to view workouts</h3></div>`;
  }
});

// =========================
// WORKOUT LOADING (FIXED)
// =========================
async function refreshProgram() {
  try {
    const res5 = await fetch("workouts5day.json");
    const res4 = await fetch("workouts4day.json");

    const data5 = await res5.json();
    const data4 = await res4.json();

    if (currentProgram === "4day") {
      currentWorkouts = data4;
    } else {
      currentWorkouts = data5;
    }

    console.log("Workouts loaded:", currentWorkouts.length);

  } catch (err) {
    console.error("Failed to load workouts:", err);
    currentWorkouts = [];
  }
}
async function initApp() {
  await refreshProgram();
  showDay(currentDay);
}

// =========================
// SHOW DAY (SAFE)
// =========================
function showDay(day) {
  if (!currentUser || !currentWorkouts.length) return;
  if (!workoutContainer) return; // 🔥 FIX

  const w = currentWorkouts[day - 1];
  if (!w) return;

  let html = `<div class="day-card">
    <h3>Day ${w.day} - ${w.title}</h3>
    <ul>`;

  w.exercises.forEach((ex, i) => {
  const id = `d${w.day}-e${i}`;
  const checked = localStorage.getItem(id) === "true";

  html += `
    <div class="exercise-card ${checked ? "done" : ""}">
      <div class="check-wrap">
        <input type="checkbox" id="${id}" ${checked ? "checked" : ""}>
      </div>

      <label for="${id}" class="exercise-text">
        ${ex}
      </label>

      <div class="status-dot"></div>
    </div>
  `;
});

  html += `</ul></div>`;

  workoutContainer.innerHTML = html;

  workoutContainer.querySelectorAll("input[type='checkbox']")
    .forEach(box => box.onchange = updateProgress);

}

// Confetti launcher
function launchConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// =========================
// PROGRESS
// =========================
function updateProgress() {
  const boxes = document.querySelectorAll("input[type='checkbox']");
  let completed = 0;

  const progress = {};

  boxes.forEach(b => {
    localStorage.setItem(b.id, b.checked);
    progress[b.id] = b.checked;

    if (b.checked) completed++;
  });

  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .set({
        progress,
        currentDay
      }, { merge: true });
  }

  const total = boxes.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const bar = document.getElementById("progressBar");
  const percentEl = document.getElementById("dashPercent");
  const completedEl = document.getElementById("dashCompleted");
  const dayEl = document.getElementById("dashDay");

  if (bar) bar.style.width = percent + "%";
  if (percentEl) percentEl.innerText = percent + "%";
  if (completedEl) completedEl.innerText = `${completed}/${total}`;
  if (dayEl) dayEl.innerText = currentDay;

  const key = `confetti-day-${currentDay}`;
const alreadyPlayed = localStorage.getItem(key);

if (percent === 100 && !alreadyPlayed) {
  launchConfetti();
  workoutContainer.classList.add("completed-pulse");
}
}

// ABOUT MODAL
function openAbout() {
  document.getElementById("aboutModal").style.display = "flex";
}

function closeAbout() {
  document.getElementById("aboutModal").style.display = "none";
}

// =========================
// LOGIN
// =========================
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .catch(err => {
      document.getElementById("loginStatus").innerText = err.message;
    });
}

// =========================
// REGISTER
// =========================
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("loginStatus").innerText =
        "Account created!";
    })
    .catch(err => {
      document.getElementById("loginStatus").innerText = err.message;
    });
}

// =========================
// CLOUD DATA
// =========================
function loadCloudData() {
  if (!currentUser) return;

  db.collection("users")
    .doc(currentUser.uid)
    .get()
    .then(doc => {
      if (!doc.exists) return;

      const data = doc.data();

      if (data.progress) {
        Object.keys(data.progress).forEach(key => {
          localStorage.setItem(key, data.progress[key]);
        });
      }

      if (data.currentDay) {
        currentDay = data.currentDay;
      }

      showDay(currentDay);
    })
    .catch(console.error);
}

// =========================
// NAVIGATION
// =========================
const prevBtn = document.getElementById("prevBtn");
if (prevBtn) {
  prevBtn.onclick = () => {
    if (currentDay > 1) {
      currentDay--;
      showDay(currentDay);
    }
  };
}

const nextBtn = document.getElementById("nextBtn");
if (nextBtn) {
  nextBtn.onclick = () => {
    if (!currentWorkouts.length) return;

    if (currentDay < currentWorkouts.length) {
      currentDay++;
      showDay(currentDay);
    }
  };
}

const resetBtn = document.getElementById("resetProgress");
if (resetBtn) {
  resetBtn.onclick = resetProgress;
}

// =========================
// PROGRAM SELECTOR
// =========================
const programSelect = document.getElementById("programSelect");
if (programSelect) {
  programSelect.addEventListener("change", async e => {
    currentProgram = e.target.value;
    localStorage.setItem("currentProgram", currentProgram);

    await refreshProgram();
    currentDay = 1;
    showDay(currentDay);
  });
}
// =========================
// RESET UI
// =========================
function resetUI() {
  const bar = document.getElementById("progressBar");
  const percentEl = document.getElementById("dashPercent");
  const completedEl = document.getElementById("dashCompleted");

  if (bar) bar.style.width = "0%";
  if (percentEl) percentEl.innerText = "0%";
  if (completedEl) completedEl.innerText = "0/0";
}

// =========================
// SCROLL
// =========================
function scrollToWorkouts() {
  document.getElementById("workouts").scrollIntoView({
    behavior: "smooth"
  });
}

// =========================
// LOGOUT
// =========================
function logout() {
  auth.signOut().then(() => {
    currentUser = null;
    resetUI();

    workoutContainer.innerHTML =
      `<div class="day-card"><h3>🔒 Logged out</h3></div>`;
  });
}

// =========================
// INIT AFTER PAGE LOAD (IMPORTANT FIX)
// =========================
window.addEventListener("load", async () => {
  await initApp();
});

// =========================
// GLOBAL EXPORTS
// =========================
window.login = login;
window.logout = logout;
window.register = register;
window.scrollToWorkouts = scrollToWorkouts;

document.getElementById("resetProgress").addEventListener("click", resetProgress);

function resetProgress() {
  if (!confirm("Reset all workout progress?")) return;

  if (!currentUser) return;

  // 1. Clear ALL workout-related localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith("d")) {
      // your exercise IDs look like: d1-e0, d2-e3 etc
      localStorage.removeItem(key);
    }
  });

  // 2. Reset checkboxes in current DOM view
  document.querySelectorAll("input[type='checkbox']").forEach(box => {
    box.checked = false;
  });

  // 3. Reset Firestore progress
  db.collection("users")
    .doc(currentUser.uid)
    .set({
      progress: {},
      currentDay: 1
    }, { merge: true });

  // 4. Reset state
  currentDay = 1;

  // 5. Force re-render full UI
  showDay(currentDay);

  // 6. Reset dashboard UI
  const bar = document.getElementById("progressBar");
  const percentEl = document.getElementById("dashPercent");
  const completedEl = document.getElementById("dashCompleted");
  const dayEl = document.getElementById("dashDay");

  if (bar) bar.style.width = "0%";
  if (percentEl) percentEl.innerText = "0%";
  if (completedEl) completedEl.innerText = "0/0";
  if (dayEl) dayEl.innerText = "1";
  
}

// =========================
// 1RM CALCULATOR
// =========================

function open1RMModal() {
  document.getElementById("rmModal").style.display = "flex";
}

function close1RMModal() {
  document.getElementById("rmModal").style.display = "none";
}

function calculate1RM() {
  const oneRM = Number(document.getElementById("rmInput").value);
  const results = document.getElementById("rmResults");

  if (!oneRM || oneRM <= 0) {
    results.innerHTML = "<p>Enter a valid number</p>";
    return;
  }

  const percents = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  results.innerHTML = percents.map(p => {
    const val = Math.round(oneRM * p / 100);
    return `
      <div class="rm-row">
        <span>${p}%</span>
        <span>${val} lbs</span>
      </div>
    `;
  }).join("");
}

// =========================
// STRENGTH TEST SYSTEM
// =========================

let testMode = "start";

function openStrengthTest() {
  document.getElementById("strengthModal").style.display = "flex";
  loadStrengthTest();
}

function closeStrengthTest() {
  document.getElementById("strengthModal").style.display = "none";
}

function setTestMode(mode) {
  testMode = mode;
}

function saveStrengthTest() {
  if (!currentUser) return;

  const bench = Number(document.getElementById("benchInput").value) || 0;
  const squat = Number(document.getElementById("squatInput").value) || 0;
  const deadlift = Number(document.getElementById("deadliftInput").value) || 0;

  const ref = db.collection("users").doc(currentUser.uid);

  ref.get().then(doc => {
    const data = doc.data() || {};
    const existing = data.strengthTest || {};

    existing[testMode] = { bench, squat, deadlift };

    ref.set({ strengthTest: existing }, { merge: true });

    localStorage.setItem("strengthTest", JSON.stringify(existing));
    showStrengthDashboard(existing);
  });
}

function loadStrengthTest() {
  if (!currentUser) return;

  db.collection("users")
    .doc(currentUser.uid)
    .get()
    .then(doc => {
      const data = doc.data() || {};
      const test = data.strengthTest;

      if (!test) return;

      if (test.start) {
        document.getElementById("benchInput").value = test.start.bench || "";
        document.getElementById("squatInput").value = test.start.squat || "";
        document.getElementById("deadliftInput").value = test.start.deadlift || "";
      }

      showStrengthDashboard(test);
    });
}

// =========================
// STRENGTH DASHBOARD
// =========================

function showStrengthDashboard(data) {
  const el = document.getElementById("strengthStats");
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
// =========================
// STRENGTH HISTORY
// =========================

function saveStrength() {
  if (!currentUser) return;

  const bench = Number(document.getElementById("bench").value);
  const squat = Number(document.getElementById("squat").value);
  const deadlift = Number(document.getElementById("deadlift").value);

  const entry = {
    date: new Date().toISOString(),
    bench: bench || 0,
    squat: squat || 0,
    deadlift: deadlift || 0
  };

  const ref = db.collection("users").doc(currentUser.uid);

  ref.get().then(doc => {
    const data = doc.data() || {};
    const history = Array.isArray(data.strengthHistory)
      ? data.strengthHistory
      : [];

    history.push(entry);

    return ref.set({ strengthHistory: history }, { merge: true });
  }).then(() => {
    console.log("Strength saved:", entry);
    loadStrengthHistory();
  }).catch(err => {
    console.error("Save error:", err);
  });
}
function loadStrengthHistory() {
  if (!currentUser) return;

  db.collection("users")
    .doc(currentUser.uid)
    .get()
    .then(doc => {
      const data = doc.data() || {};

      const history = data.strengthHistory;

      console.log("Loaded history:", history);

      if (!Array.isArray(history) || history.length === 0) {
        console.log("No strength history found");
        return;
      }

      renderChart(history);
      renderLatest(history);
    })
    .catch(err => console.error("Load error:", err));
}
function renderChart(history) {
  console.log("Rendering chart with:", history);

  const ctx = document.getElementById("strengthChart");

  if (!ctx) {
    console.error("Chart canvas missing");
    return;
  }

  if (typeof Chart === "undefined") {
    console.error("Chart.js not loaded");
    return;
  }

  const labels = history.map(h =>
    new Date(h.date).toLocaleDateString()
  );

  const bench = history.map(h => h.bench);
  const squat = history.map(h => h.squat);
  const dead = history.map(h => h.deadlift);

  // 🔥 SAFE DESTROY (fix your crash)
  if (strengthChart && typeof strengthChart.destroy === "function") {
    strengthChart.destroy();
  }

  strengthChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Bench",
          data: bench
        },
        {
          label: "Squat",
          data: squat
        },
        {
          label: "Deadlift",
          data: dead
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "#fff" }
        }
      },
      scales: {
        x: {
          ticks: { color: "#aaa" }
        },
        y: {
          ticks: { color: "#aaa" }
        }
      }
    }
  });
}

function goStrength() {
  window.location.href = "strength.html";
}

window.goStrength = goStrength;

function renderLatest(history) {
  const latest = history[history.length - 1];
  const el = document.getElementById("latestStats");

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

function openStrengthAbout() {
  document.getElementById("strengthAboutModal").style.display = "flex";
}

function closeStrengthAbout() {
  document.getElementById("strengthAboutModal").style.display = "none";
}