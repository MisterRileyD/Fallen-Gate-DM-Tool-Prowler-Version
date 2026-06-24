// character_sheets.js
// Loads character sheet files listed in character_sheets_manifest.js.
// Each sheet file should call registerFallenGateCharacterSheet("CODE", {...}).

(function () {
  window.FALLEN_GATE_CHARACTER_SHEETS = window.FALLEN_GATE_CHARACTER_SHEETS || {};

  window.registerFallenGateCharacterSheet = function (code, sheet) {
    const cleanCode = String(code || "").trim().toUpperCase();

    if (!cleanCode) {
      console.warn("Character sheet ignored because it has no code.", sheet);
      return;
    }

    window.FALLEN_GATE_CHARACTER_SHEETS[cleanCode] = sheet || {};
    window.dispatchEvent(new CustomEvent("fallenGateCharacterSheetsReady"));
  };

  function safeSrc(src) {
    return String(src || "").replaceAll('"', "%22").replaceAll("<", "%3C").replaceAll(">", "%3E");
  }

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
      window.dispatchEvent(new CustomEvent("fallenGateCharacterSheetsReady"));
      return Promise.resolve([]);
    }

    return Promise.all(files.map(loadSheetFile)).then(function (results) {
      window.dispatchEvent(new CustomEvent("fallenGateCharacterSheetsReady"));
      return results;
    });
  };

  const files = window.FALLEN_GATE_CHARACTER_SHEET_FILES || [];

  // If the page is still loading, document.write loads sheet files before body onload.
  // This makes Add Sheet Code work immediately.
  if (document.readyState === "loading" && Array.isArray(files) && files.length > 0) {
    files.forEach(function (src) {
      document.write('<script src="' + safeSrc(src) + '"><\/script>');
    });
    setTimeout(function () {
      window.dispatchEvent(new CustomEvent("fallenGateCharacterSheetsReady"));
    }, 0);
  } else {
    window.loadFallenGateCharacterSheets();
  }
})();
