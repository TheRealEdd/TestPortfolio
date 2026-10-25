
/* ========================================
   1. Colour theme
======================================== */

const root = document.documentElement;
const themeButtons = document.querySelectorAll(".theme-toggle");
const themeLabels = document.querySelectorAll(".theme-label");

let savedTheme = null;

try {
  savedTheme = localStorage.getItem("ehr-theme");
} catch {
  // Fall back to the system preference.
}

const systemPrefersDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

function applyTheme(theme) {
  root.dataset.theme = theme;

  const isDark = theme === "dark";

  themeButtons.forEach((button) => {
    button.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    button.setAttribute(
      "title",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  });

  themeLabels.forEach((label) => {
    label.textContent = isDark ? "Light mode" : "Dark mode";
  });

  const themeColor = isDark ? "#20211e" : "#f7f6f2";
  const themeColorMeta = document.querySelector(
    'meta[name="theme-color"]'
  );

  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", themeColor);
  }
}

applyTheme(
  savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : systemPrefersDark
      ? "dark"
      : "light"
);

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme =
      root.dataset.theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);

    try {
      localStorage.setItem("ehr-theme", nextTheme);
    } catch {
      // Theme still works if storage is unavailable.
    }
  });
});

/* ========================================
   2. Mobile navigation
======================================== */

const menuToggle = document.querySelector("#menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");

function closeMenu() {
  if (!menuToggle || !mobileMenu) return;

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  mobileMenu.hidden = true;
}

function openMenu() {
  if (!menuToggle || !mobileMenu) return;

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation menu");
  mobileMenu.hidden = false;
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when a link inside the menu is selected.
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close when clicking outside the navigation.
  document.addEventListener("click", (event) => {
    if (
      !mobileMenu.hidden &&
      !event.target.closest(".navbar")
    ) {
      closeMenu();
    }
  });

  // Close with Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileMenu.hidden) {
      closeMenu();
      menuToggle.focus();
    }
  });

  // Prevent the mobile menu staying open after resizing to desktop.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) {
      closeMenu();
    }
  });
}

/* ========================================
   3. Copyright year
======================================== */

const copyrightYear = document.querySelector("#copyright-year");

if (copyrightYear) {
  copyrightYear.textContent = new Date().getFullYear();
}
