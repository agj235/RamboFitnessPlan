(function () {
  const viewMap = {
    home: document.getElementById("home"),
    training: document.getElementById("training"),
    strength: document.getElementById("strength"),
    progress: document.getElementById("progress"),
    settings: document.getElementById("settings")
  };

  function setActiveView(viewName) {
    Object.entries(viewMap).forEach(([key, view]) => {
      view?.classList.toggle("active", key === viewName);
    });

    document.querySelectorAll(".nav-btn").forEach((button) => {
      button.classList.toggle("active", button.dataset.view === viewName);
    });

   const url = new URL(window.location.href);
    url.hash = viewName === "home" ? "" : viewName;
    history.replaceState({ view: viewName }, "", url);
  }

  function initNavigation() {
    document.querySelectorAll(".nav-btn").forEach((button) => {
      button.addEventListener("click", () => setActiveView(button.dataset.view));
    });

    const initialView = (window.location.hash || "").replace("#", "") || "home";
    setActiveView(viewMap[initialView] ? initialView : "home");
  }

  window.appNavigation = {
    initNavigation,
    setActiveView
  };
})();
