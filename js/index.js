// Represents a color palette with 7 customizable color roles
class Palette {
  constructor(primary, secondary, text, textMuted, bg, bgPrimary, bgSecondary) {
    this.primary = primary;
    this.secondary = secondary;
    this.text = text;
    this.textMuted = textMuted;
    this.bg = bg;
    this.bgPrimary = bgPrimary;
    this.bgSecondary = bgSecondary;
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

// Generates a random hex color (e.g., "#a1b2c3")
function randomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

// Controller to handle palette UI interactions
function PaletteController(palette) {
  this.palette = palette;

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

  // For every input change, update palette & save to localStorage
  Object.entries(this.inputs).forEach(([key, input]) => {
    input.value = this.palette[key];
    input.addEventListener("input", (e) => {
      this.palette[key] = e.target.value;
      this.palette.apply();
      localStorage.setItem("currentPalette", JSON.stringify(this.palette)); // ✅ Persistent save
    });
  });

  // Generate completely random palette
  this.randomBtn.addEventListener("click", () => {
    this.palette = new Palette(
      randomColor(),
      randomColor(),
      randomColor(),
      randomColor(),
      randomColor(),
      randomColor(),
      randomColor()
    );
    this.palette.apply();
    localStorage.setItem("currentPalette", JSON.stringify(this.palette)); // ✅ Save random palette

    Object.entries(this.inputs).forEach(([key, input]) => {
      input.value = this.palette[key];
    });
  });

  // Save to saved palettes list
  if (this.saveBtn) {
    this.saveBtn.addEventListener("click", () => {
      const savedPalettes = JSON.parse(localStorage.getItem("palettes")) || [];
      savedPalettes.push(this.palette);
      localStorage.setItem("palettes", JSON.stringify(savedPalettes));
      alert("Palette saved!");
    });
  }
};

// Initialize page when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const loadData = JSON.parse(localStorage.getItem("loadPalette"));
  const savedCurrent = JSON.parse(localStorage.getItem("currentPalette"));
  let defaultPalette;

  if (loadData) {
    defaultPalette = new Palette(
      loadData.primary,
      loadData.secondary,
      loadData.text,
      loadData.textMuted,
      loadData.bg,
      loadData.bgPrimary,
      loadData.bgSecondary
    );
    localStorage.setItem("currentPalette", JSON.stringify(defaultPalette)); // ✅ Make loaded palette persistent
    localStorage.removeItem("loadPalette");
  } else if (savedCurrent) {
    defaultPalette = new Palette(
      savedCurrent.primary,
      savedCurrent.secondary,
      savedCurrent.text,
      savedCurrent.textMuted,
      savedCurrent.bg,
      savedCurrent.bgPrimary,
      savedCurrent.bgSecondary
    );
  } else {
    defaultPalette = new Palette(
      "#3b4050",
      "#a59678",
      "#3b4050",
      "#6f737f",
      "#ffffff",
      "#3b4050",
      "#2e323f"
    );
  }

  const controller = new PaletteController(defaultPalette);
  controller.init();
});

// Toggle color picker
document.getElementById("toggle-picker").addEventListener("click", () => {
  const pickerSection = document.querySelector(".color-picker");
  pickerSection.style.display =
    pickerSection.style.display === "none" ? "block" : "none";
});
