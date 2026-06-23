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

let currentWorkouts = currentProgram === "4day" ? workouts4Day : workouts;

let currentDay = 1;

// =========================
// ELEMENTS
// =========================
const workoutContainer = document.getElementById("workoutContainer");
const authMessage = document.getElementById("authMessage");

// =========================
// AUTH STATE
// =========================
auth.onAuthStateChanged(user => {
  currentUser = user;

  if (user) {
    isLoggedIn = true;
    document.getElementById("loginModal").style.display = "none";
    loadCloud();
    showDay(currentDay);
  } else {
    isLoggedIn = false;
    workoutContainer.innerHTML =
      `<div class="day-card"><h3>🔒 Login to view workouts</h3></div>`;
    authMessage.innerText = "Please log in to continue";
  }
});

// =========================
// LOGIN / LOGOUT
// =========================
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    document.getElementById("loginStatus").innerText =
      "Please enter email and password";
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("loginStatus").innerText = "Logged in!";
    })
    .catch(err => {
      document.getElementById("loginStatus").innerText = err.message;
    });
}

function logout() {
  auth.signOut();
}

// =========================
// PROGRAM
// =========================
function refreshProgram() {
  currentWorkouts = currentProgram === "4day" ? workouts4Day : workouts;
}

document.getElementById("programSelect").addEventListener("change", e => {
  currentProgram = e.target.value;
  localStorage.setItem("currentProgram", currentProgram);

  refreshProgram();
  currentDay = 1;
  showDay(currentDay);
});

// =========================
// SCROLL
// =========================
function scrollToWorkouts() {
  document.getElementById("workouts")
    .scrollIntoView({ behavior: "smooth" });
}

// =========================
// RENDER
// =========================
function showDay(day) {
  if (!isLoggedIn) return;

  const w = currentWorkouts[day - 1];
  workoutContainer.innerHTML = "";

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

  document.querySelectorAll("input[type='checkbox']").forEach(box => {
    box.addEventListener("change", updateProgress);
  });

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
// NAV
// =========================
document.getElementById("prevBtn").onclick = () => {
  if (!isLoggedIn) return;
  if (currentDay > 1) showDay(--currentDay);
};

document.getElementById("nextBtn").onclick = () => {
  if (!isLoggedIn) return;
  if (currentDay < currentWorkouts.length) showDay(++currentDay);
};

// =========================
// RESET
// =========================
document.getElementById("resetProgress").onclick = () => {
  if (!confirm("Reset progress?")) return;

  Object.keys(localStorage).forEach(k => {
    if (k.includes("-e")) localStorage.removeItem(k);
  });

  showDay(currentDay);
};

// =========================
// CLOUD SAVE
// =========================
function saveCloud(key, value) {
  if (!currentUser) return;

  db.collection("users").doc(currentUser.uid).set({
    [key]: value
  }, { merge: true });
}

function loadCloud() {
  if (!currentUser) return;

  db.collection("users").doc(currentUser.uid).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();

        Object.keys(data).forEach(k => {
          localStorage.setItem(k, data[k]);
        });

        showDay(currentDay);
      }
    });
}

// =========================
// INIT
// =========================
refreshProgram();
