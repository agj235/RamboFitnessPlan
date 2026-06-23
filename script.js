// =========================
// LOGIN UI CONTROL
// =========================
const loginModal = document.getElementById("loginModal");
const loginStatus = document.getElementById("loginStatus");

// =========================
// FIREBASE AUTH STATE
// =========================
auth.onAuthStateChanged(user => {
  currentUser = user;

  if (user) {
    isLoggedIn = true;
    loginModal.style.display = "none";
    loadCloudData();
    showDay(currentDay);
  } else {
    isLoggedIn = false;
    loginModal.style.display = "flex";

    workoutContainer.innerHTML = `
      <div class="day-card">
        <h3>🔒 Login required to access workouts</h3>
      </div>
    `;
  }
});