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
let isLoggedIn = false;

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
// INIT UI
// =========================
window.addEventListener("load", () => {
  if (loadingScreen) loadingScreen.style.display = "flex";
  if (loginModal) loginModal.style.display = "none";
});

// =========================
// AUTH STATE
// =========================
auth.onAuthStateChanged(user => {
  currentUser = user;

  if (loadingScreen) loadingScreen.style.display = "none";

  if (user) {
    isLoggedIn = true;

    if (loginModal) loginModal.style.display = "none";

    refreshProgram();
    loadCloud();
    showDay(currentDay);

  } else {
    isLoggedIn = false;

    if (loginModal) loginModal.style.display = "flex";

    workoutContainer.innerHTML =
      `<div class="day-card"><h3>🔒 Login to view workouts</h3></div>`;

    authMessage.innerText = "Please log in to continue";
  }
});

// =========================
// SAFETY LOAD WORKOUTS
// =========================
function refreshProgram() {
  const w = window.workouts;
  const w4 = window.workouts4Day;

  if (currentProgram === "4day" && Array.isArray(w4)) {
    currentWorkouts = w4;
  } else if (Array.isArray(w)) {
    currentWorkouts = w;
  } else {
    console.error("Workout files not loaded correctly");
    currentWorkouts = [];
  }
}

// =========================
// SHOW DAY (SAFE VERSION)
// =========================
function showDay(day) {
  if (!isLoggedIn) return;

  const w = currentWorkouts?.[day - 1];

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

// =========================
// PROGRESS
// =========================
function updateProgress() {
  const boxes = document.querySelectorAll("input[type='checkbox']");
  let completed = 0;

  boxes.forEach(b => {
    localStorage.setItem(b.id, b.checked);
    if (b.checked) completed++;
  });

  const total = boxes.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("dashPercent").innerText = percent + "%";
  document.getElementById("dashCompleted").innerText =
    `${completed}/${total}`;
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
// LOGOUT
// =========================
function logout() {
  auth.signOut();
}

// =========================
// INIT
// =========================
refreshProgram();