// Represents a color palette with 7 customizable color roles
class Palette {
  constructor(primary, secondary, text, textMuted, bg, bgPrimary, bgSecondary) {
    this.primary = primary;           // Main accent color
    this.secondary = secondary;       // Secondary accent color
    this.text = text;                 // Primary text color
    this.textMuted = textMuted;       // Muted / subtle text color
    this.bg = bg;                     // Page background color
    this.bgPrimary = bgPrimary;       // Primary section background (e.g., header)
    this.bgSecondary = bgSecondary;   // Secondary section background (e.g., footer)
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
    Math.floor(Math.random() * 16777215) // 16777215 = FFFFFF in decimal
      .toString(16)
      .padStart(6, "0") // Ensures 6-character format
  );
}

// Controller to handle palette UI interactions
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

  this.randomBtn = document.getElementById("generate-random"); // Random palette button
  this.saveBtn = document.getElementById("savePaletteBtn");     // Save palette button
}

// Initialize UI and attach event listeners
PaletteController.prototype.init = function () {
  // Apply the current palette to the page and update input fields
  this.palette.apply();
  Object.entries(this.inputs).forEach(([key, input]) => {
    input.value = this.palette[key];

    // Live update color when user changes input
    input.addEventListener("input", (e) => {
      this.palette[key] = e.target.value;
      this.palette.apply();
    });
  });

  // Generate and apply a completely random palette
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

    // Update inputs to reflect new random palette
    Object.entries(this.inputs).forEach(([key, input]) => {
      input.value = this.palette[key];
    });
  });

  // Save current palette to localStorage
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
  // If user clicked "Load" on saved.html, retrieve that palette
  const loadData = JSON.parse(localStorage.getItem("loadPalette"));
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
    localStorage.removeItem("loadPalette"); // prevent auto-loading next time
  } else {
    // Default palette if nothing is loaded
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

  // Activate palette controller
  const controller = new PaletteController(defaultPalette);
  controller.init();
});
