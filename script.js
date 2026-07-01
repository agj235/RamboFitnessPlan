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
  if (!currentUser) return;
  if (!currentWorkouts || currentWorkouts.length === 0) return;

  const w = currentWorkouts[day - 1];

  if (!w) {
    workoutContainer.innerHTML =
      `<div class="day-card"><h3>No workout data found</h3></div>`;
    return;
  }

  let html = `<div class="day-card">
    <h3>Day ${w.day} - ${w.title}</h3>
    <ul>`;

  w.exercises.forEach((ex, i) => {
    const id = `d${w.day}-e${i}`;
    const checked = localStorage.getItem(id) === "true";

    html += `
      <li>
        <input type="checkbox" id="${id}" ${checked ? "checked" : ""}>
        <label for="${id}">${ex}</label>
      </li>`;
  });

  html += `</ul></div>`;

  workoutContainer.innerHTML = html;

  document.querySelectorAll("input[type='checkbox']")
    .forEach(box => box.addEventListener("change", updateProgress));

  updateProgress();
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
  localStorage.setItem(key, "true");
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
document.getElementById("prevBtn").onclick = () => {
  if (currentDay > 1) {
    currentDay--;
    showDay(currentDay);
  }
};

document.getElementById("nextBtn").onclick = () => {
  if (currentDay < currentWorkouts.length) {
    currentDay++;
    showDay(currentDay);
  }
};

// =========================
// PROGRAM SELECTOR
// =========================
document.getElementById("programSelect").addEventListener("change", e => {
  currentProgram = e.target.value;
  localStorage.setItem("currentProgram", currentProgram);

  refreshProgram();
  currentDay = 1;
  showDay(currentDay);
});

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
  if (!currentUser) return;

  // 1. Clear localStorage checkboxes
  document.querySelectorAll("input[type='checkbox']").forEach(box => {
    localStorage.removeItem(box.id);
    box.checked = false;
  });

  // 2. Reset Firestore progress
  db.collection("users")
    .doc(currentUser.uid)
    .set({
      progress: {},
      currentDay: 1
    }, { merge: true });

  // 3. Reset state
  currentDay = 1;

  // 4. Reset UI
  const bar = document.getElementById("progressBar");
  const percentEl = document.getElementById("dashPercent");
  const completedEl = document.getElementById("dashCompleted");
  const dayEl = document.getElementById("dashDay");

  if (bar) bar.style.width = "0%";
  if (percentEl) percentEl.innerText = "0%";
  if (completedEl) completedEl.innerText = "0/0";
  if (dayEl) dayEl.innerText = "1";

  // 5. Reload workout day UI
  showDay(currentDay);
}

window.addEventListener("load", () => {
  const splash = document.getElementById("splashScreen");

  setTimeout(() => {
    if (splash) splash.style.display = "none";
  }, 3000);
});

window.addEventListener("load", () => {
  const splash = document.getElementById("splash");

  // keeps splash visible for cinematic timing
  setTimeout(() => {
    splash.style.opacity = "0";
    splash.style.transition = "0.8s ease";

    setTimeout(() => {
      splash.style.display = "none";
    }, 800);

  }, 2800); // total intro time
});