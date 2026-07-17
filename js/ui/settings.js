(function () {
  function openAbout() {
    window.RamboUtils?.showModal('aboutModal', true);
  }

  function closeAbout() {
    window.RamboUtils?.showModal('aboutModal', false);
  }

  function open1RMModal() {
    window.RamboUtils?.showModal('rmModal', true);
  }

  function close1RMModal() {
    window.RamboUtils?.showModal('rmModal', false);
  }

  function calculate1RM() {
    const oneRM = Number(window.RamboUtils?.getEl('rmInput')?.value);
    const results = window.RamboUtils?.getEl('rmResults');

    if (!oneRM || oneRM <= 0) {
      if (results) results.innerHTML = '<p>Enter a valid number</p>';
      return;
    }

    const percents = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    results.innerHTML = percents.map((percent) => {
      const value = Math.round(oneRM * percent / 100);
      return `<div class="rm-row"><span>${percent}%</span><span>${value} lbs</span></div>`;
    }).join('');
  }

  function scrollToWorkouts() {
    const node = window.RamboUtils?.getEl('workouts');
    if (node) {
      node.scrollIntoView({ behavior: 'smooth' });
    }
  }

  window.RamboSettings = {
    openAbout,
    closeAbout,
    open1RMModal,
    close1RMModal,
    calculate1RM,
    scrollToWorkouts
  };
})();
