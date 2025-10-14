// ======================
//  Palette Class
// ======================
// Represents a color palette with 6 customizable color roles
class Palette {
  constructor(primary, secondary, textMuted, bg, bgPrimary, bgSecondary) {
    this.primary = primary; // Main accent color
    this.secondary = secondary; // Secondary accent color
    this.textMuted = textMuted; // Muted / subtle text color
    this.bg = bg; // Page background color
    this.bgPrimary = bgPrimary; // Primary section background (e.g., header)
    this.bgSecondary = bgSecondary; // Secondary section background (e.g., footer)
  }

  // Applies the palette colors to CSS variables in :root
  apply() {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", this.primary);
    root.style.setProperty("--color-secondary", this.secondary);
    root.style.setProperty("--color-text-muted", this.textMuted);
    root.style.setProperty("--color-bg", this.bg);
    root.style.setProperty("--color-bg-primary", this.bgPrimary);
    root.style.setProperty("--color-bg-secondary", this.bgSecondary);
  }
}

// Generates a random hex color
function randomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

// ======================
//  Palette Controller
// ======================
function PaletteController(palette) {
  this.palette = palette;

  // Input fields mapped by color role
  this.inputs = {
    primary: document.getElementById("color-primary"),
    secondary: document.getElementById("color-secondary"),
    textMuted: document.getElementById("color-text-muted"),
    bg: document.getElementById("color-bg"),
    bgPrimary: document.getElementById("color-bg-primary"),
    bgSecondary: document.getElementById("color-bg-secondary"),
  };

  this.randomBtn = document.getElementById("generate-random");
  this.saveBtn = document.getElementById("savePaletteBtn");
}

// Initialize UI and attach event listeners
PaletteController.prototype.init = function () {
  this.palette.apply();

  // Live update & store in sessionStorage for current tab only
  Object.entries(this.inputs).forEach(([key, input]) => {
    input.value = this.palette[key];
    input.addEventListener("input", (e) => {
      this.palette[key] = e.target.value;
      this.palette.apply();
      sessionStorage.setItem("currentPalette", JSON.stringify(this.palette)); // Tab-only
    });
  });

  // Generate random palette
  this.randomBtn.addEventListener("click", () => {
    this.palette = new Palette(
      randomColor(),
      randomColor(),
      randomColor(),
      randomColor(),
      randomColor(),
      randomColor()
    );
    this.palette.apply();
    sessionStorage.setItem("currentPalette", JSON.stringify(this.palette));

    Object.entries(this.inputs).forEach(([key, input]) => {
      input.value = this.palette[key];
    });
  });

  // Save permanently using localStorage
  if (this.saveBtn) {
    this.saveBtn.addEventListener("click", () => {
      const savedPalettes = JSON.parse(localStorage.getItem("palettes")) || [];
      savedPalettes.push(this.palette);
      localStorage.setItem("palettes", JSON.stringify(savedPalettes));
      alert("Palette saved permanently!");
    });
  }
};

// ======================
//  Initialization Logic
// ======================
document.addEventListener("DOMContentLoaded", () => {
  const loadData = JSON.parse(localStorage.getItem("loadPalette"));
  const savedCurrent = JSON.parse(sessionStorage.getItem("currentPalette")); // Session-only
  let defaultPalette = new Palette(
    "#3b4050",
    "#a59678",
    "#6f737f",
    "#ffffff",
    "#3b4050",
    "#2e323f"
  );

  let paletteToUse;

  if (loadData) {
    // Apply loaded palette from saved.html
    paletteToUse = new Palette(
      loadData.primary,
      loadData.secondary,
      loadData.textMuted,
      loadData.bg,
      loadData.bgPrimary,
      loadData.bgSecondary
    );
    sessionStorage.setItem("currentPalette", JSON.stringify(paletteToUse));
    localStorage.removeItem("loadPalette"); // cleanup
  } else if (savedCurrent) {
    // Restore last session palette in the same tab
    paletteToUse = new Palette(
      savedCurrent.primary,
      savedCurrent.secondary,
      savedCurrent.textMuted,
      savedCurrent.bg,
      savedCurrent.bgPrimary,
      savedCurrent.bgSecondary
    );
  } else {
    // Fresh tab or no session → default palette
    paletteToUse = defaultPalette;
  }

  const controller = new PaletteController(paletteToUse);
  controller.init();
});

// Toggle color picker visibility
document.getElementById("toggle-picker").addEventListener("click", () => {
  const pickerSection = document.querySelector(".color-picker");
  pickerSection.style.display =
    pickerSection.style.display === "none" ? "block" : "none";
});
