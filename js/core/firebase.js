(function () {
  const firebaseConfig = {
    apiKey: 'AIzaSyARCnBdNuUfPNtZ_otEn-MWpktzShD_NWE',
    authDomain: 'rambofitness-81303.firebaseapp.com',
    projectId: 'rambofitness-81303',
    storageBucket: 'rambofitness-81303.firebasestorage.app',
    messagingSenderId: '3674488945',
    appId: '1:3674488945:web:58e907ce543b1b87bbdbd0'
  };

  function initFirebase() {
    if (window.firebase) {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }

      window.RamboFirebase = {
        auth: firebase.auth(),
        db: firebase.firestore(),
        ready: true
      };
    } else {
      window.RamboFirebase = {
        auth: null,
        db: null,
        ready: false
      };
    }
  }

  initFirebase();
})();
