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
