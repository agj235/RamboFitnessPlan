// Service Worker registration for PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch(err => console.error("SW registration failed:", err));
}

// DOM references
const workoutContainer = document.getElementById("workoutContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentDay = 1;
const totalDays = workouts.length;

// Render a single day
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

  const card = document.createElement("div");
  card.classList.add("day-card");
  card.innerHTML = `<h3>Day ${w.day} – ${w.title}</h3>
                    <ul>${exercisesHTML}</ul>`;
  workoutContainer.appendChild(card);

  // Restore checkbox state
  const checkboxes = workoutContainer.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach(box => {
    if (localStorage.getItem(box.id) === "true") box.checked = true;
    box.addEventListener("change", updateProgress);
  });

  updateProgress();
}

// Update progress bar & weekly confetti
function updateProgress() {
  const total = document.querySelectorAll("input[type='checkbox']").length;
  const checked = document.querySelectorAll("input[type='checkbox']:checked").length;
  const percent = total === 0 ? 0 : (checked / total) * 100;
  document.getElementById("progressBar").style.width = percent + "%";

  // Weekly confetti + message every 5 days
  const week = Math.ceil(currentDay / 5);
  if (currentDay % 5 === 0 && !localStorage.getItem(`week${week}Complete`)) {
    if (typeof confetti !== "undefined") {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    alert(`Great job! Week ${week} complete!`);
    localStorage.setItem(`week${week}Complete`, true);
  }
}

// Navigation buttons
prevBtn.addEventListener("click", () => {
  if (currentDay > 1) {
    currentDay--;
    showDay(currentDay);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentDay < totalDays) {
    currentDay++;
    showDay(currentDay);
  }
});

// Reset Progress button
const resetBtn = document.getElementById("resetProgress");

resetBtn.addEventListener("click", () => {
  const confirmReset = confirm("Are you sure you want to reset all progress? This cannot be undone.");
  if (confirmReset) {
    localStorage.clear();
    showDay(currentDay); // reload current day
    alert("Progress has been reset! Start fresh.");
  }
});

// Scroll to workouts section
function scrollToWorkouts() {
  document.getElementById("workouts").scrollIntoView({ behavior: "smooth" });
}

// Initialize first day
showDay(currentDay);