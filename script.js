if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch(err => console.error("SW registration failed:", err));
}
// Track current week/day
let currentWeek = parseInt(localStorage.getItem("currentWeek")) || 0;
let currentDayIndex = parseInt(localStorage.getItem("currentDayIndex")) || 0;
let absoluteDay = parseInt(localStorage.getItem("absoluteDay")) || 0;

// Scroll to workouts
function scrollToWorkouts() {
  document.getElementById("workouts").scrollIntoView({ behavior: "smooth" });
}

// Render current day
function renderWorkout() {
  const container = document.getElementById("workoutContainer");
  container.classList.add("fade-exit");

  setTimeout(() => {
    container.innerHTML = "";
    const day = weeks[currentWeek].days[currentDayIndex];

    const card = document.createElement("div");
    card.classList.add("day-card");

    // Highlight today if active
    if(day.exercises.length > 0) {
      card.classList.add("today");
    }

    let exerciseHTML = "";
    day.exercises.forEach((exercise, index) => {
      const id = `day${day.day}-ex${index}`;
      const checked = localStorage.getItem(id) === "true";
      exerciseHTML += `
        <li>
          <input type="checkbox" id="${id}" ${checked ? "checked" : ""}>
          <label for="${id}">${exercise}</label>
        </li>
      `;
    });

    card.innerHTML = `
      <h3>Day ${day.day} – ${day.title}</h3>
      <ul>${exerciseHTML}</ul>
      <button onclick="completeWorkout()">Complete Day</button>
    `;

    container.appendChild(card);
    attachCheckboxListeners();
    updateProgress();

    container.classList.remove("fade-exit");
    container.classList.add("fade-enter");
    setTimeout(() => container.classList.remove("fade-enter"), 500);

  }, 200);
}

// Checkbox listeners
function attachCheckboxListeners() {
  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach(box => {
    box.addEventListener("change", () => {
      localStorage.setItem(box.id, box.checked);
      updateProgress();
    });
  });
}

// Navigation
function nextDay() {
  if(currentDayIndex < weeks[currentWeek].days.length - 1) {
    currentDayIndex++;
  } else {
    currentWeek++;
    currentDayIndex = 0;
    if(currentWeek >= weeks.length) currentWeek = 0; // Loop weeks
  }
  saveCurrentPosition();
  renderWorkout();
}

function saveCurrentPosition() {
  localStorage.setItem("currentWeek", currentWeek);
  localStorage.setItem("currentDayIndex", currentDayIndex);
  localStorage.setItem("absoluteDay", absoluteDay);
}

// Complete workout
function completeWorkout() {
  const day = weeks[currentWeek].days[currentDayIndex];
  const isActiveWorkout = day.exercises.length > 0;

  if(isActiveWorkout) {
    absoluteDay++;
    localStorage.setItem("absoluteDay", absoluteDay);
  }

  // Move to next day
  nextDay();

  // Trigger weekly message/confetti after 5 active workouts in this week
  const activeCount = weeks[currentWeek].days
    .slice(0, currentDayIndex + 1)
    .filter(d => d.exercises.length > 0).length;

  if(isActiveWorkout && activeCount % 5 === 0) {
    showWeeklyMessage(currentWeek);
  }
}

// Weekly message + confetti
function showWeeklyMessage(weekNum) {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ff3c00', '#ff6b3c', '#ffd700']
  });

  const message = document.createElement("div");
  message.classList.add("weekly-message");
  message.innerText = `🎉 Week ${weekNum + 1} Complete! You crushed 5 workouts! 💪`;

  const workoutsSection = document.getElementById("workouts");
  workoutsSection.insertBefore(message, workoutsSection.firstChild);

  setTimeout(() => {
    message.style.opacity = 0;
    setTimeout(() => message.remove(), 500);
  }, 4000);
}

// Progress bar
function updateProgress() {
  const totalDays = weeks.flatMap(w => w.days).filter(d => d.exercises.length > 0).length;
  const completedDays = weeks.flatMap(w => w.days).filter(d =>
    d.exercises.every((_, i) => localStorage.getItem(`day${d.day}-ex${i}`) === "true")
  ).length;

  const percent = (completedDays / totalDays) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

// INITIAL RENDER
renderWorkout();