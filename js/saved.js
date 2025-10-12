const container = document.querySelector(".saved-palettes");

function loadSavedPalettes() {
  const palettes = JSON.parse(localStorage.getItem("palettes")) || [];
  container.innerHTML = "";

  if (palettes.length === 0) {
    container.innerHTML = "<p>No saved palettes yet.</p>";
    return;
  }

  palettes.forEach((p, i) => {
    const card = document.createElement("div");
    card.classList.add("palette-card");

    const colorsHTML = `
      <div class="color-inputs">
        <input type="color" value="${
          p.primary
        }" data-key="primary" title="Primary"/>
        <input type="color" value="${
          p.secondary
        }" data-key="secondary" title="Secondary"/>
        <input type="color" value="${
          p.textMuted
        }" data-key="textMuted" title="Text Muted"/>
        <input type="color" value="${p.bg}" data-key="bg" title="Background"/>
        <input type="color" value="${
          p.bgPrimary
        }" data-key="bgPrimary" title="Background Primary"/>
        <input type="color" value="${
          p.bgSecondary
        }" data-key="bgSecondary" title="Background Secondary"/>
      </div>
      <div class="palette-info">
        <p>${[
          p.primary,
          p.secondary,
          // p.text,
          p.textMuted,
          p.bg,
          p.bgPrimary,
          p.bgSecondary,
        ].join(" • ")}</p>
        <div class="palette-buttons">
          <button class="save-btn">Save</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    `;

    card.innerHTML = colorsHTML;
    container.appendChild(card);

    const inputs = card.querySelectorAll("input[type=color]");
    const infoParagraph = card.querySelector(".palette-info p");

    // Update palette preview text when changing colors
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        const key = input.dataset.key;
        p[key] = input.value;
        infoParagraph.textContent = [
          p.primary,
          p.secondary,
          // p.text,
          p.textMuted,
          p.bg,
          p.bgPrimary,
          p.bgSecondary,
        ].join(" • ");
      });
    });

    // Save button
    card.querySelector(".save-btn").addEventListener("click", () => {
      const allPalettes = JSON.parse(localStorage.getItem("palettes")) || [];
      allPalettes[i] = p; // update palette at this index
      localStorage.setItem("palettes", JSON.stringify(allPalettes));
      alert("Palette updated!");
    });

    // Delete button
    card.querySelector(".delete-btn").addEventListener("click", () => {
      const allPalettes = JSON.parse(localStorage.getItem("palettes")) || [];
      allPalettes.splice(i, 1);
      localStorage.setItem("palettes", JSON.stringify(allPalettes));
      loadSavedPalettes();
    });

    // inside loadSavedPalettes() for each card
    const loadBtn = document.createElement("button");
    loadBtn.textContent = "Load";
    loadBtn.classList.add("load-btn");

    // Add Load button to palette-buttons div
    card.querySelector(".palette-buttons").prepend(loadBtn);

    // Load button functionality
    loadBtn.addEventListener("click", () => {
      localStorage.setItem("loadPalette", JSON.stringify(p));
      window.location.href = "index.html";
    });
  });
}

document.addEventListener("DOMContentLoaded", loadSavedPalettes);
