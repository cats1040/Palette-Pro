class Palette {
  constructor(bg, text, btn) {
    this.bg = bg;
    this.text = text;
    this.btn = btn;
  }
}

function PaletteStorage() {}
PaletteStorage.prototype.saveLast = function (palette) {
  localStorage.setItem("lastPalette", JSON.stringify(palette));
};
PaletteStorage.prototype.getLast = function () {
  return JSON.parse(localStorage.getItem("lastPalette"));
};
PaletteStorage.prototype.save = function (palette) {
  const list = JSON.parse(localStorage.getItem("palettes")) || [];
  list.push({ id: Date.now(), ...palette });
  localStorage.setItem("palettes", JSON.stringify(list));
};

function ColorUtils() {}
ColorUtils.prototype.getContrast = function (hex) {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
};
ColorUtils.prototype.random = function () {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};

class PaletteUI {
  constructor() {
    this.bg = document.getElementById("bgColor");
    this.text = document.getElementById("textColor");
    this.btn = document.getElementById("btnColor");
    this.preview = document.getElementById("preview");
    this.previewNav = this.preview.querySelector(".preview-navbar");
    this.navLinks = this.preview.querySelectorAll(".nav-links a");
    this.content = this.preview.querySelector(".preview-content");
    this.card = this.preview.querySelector(".card");
    this.cardHeader = this.card.querySelector("h3");
    this.cardText = this.card.querySelector("p");
    this.button = this.preview.querySelector(".preview-button");
    this.footer = this.preview.querySelector(".preview-footer");
    this.saveBtn = document.getElementById("savePalette");
    this.randomBtn = document.getElementById("randomPalette");

    this.store = new PaletteStorage();
    this.util = new ColorUtils();

    this.init();
  }

  init() {
    const last = this.store.getLast();
    if (last) {
      this.bg.value = last.bg;
      this.text.value = last.text;
      this.btn.value = last.btn;
    }

    this.update();

    this.bg.addEventListener("input", () => this.update());
    this.text.addEventListener("input", () => this.update());
    this.btn.addEventListener("input", () => this.update());
    this.saveBtn.addEventListener("click", () => this.save());
    this.randomBtn.addEventListener("click", () => this.random());
  }

  update(isRandom = false) {
    const p = new Palette(this.bg.value, this.text.value, this.btn.value);
    const contrastBg = this.util.getContrast(p.bg);
    const contrastBtn = this.util.getContrast(p.btn);

    // this.preview.style.backgroundColor = p.bg;
    this.preview.style.backgroundColor =
      isRandom && this.specialBg ? this.specialBg : p.bg;
    this.content.style.color = p.text;
    this.card.style.backgroundColor =
      contrastBg === "white" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
    this.cardHeader.style.color = p.text;
    this.cardText.style.color = p.text;
    this.button.style.backgroundColor = p.btn;
    this.button.style.color = contrastBtn;
    this.previewNav.style.color = contrastBg;
    this.previewNav.style.borderColor = contrastBg;
    this.navLinks.forEach((a) => (a.style.color = contrastBg));
    this.footer.style.color = contrastBg;
    this.footer.style.borderColor = contrastBg;

    this.store.saveLast(p);
  }

  save() {
    const p = new Palette(this.bg.value, this.text.value, this.btn.value);
    this.store.save(p);
    alert("Palette saved successfully!");
  }

  random() {
    // this.bg.value = this.util.random();
    // this.text.value = this.util.random();
    // this.btn.value = this.util.random();
    // this.update();

    const hexBg = this.util.random();
    const r = parseInt(hexBg.substr(1, 2), 16);
    const g = parseInt(hexBg.substr(3, 2), 16);
    const b = parseInt(hexBg.substr(5, 2), 16);

    this.bg.value = hexBg;
    this.text.value = this.util.random();
    this.btn.value = this.util.random();

    this.specialBg = `rgba(${r}, ${g}, ${b}, 0.2)`; // store for preview only

    this.update(true); // tell update() to use special background
  }
}

document.addEventListener("DOMContentLoaded", () => new PaletteUI());
