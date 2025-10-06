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

  apply() {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", this.primary);
    root.style.setProperty("--color-secondary", this.secondary);
    root.style.setProperty("--color-text", this.text);
    root.style.setProperty("--color-text-muted", this.textMuted);
    root.style.setProperty("--color-bg", this.bg);
    root.style.setProperty("--color-bg-primary", this.bgPrimary);
    root.style.setProperty("--color-bg-secondary", this.bgSecondary);
  }
}

function randomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

function PaletteController(palette) {
  this.palette = palette;
  this.inputs = {
    primary: document.getElementById("color-primary"),
    secondary: document.getElementById("color-secondary"),
    text: document.getElementById("color-text"),
    textMuted: document.getElementById("color-text-muted"),
    bg: document.getElementById("color-bg"),
    bgPrimary: document.getElementById("color-bg-primary"),
    bgSecondary: document.getElementById("color-bg-secondary"),
  };
  this.randomBtn = document.getElementById("generate-random");
  this.saveBtn = document.getElementById("savePaletteBtn");
}

PaletteController.prototype.init = function () {
  // Apply palette to page & inputs
  this.palette.apply();
  Object.entries(this.inputs).forEach(([key, input]) => {
    input.value = this.palette[key];
    // Live updates
    input.addEventListener("input", (e) => {
      this.palette[key] = e.target.value;
      this.palette.apply();
    });
  });

  // Random generator
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
    Object.entries(this.inputs).forEach(([key, input]) => {
      input.value = this.palette[key];
    });
  });

  // Save palette
  if (this.saveBtn) {
    this.saveBtn.addEventListener("click", () => {
      const savedPalettes = JSON.parse(localStorage.getItem("palettes")) || [];
      savedPalettes.push(this.palette);
      localStorage.setItem("palettes", JSON.stringify(savedPalettes));
      alert("Palette saved!");
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Load palette from saved.html if exists
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
    localStorage.removeItem("loadPalette"); // clear after loading
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
