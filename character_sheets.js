// character_sheets.js
// Safe Fallen Gate character sheet loader.
// Put sheet files beside index.html and list them in character_sheets_manifest.js.
// Example in character_sheets_manifest.js:
// window.FALLEN_GATE_CHARACTER_SHEET_FILES = ["./Thy_Prowler.js"];

(function () {
  window.FALLEN_GATE_CHARACTER_SHEETS = window.FALLEN_GATE_CHARACTER_SHEETS || {};
  window.FALLEN_GATE_CHARACTER_SHEET_FILES = window.FALLEN_GATE_CHARACTER_SHEET_FILES || [];
  window.FALLEN_GATE_CHARACTER_SHEETS_READY = false;

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
      script.src = src + (src.includes("?") ? "&" : "?") + "v=" + Date.now();
      script.onload = function () {
        resolve({ src: src, ok: true });
      };
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
      window.FALLEN_GATE_CHARACTER_SHEETS_READY = true;
      window.dispatchEvent(new CustomEvent("fallenGateCharacterSheetsReady"));
      return Promise.resolve([]);
    }

    return Promise.all(files.map(loadSheetFile)).then(function (results) {
      window.FALLEN_GATE_CHARACTER_SHEETS_READY = true;
      window.dispatchEvent(new CustomEvent("fallenGateCharacterSheetsReady"));
      return results;
    });
  };

  function startLoadingSheets() {
    if (window.__fallenGateCharacterSheetsLoadingStarted) return;
    window.__fallenGateCharacterSheetsLoadingStarted = true;
    window.loadFallenGateCharacterSheets();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startLoadingSheets);
  } else {
    startLoadingSheets();
  }
})();


// ------------------------------------------------------------
// ONE-FILE FALLBACK OPTION
// Paste generated registerFallenGateCharacterSheet(...) code below this line
// if you do not want separate character sheet files.
