// Select the container where saved palettes will be displayed
const container = document.querySelector(".saved-palettes");

// ======================
//  Default Palette
// ======================
// Defines a default palette with 6 color roles
const DEFAULT_PALETTE = {
  primary: "#3b4050", // Main accent color
  secondary: "#a59678", // Secondary accent color
  textMuted: "#6f737f", // Muted text color
  bg: "#ffffff", // Page background color
  bgPrimary: "#3b4050", // Primary section background
  bgSecondary: "#2e323f", // Secondary section background
};

// ======================
//  Load Saved Palettes
// ======================
// Loads saved palettes from localStorage and renders them on the page
function loadSavedPalettes() {
  // Get saved palettes from localStorage or fallback to empty array
  const palettes = JSON.parse(localStorage.getItem("palettes")) || [];

  // Clear the container before rendering
  container.innerHTML = "";

  // Insert default palette first (for display only)
  const allPalettes = [DEFAULT_PALETTE, ...palettes];

  // Loop through all palettes and create cards
  allPalettes.forEach((p, i) => {
    const card = document.createElement("div");
    card.classList.add("palette-card");

    // Inner HTML of the card:
    // - Color input fields for live preview
    // - Palette info paragraph showing color hex codes
    // - Buttons for Save, Delete, Load
    card.innerHTML = `
      <div class="color-inputs">
        <input type="color" value="${p.primary}" data-key="primary"/>
        <input type="color" value="${p.secondary}" data-key="secondary"/>
        <input type="color" value="${p.textMuted}" data-key="textMuted"/>
        <input type="color" value="${p.bg}" data-key="bg"/>
        <input type="color" value="${p.bgPrimary}" data-key="bgPrimary"/>
        <input type="color" value="${p.bgSecondary}" data-key="bgSecondary"/>
      </div>
      <div class="palette-info">
        <p>${[
          p.primary,
          p.secondary,
          p.textMuted,
          p.bg,
          p.bgPrimary,
          p.bgSecondary,
        ].join(" • ")}</p>
        <div class="palette-buttons">
          <button class="save-btn">Save</button>
          <button class="delete-btn">Delete</button>
          <button class="load-btn">Load</button>
        </div>
      </div>
    `;
    container.appendChild(card); // Add card to container

    const inputs = card.querySelectorAll("input[type=color]"); // Select color inputs
    const infoParagraph = card.querySelector(".palette-info p"); // Paragraph showing hex codes

    // ======================
    //  Live update preview
    // ======================
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        p[input.dataset.key] = input.value; // Update palette object
        // Update hex codes displayed in the paragraph
        infoParagraph.textContent = [
          p.primary,
          p.secondary,
          p.textMuted,
          p.bg,
          p.bgPrimary,
          p.bgSecondary,
        ].join(" • ");
      });
    });

    // ======================
    //  Save button functionality
    // ======================
    card.querySelector(".save-btn").addEventListener("click", () => {
      const savedPalettes = JSON.parse(localStorage.getItem("palettes")) || [];

      if (i === 0) {
        // Save default palette as a new entry in localStorage
        savedPalettes.push(p);
        localStorage.setItem("palettes", JSON.stringify(savedPalettes));
        alert("Default palette saved!");
      } else {
        // Update existing palette in localStorage
        savedPalettes[i - 1] = p; // subtract 1 because default is at index 0
        localStorage.setItem("palettes", JSON.stringify(savedPalettes));
        alert("Palette updated!");
      }
    });

    // ======================
    //  Delete button functionality
    // ======================
    card.querySelector(".delete-btn").addEventListener("click", () => {
      if (i === 0) return; // Do not allow deletion of default palette

      const savedPalettes = JSON.parse(localStorage.getItem("palettes")) || [];
      savedPalettes.splice(i - 1, 1); // remove the correct palette
      localStorage.setItem("palettes", JSON.stringify(savedPalettes));
      loadSavedPalettes(); // Re-render the palettes after deletion
    });

    // ======================
    //  Load button functionality
    // ======================
    card.querySelector(".load-btn").addEventListener("click", () => {
      // Store selected palette in sessionStorage for current tab only
      sessionStorage.setItem("currentPalette", JSON.stringify(p));
      // Store in localStorage for index.html detection
      localStorage.setItem("loadPalette", JSON.stringify(p));
      // Redirect to index.html to apply palette
      window.location.href = "index.html";
    });
  });
}

// Load saved palettes when DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadSavedPalettes);

// ======================
//  Navigation Toggle (mobile menu)
// ======================
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  // Toggle menu visibility on click
  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  // Optional: Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove("show");
    }
  });
});
