// =========================
// SERVICE WORKER
// =========================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch(err => console.error("SW registration failed:", err));
}

// =========================
// DOM
// =========================
const workoutContainer = document.getElementById("workoutContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// =========================
// STATE
// =========================
let currentDay = parseInt(localStorage.getItem("currentDay")) || 1;
const totalDays = workouts.length;

// =========================
// COACH + MESSAGES
// =========================
const coachImage = "coach.png";

const motivationMessages = [
  "No excuses. Lock in.",
  "Discipline beats motivation every time.",
  "You don’t need to feel ready. Just start.",
  "One more rep than yesterday.",
  "Pain today, pride tomorrow.",
  "Comfort is where progress goes to die.",
  "You chose this. Now finish it.",
  "Earn it every single day.",
  "Your future self is built in silence.",
  "Stop waiting. Start working.",
  "Weak habits don’t build strong bodies.",
  "Push past what you think is your limit.",
  "Consistency creates transformation.",
  "Nobody is coming to do it for you.",
  "Every rep counts. Every set matters.",
  "Discipline is doing it anyway.",
  "You are stronger than your excuses.",
  "Small steps every day = big results.",
  "Stay hard. Stay focused.",
  "Don’t quit when it burns—push harder.",
  "Sore today, stronger tomorrow.",
  "Your body can stand almost anything—prove it.",
  "Work until your excuses disappear.",
  "The grind doesn’t lie.",
  "Make yourself proud.",
  "It’s supposed to be hard. That’s why it works.",
  "Your limits are lies you believe.",
  "Show up even when you don’t want to.",
  "Results come from what you do repeatedly.",
  "Train like your future depends on it.",
  "No shortcuts. Only discipline.",
  "Be better than yesterday you.",
  "Earn your rest.",
  "Sweat is just fat crying.",
  "Don’t stop until you’re proud."
];

const restMessages = [
  "Recovery builds the muscle, not the workout.",
  "Rest today. Come back stronger tomorrow.",
  "Your body is adapting—let it recover.",
  "Rest is part of the program, not a break from it.",
  "You don’t grow in the gym—you grow in recovery.",
  "Slow down today so you can level up tomorrow.",
  "Rest now. Dominate later.",
  "Muscles rebuild when you rest, not when you train.",
  "Even warriors need recovery days.",
  "Sleep, eat, recover—then repeat.",
  "Rest is discipline, not laziness.",
  "Let your body catch up to your effort.",
  "Today is for recovery. Tomorrow is for progress.",
  "You earned this rest. Take it seriously."
];

// =========================
// RENDER DAY
// =========================
function showDay(day) {
  workoutContainer.innerHTML = "";
  const w = workouts[day - 1];

  let exercisesHTML = "";

  w.exercises.forEach((ex, i) => {
    const id = `day${w.day}-ex${i}`;
    exercisesHTML += `
      <li>
        <input type="checkbox" id="${id}">
        <label for="${id}">${ex}</label>
      </li>
    `;
  });

  let motivationHTML = "";

  // WORKOUT DAY
  if (w.exercises.length > 0) {
    const msgIndex = (day - 1) % motivationMessages.length;

    motivationHTML = `
      <div class="motivation-card workout">
        <img src="${coachImage}" alt="coach" />
        <p>${motivationMessages[msgIndex]}</p>
      </div>
    `;
  }

  // REST DAY
  else {
    const restIndex = (day - 1) % restMessages.length;

    motivationHTML = `
      <div class="motivation-card rest">
        <div class="rest-icon">🛌</div>
        <p>${restMessages[restIndex]}</p>
      </div>
    `;
  }

  const card = document.createElement("div");
  card.classList.add("day-card");

  card.innerHTML = `
    ${motivationHTML}
    <h3>Day ${w.day} – ${w.title}</h3>
    <ul>${exercisesHTML}</ul>
  `;

  workoutContainer.appendChild(card);

  // Restore checkbox state
  const checkboxes = workoutContainer.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach(box => {
    if (localStorage.getItem(box.id) === "true") {
      box.checked = true;
    }
    box.addEventListener("change", updateProgress);
  });

  updateProgress();
}

// =========================
// PROGRESS + SAVE + CONFETTI
// =========================
function updateProgress() {
  const checkboxes = Array.from(document.querySelectorAll("input[type='checkbox']"));

  let checked = 0;

  checkboxes.forEach(box => {
    localStorage.setItem(box.id, box.checked);
    if (box.checked) checked++;
  });

  const total = checkboxes.length;
  const percent = total ? Math.round((checked / total) * 100) : 0;

  const progressBar = document.getElementById("progressBar");
  if (progressBar) progressBar.style.width = percent + "%";

  // =========================
  // CONFETTI LOGIC
  // =========================
  const currentWeekIndex = weeks.findIndex(week =>
    week.days.some(d => d.day === currentDay)
  );

  if (currentWeekIndex !== -1) {
    const currentWeek = weeks[currentWeekIndex];

    const workoutDays = currentWeek.days.filter(d => d.exercises.length > 0);

    if (workoutDays.length > 0) {
      const lastWorkoutDay = workoutDays[workoutDays.length - 1];

      const isLastWorkoutDay = currentDay === lastWorkoutDay.day;
      const allChecked = total > 0 && checked === total;

      const weekKey = `week${currentWeekIndex + 1}Complete`;

      if (isLastWorkoutDay && allChecked && !localStorage.getItem(weekKey)) {
        if (typeof confetti !== "undefined") {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        }

        alert(`Great job! Week ${currentWeekIndex + 1} complete!`);
        localStorage.setItem(weekKey, "true");
      }
    }
  }

  updateDashboard();
}

// =========================
// NAVIGATION
// =========================
prevBtn.addEventListener("click", () => {
  if (currentDay > 1) {
    currentDay--;
    localStorage.setItem("currentDay", currentDay);
    showDay(currentDay);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentDay < totalDays) {
    currentDay++;
    localStorage.setItem("currentDay", currentDay);
    showDay(currentDay);
  }
});

// =========================
// RESET
// =========================
document.getElementById("resetProgress").addEventListener("click", () => {
  if (confirm("Reset all progress?")) {
    localStorage.clear();
    currentDay = 1;
    localStorage.setItem("currentDay", currentDay);
    showDay(currentDay);
  }
});

// =========================
// DASHBOARD
// =========================
function updateDashboard() {
  const allBoxes = Array.from(document.querySelectorAll("input[type='checkbox']"));
  const checked = allBoxes.filter(b => b.checked).length;

  const percent = allBoxes.length
    ? Math.round((checked / allBoxes.length) * 100)
    : 0;

  const ring = document.querySelector(".progress");
  if (ring) {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = offset;
  }

  document.getElementById("dashDay").innerText = currentDay;
  document.getElementById("dashCompleted").innerText = `${checked}/${allBoxes.length}`;
  document.getElementById("dashPercent").innerText = percent + "%";

  let streak = parseInt(localStorage.getItem("streak")) || 0;

  if (percent === 100) {
    const last = parseInt(localStorage.getItem("lastCompleteDay")) || 0;

    if (currentDay === last + 1) streak++;
    else if (currentDay !== last) streak = 1;

    localStorage.setItem("streak", streak);
    localStorage.setItem("lastCompleteDay", currentDay);
  }

  document.getElementById("dashStreak").innerText = streak;

  const weekContainer = document.getElementById("dashWeeks");
  if (weekContainer) {
    weekContainer.innerHTML = "";

    weeks.forEach((_, i) => {
      const key = `week${i + 1}Complete`;
      const done = localStorage.getItem(key) === "true";

      const div = document.createElement("div");
      div.innerText = `Week ${i + 1}: ${done ? "✅" : "❌"}`;
      weekContainer.appendChild(div);
    });
  }
}

// =========================
// INIT
// =========================
showDay(currentDay);
updateDashboard();