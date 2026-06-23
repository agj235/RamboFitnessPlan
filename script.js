// =========================
// FIREBASE INIT
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyARCnBdNuUfPNtZ_otEn-MWpktzShD_NWE",
  authDomain: "rambofitness-81303.firebaseapp.com",
  projectId: "rambofitness-81303",
  storageBucket: "rambofitness-81303.firebasestorage.app",
  messagingSenderId: "3674488945",
  appId: "1:3674488945:web:58e907ce543b1b87bbdbd0"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// =========================
// DOM SAFE INIT
// =========================
const workoutContainer = document.getElementById("workoutContainer");
const programSelect = document.getElementById("programSelect");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// =========================
// STATE
// =========================
let currentUser = null;
let isLoggedIn = false;

let currentProgram = localStorage.getItem("currentProgram") || "5day";

let currentWorkouts = [];
let currentDay = 1;
let totalDays = 0;

// =========================
// LOGIN UI FUNCTIONS (GLOBAL SAFE)
// =========================
window.login = function () {
  const email = prompt("Email:");
  const password = prompt("Password:");

  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
};

window.logout = function () {
  auth.signOut();
};

// =========================
// AUTH STATE LISTENER
// =========================
auth.onAuthStateChanged(user => {
  currentUser = user;
  isLoggedIn = !!user;

  if (user) {
    loadCloudData();
    initProgram();
  } else {
    showLoggedOutUI();
  }
});

// =========================
// LOGGED OUT UI
// =========================
function showLoggedOutUI() {
  if (!workoutContainer) return;

  workoutContainer.innerHTML = `
    <div class="day-card">
      <h3>🔒 Please login to view workouts</h3>
      <p>Track your progress by signing in.</p>
    </div>
  `;
}

// =========================
// PROGRAM SETUP
// =========================
function initProgram() {
  refreshProgram();

  const savedDay = localStorage.getItem(`rambo_${currentProgram}_day`);
  currentDay = savedDay ? parseInt(savedDay) : 1;

  showDay(currentDay);
}

function refreshProgram() {
  currentWorkouts = currentProgram === "4day" ? workouts4Day : workouts;
  totalDays = currentWorkouts?.length || 0;
}

// =========================
// PROGRAM SWITCH
// =========================
if (programSelect) {
  programSelect.value = currentProgram;

  programSelect.addEventListener("change", () => {
    currentProgram = programSelect.value;
    localStorage.setItem("currentProgram", currentProgram);

    initProgram();
  });
}

// =========================
// RENDER DAY
// =========================
function showDay(day) {
  if (!isLoggedIn || !currentWorkouts.length) return;

  const w = currentWorkouts[day - 1];
  if (!w) return;

  workoutContainer.innerHTML = "";

  let exercisesHTML = "";

  w.exercises.forEach((ex, i) => {
    const id = `day${w.day}-ex${i}`;
    const saved = localStorage.getItem(getKey(id)) === "true";

    exercisesHTML += `
      <li>
        <input type="checkbox" id="${id}" ${saved ? "checked" : ""}>
        <label for="${id}">${ex}</label>
      </li>
    `;
  });

  const card = document.createElement("div");
  card.classList.add("day-card");

  card.innerHTML = `
    <h3>Day ${w.day} – ${w.title}</h3>
    <ul>${exercisesHTML}</ul>
  `;

  workoutContainer.appendChild(card);

  document.querySelectorAll("input[type='checkbox']").forEach(box => {
    box.addEventListener("change", updateProgress);
  });

  updateProgress();
}

// =========================
// STORAGE KEY
// =========================
function getKey(key) {
  return `rambo_${currentProgram}_${key}`;
}

// =========================
// PROGRESS
// =========================
function getStats() {
  let total = 0;
  let completed = 0;

  currentWorkouts.forEach(day => {
    total += day.exercises.length;

    day.exercises.forEach((_, i) => {
      const id = `day${day.day}-ex${i}`;
      if (localStorage.getItem(getKey(id)) === "true") {
        completed++;
      }
    });
  });

  return { total, completed };
}

function updateProgress() {
  const boxes = document.querySelectorAll("input[type='checkbox']");

  boxes.forEach(b => {
    localStorage.setItem(getKey(b.id), b.checked);

    if (currentUser) {
      saveToCloud(b.id, b.checked);
    }
  });

  const { total, completed } = getStats();
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const bar = document.getElementById("progressBar");
  if (bar) bar.style.width = percent + "%";

  const dashPercent = document.getElementById("dashPercent");
  const dashCompleted = document.getElementById("dashCompleted");

  if (dashPercent) dashPercent.innerText = percent + "%";
  if (dashCompleted) dashCompleted.innerText = `${completed}/${total}`;
}

// =========================
// NAVIGATION
// =========================
if (prevBtn) {
  prevBtn.onclick = () => {
    if (currentDay > 1) {
      currentDay--;
      localStorage.setItem(`rambo_${currentProgram}_day`, currentDay);
      showDay(currentDay);
    }
  };
}

if (nextBtn) {
  nextBtn.onclick = () => {
    if (currentDay < totalDays) {
      currentDay++;
      localStorage.setItem(`rambo_${currentProgram}_day`, currentDay);
      showDay(currentDay);
    }
  };
}

// =========================
// CLOUD SAVE
// =========================
function saveToCloud(key, value) {
  if (!currentUser) return;

  db.collection("users")
    .doc(currentUser.uid)
    .set(
      { progress: { [getKey(key)]: value } },
      { merge: true }
    );
}

// =========================
// CLOUD LOAD
// =========================
function loadCloudData() {
  if (!currentUser) return;

  db.collection("users")
    .doc(currentUser.uid)
    .get()
    .then(doc => {
      if (!doc.exists) return;

      const data = doc.data().progress || {};

      Object.keys(data).forEach(k => {
        localStorage.setItem(k, data[k]);
      });

      showDay(currentDay);
    });
}

// =========================
// INIT SAFETY
// =========================
refreshProgram();
showLoggedOutUI();
