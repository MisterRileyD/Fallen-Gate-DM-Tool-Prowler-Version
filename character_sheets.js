// character_sheets.js
// Loads all character sheet files listed in character_sheets/manifest.js.
// Each sheet file should call registerFallenGateCharacterSheet("CODE", { ...sheet data... });

(function () {
  window.FALLEN_GATE_CHARACTER_SHEETS = window.FALLEN_GATE_CHARACTER_SHEETS || {};

  window.registerFallenGateCharacterSheet = function (code, sheet) {
    const cleanCode = String(code || "").trim().toUpperCase();

    if (!cleanCode) {
      console.warn("Character sheet ignored because it has no code.", sheet);
      return;
    }

    window.FALLEN_GATE_CHARACTER_SHEETS[cleanCode] = sheet || {};
  };

  function loadSheetFile(src) {
    return new Promise(function (resolve) {
      const script = document.createElement("script");
      script.src = src;
      script.onload = function () { resolve({ src: src, ok: true }); };
      script.onerror = function () {
        console.warn("Could not load character sheet file:", src);
        resolve({ src: src, ok: false });
      };
      document.head.appendChild(script);
    });
  }

  window.loadFallenGateCharacterSheets = function () {
    const files = window.FALLEN_GATE_CHARACTER_SHEET_FILES || [];

    if (!Array.isArray(files) || files.length === 0) {
      return Promise.resolve([]);
    }

    return Promise.all(files.map(loadSheetFile));
  };

  const files = window.FALLEN_GATE_CHARACTER_SHEET_FILES || [];

  // When loaded from the page head, document.write keeps the files available
  // before the page's onload/init functions run.
  if (document.readyState === "loading" && Array.isArray(files) && files.length > 0) {
    files.forEach(function (src) {
      document.write('<script src="' + String(src).replaceAll('"', "%22") + '"><\\/script>');
    });
  }
})();
