(function () {
  let deferredInstallPrompt = null;

  function isIos() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  }

  function isInStandaloneMode() {
    return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
  }

  function updateOfflineBanner() {
    const offlineBanner = window.RamboUtils?.getEl('offlineBanner');
    if (!offlineBanner) return;
    const offline = !navigator.onLine;
    offlineBanner.classList.toggle('hidden', !offline);
  }

  function showIosInstallHint() {
    const banner = window.RamboUtils?.getEl('iosInstallBanner');
    const dismiss = window.RamboUtils?.getEl('dismissIosBanner');
    if (!banner) return;
    if (isIos() && !isInStandaloneMode() && !window.localStorage.getItem('iosInstallHintDismissed')) {
      banner.classList.remove('hidden');
    }
    if (dismiss) {
      dismiss.addEventListener('click', () => {
        banner.classList.add('hidden');
        window.localStorage.setItem('iosInstallHintDismissed', 'true');
      });
    }
  }

  function showToast(id) {
    const toast = window.RamboUtils?.getEl(id);
    if (!toast) return;
    toast.classList.remove('hidden');
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    const hide = () => {
      toast.classList.add('hidden');
      toast.style.opacity = '';
      toast.style.transform = '';
    };
    window.setTimeout(hide, 6000);
  }

  function initializePwaInstall() {
    const installBtn = window.RamboUtils?.getEl('installBtn');
    const dismissInstallBtn = window.RamboUtils?.getEl('dismissInstallBtn');
    const pwaPrompt = window.RamboUtils?.getEl('pwaPrompt');

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      if (navigator.onLine && pwaPrompt) {
        pwaPrompt.classList.remove('hidden');
      }
    });

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        const result = await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        if (pwaPrompt) pwaPrompt.classList.add('hidden');
        if (result.outcome === 'accepted') {
          showToast('completionToast');
        }
      });
    }

    if (dismissInstallBtn) {
      dismissInstallBtn.addEventListener('click', () => {
        if (pwaPrompt) pwaPrompt.classList.add('hidden');
      });
    }
  }

  function updateHomeSummary() {
    const homeTitle = window.RamboUtils?.getEl('homeResumeTitle');
    const homeText = window.RamboUtils?.getEl('homeResumeText');
    const streakText = window.RamboUtils?.getEl('dashStreak');
    const intensityBadge = window.RamboUtils?.getEl('dayIntensity');
    const prevBtn = window.RamboUtils?.getEl('prevBtn');
    const nextBtn = window.RamboUtils?.getEl('nextBtn');
    const currentDay = window.RamboAppState?.currentDay || 1;

    if (homeTitle) {
      homeTitle.textContent = `Day ${currentDay} is ready to conquer`;
    }
    if (homeText) {
      homeText.textContent = `Continue your ${window.RamboAppState?.currentProgram === '4day' ? '4-day' : '5-day'} plan and lock in your training.`;
    }
    if (streakText) {
      streakText.textContent = `${window.RamboUtils?.getStorage('streakDays', 0)} days`;
    }
    if (intensityBadge) {
      intensityBadge.textContent = currentDay % 2 === 0 ? 'Recovery day' : 'Power day';
    }
    if (prevBtn) {
      prevBtn.disabled = currentDay === 1;
    }
    if (nextBtn) {
      nextBtn.disabled = currentDay === (window.RamboTraining?.getActiveWorkouts()?.length || 5);
    }
  }

  function initApp() {
    const splash = window.RamboUtils?.getEl('splash');
    const resetBtn = window.RamboUtils?.getEl('resetProgress');
    const markAllDoneBtn = window.RamboUtils?.getEl('markAllDoneBtn');

    if (resetBtn) {
      resetBtn.addEventListener('click', () => window.RamboProgress?.resetProgress());
    }
    if (markAllDoneBtn) {
      markAllDoneBtn.addEventListener('click', () => {
        document.querySelectorAll('#workoutContainer input[type="checkbox"]').forEach((box) => {
          box.checked = true;
          localStorage.setItem(box.id, 'true');
        });
        window.RamboProgress?.updateProgress();
        window.RamboTraining?.renderWorkouts();
        window.updateHomeSummary?.();
      });
    }

    window.RamboTraining?.initTraining();
    window.RamboAuth?.initAuth();
    window.RamboStrength?.loadStrengthHistory?.();

    const loginModal = window.RamboUtils?.getEl('loginModal');
    if (loginModal) {
      loginModal.style.display = 'flex';
      loginModal.classList.add('active');
    }

    updateOfflineBanner();
    updateHomeSummary();
    initializePwaInstall();
    showIosInstallHint();

    window.addEventListener('online', updateOfflineBanner);
    window.addEventListener('offline', updateOfflineBanner);

    const completionClose = window.RamboUtils?.getEl('completionCloseBtn');
    if (completionClose) {
      completionClose.addEventListener('click', () => {
        const toast = window.RamboUtils?.getEl('completionToast');
        if (toast) toast.classList.add('hidden');
      });
    }

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        ['loginModal', 'aboutModal', 'strengthAboutModal', 'rmModal'].forEach((id) => {
          window.RamboUtils?.showModal(id, false);
        });
      }
    });

    document.querySelectorAll('.modal').forEach((modal) => {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      });
    });

    setTimeout(() => {
      if (splash) splash.classList.add('hidden');
    }, 1200);

    window.appNavigation?.initNavigation();
  }

  document.addEventListener('DOMContentLoaded', initApp);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch((error) => {
        console.warn('Service worker registration failed:', error);
      });
    });
  }

  window.appController = {
    login: window.RamboAuth?.login,
    register: window.RamboAuth?.register,
    resetPassword: window.RamboAuth?.resetPassword,
    logout: window.RamboAuth?.logout,
    closeLogin: () => window.RamboUtils?.showModal('loginModal', false),
    openAbout: window.RamboSettings?.openAbout,
    closeAbout: window.RamboSettings?.closeAbout,
    open1RM: window.RamboSettings?.open1RMModal,
    close1RM: window.RamboSettings?.close1RMModal,
    calculate1RM: window.RamboSettings?.calculate1RM,
    setView: window.appNavigation?.setActiveView
  };

  window.login = window.appController.login;
  window.logout = window.appController.logout;
  window.register = window.appController.register;
  window.scrollToWorkouts = window.RamboSettings?.scrollToWorkouts;
  window.updateHomeSummary = updateHomeSummary;
})();
