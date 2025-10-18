const container = document.querySelector(".saved-palettes");

// Define the default palette (6 colors)
const DEFAULT_PALETTE = {
  primary: "#3b4050",
  secondary: "#a59678",
  textMuted: "#6f737f",
  bg: "#ffffff",
  bgPrimary: "#3b4050",
  bgSecondary: "#2e323f",
};

function loadSavedPalettes() {
  const palettes = JSON.parse(localStorage.getItem("palettes")) || [];

  container.innerHTML = "";

  // Insert default palette first (for display only)
  const allPalettes = [DEFAULT_PALETTE, ...palettes];

  allPalettes.forEach((p, i) => {
    const card = document.createElement("div");
    card.classList.add("palette-card");

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
    container.appendChild(card);

    const inputs = card.querySelectorAll("input[type=color]");
    const infoParagraph = card.querySelector(".palette-info p");

    // Live update preview
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        p[input.dataset.key] = input.value;
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

    // Save button (only saves to localStorage if not default palette)
    card.querySelector(".save-btn").addEventListener("click", () => {
      if (i === 0) {
        // Save default palette as new entry in localStorage
        const savedPalettes =
          JSON.parse(localStorage.getItem("palettes")) || [];
        savedPalettes.push(p);
        localStorage.setItem("palettes", JSON.stringify(savedPalettes));
        alert("Default palette saved!");
      } else {
        const savedPalettes =
          JSON.parse(localStorage.getItem("palettes")) || [];
        savedPalettes[i - 1] = p; // update correct index
        localStorage.setItem("palettes", JSON.stringify(savedPalettes));
        alert("Palette updated!");
      }
    });

    // Delete button
    card.querySelector(".delete-btn").addEventListener("click", () => {
      if (i === 0) return; // cannot delete default palette
      const savedPalettes = JSON.parse(localStorage.getItem("palettes")) || [];
      savedPalettes.splice(i - 1, 1);
      localStorage.setItem("palettes", JSON.stringify(savedPalettes));
      loadSavedPalettes();
    });

    // Load button
    card.querySelector(".load-btn").addEventListener("click", () => {
      sessionStorage.setItem("currentPalette", JSON.stringify(p)); // session only
      localStorage.setItem("loadPalette", JSON.stringify(p)); // for index.html detection
      window.location.href = "index.html";
    });
  });
}

document.addEventListener("DOMContentLoaded", loadSavedPalettes);

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

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
