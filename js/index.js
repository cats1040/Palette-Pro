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
    const root = document.documentElement; // <html> element
    root.style.setProperty("--color-primary", this.primary); // Set CSS variable
    root.style.setProperty("--color-secondary", this.secondary);
    root.style.setProperty("--color-text-muted", this.textMuted);
    root.style.setProperty("--color-bg", this.bg);
    root.style.setProperty("--color-bg-primary", this.bgPrimary);
    root.style.setProperty("--color-bg-secondary", this.bgSecondary);
  }
}

// ======================
//  Generate Random Color
// ======================
// Returns a random hex color string like "#a1b2c3"
function randomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215) // Random integer for 24-bit color
      .toString(16) // Convert to hexadecimal
      .padStart(6, "0") // Ensure 6 digits
  );
}

// ======================
//  Palette Controller
// ======================
// Handles UI interactions for palette editing and storage
function PaletteController(palette) {
  this.palette = palette; // Current Palette instance

  // Input fields mapped to each color role
  this.inputs = {
    primary: document.getElementById("color-primary"),
    secondary: document.getElementById("color-secondary"),
    textMuted: document.getElementById("color-text-muted"),
    bg: document.getElementById("color-bg"),
    bgPrimary: document.getElementById("color-bg-primary"),
    bgSecondary: document.getElementById("color-bg-secondary"),
  };

  this.randomBtn = document.getElementById("generate-random"); // Randomize button
  this.saveBtn = document.getElementById("savePaletteBtn"); // Save button
}

// ======================
//  Initialize UI & Event Listeners
// ======================
PaletteController.prototype.init = function () {
  this.palette.apply(); // Apply initial colors

  // ----------------------
  // Live update inputs
  // ----------------------
  Object.entries(this.inputs).forEach(([key, input]) => {
    input.value = this.palette[key]; // Set initial input value
    input.addEventListener("input", (e) => {
      this.palette[key] = e.target.value; // Update palette property
      this.palette.apply(); // Update CSS variables
      // Save current palette in sessionStorage (tab-only)
      sessionStorage.setItem("currentPalette", JSON.stringify(this.palette));
    });
  });

  // ----------------------
  // Random palette generation
  // ----------------------
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

    // Update input fields to reflect new random palette
    Object.entries(this.inputs).forEach(([key, input]) => {
      input.value = this.palette[key];
    });
  });

  // ----------------------
  // Save palette permanently in localStorage
  // ----------------------
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
  // Load palette from saved.html redirect or from current session
  const loadData = JSON.parse(localStorage.getItem("loadPalette"));
  const savedCurrent = JSON.parse(sessionStorage.getItem("currentPalette")); // Session-only

  // Default palette
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
    // Apply palette loaded from saved.html
    paletteToUse = new Palette(
      loadData.primary,
      loadData.secondary,
      loadData.textMuted,
      loadData.bg,
      loadData.bgPrimary,
      loadData.bgSecondary
    );
    sessionStorage.setItem("currentPalette", JSON.stringify(paletteToUse));
    localStorage.removeItem("loadPalette"); // Clean up temporary storage
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
    // No previous palette → use default
    paletteToUse = defaultPalette;
  }

  // Initialize controller with selected palette
  const controller = new PaletteController(paletteToUse);
  controller.init();
});

// ======================
//  Toggle Color Picker Section
// ======================
document.getElementById("toggle-picker").addEventListener("click", () => {
  const pickerSection = document.querySelector(".color-picker");
  // Show or hide the color picker section
  pickerSection.style.display =
    pickerSection.style.display === "none" ? "block" : "none";
});

// ======================
//  Navigation Menu Toggle (Mobile)
// ======================
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle"); // Hamburger button
  const navLinks = document.querySelector(".nav-links"); // Navigation menu

  // Toggle menu visibility on click
  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  // Close menu if clicking outside
  document.addEventListener("click", (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove("show");
    }
  });
});
