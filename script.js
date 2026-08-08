/* ══════════════════════════════════════════════════════════════════════════
   JOSHUA WILLIAMS — PORTFOLIO SCRIPT
   1. Footer year
   2. Mobile nav toggle
   3. View switching (home <-> project write-ups, hash-based routing)
   4. Active nav-link highlighting (home view only)
   ══════════════════════════════════════════════════════════════════════════ */

/* ── 1. FOOTER YEAR ──────────────────────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── 2. MOBILE NAV TOGGLE ────────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ── 3. VIEW SWITCHING ───────────────────────────────────────────────────────
   The whole site lives in one HTML file. The homepage lives in #view-home.
   Each project write-up is its own <div class="view-project" id="view-<key>">
   further down the page. Project cards/links point to "#project-<key>"
   (e.g. href="#project-solar-tracker"). Nothing else needs to change to add
   a new project: just add a new .view-project block with a matching id, and
   a link somewhere with href="#project-<key>".
   ────────────────────────────────────────────────────────────────────────── */
const DEFAULT_TITLE = document.title;
const viewHome = document.getElementById('view-home');
const projectViews = Array.from(document.querySelectorAll('.view-project'));

function showHome() {
  if (viewHome) viewHome.classList.remove('view-hidden');
  projectViews.forEach(v => v.classList.add('view-hidden'));
  document.title = DEFAULT_TITLE;
}

function showProject(key) {
  const view = document.getElementById('view-' + key);
  if (!view) { showHome(); return; }
  if (viewHome) viewHome.classList.add('view-hidden');
  projectViews.forEach(v => v.classList.add('view-hidden'));
  view.classList.remove('view-hidden');
  document.title = (view.dataset.title ? view.dataset.title + ' | Joshua Williams' : DEFAULT_TITLE);
  window.scrollTo(0, 0);
}

function route() {
  const hash = window.location.hash;

  if (hash.indexOf('#project-') === 0) {
    showProject(hash.replace('#project-', ''));
    return;
  }

  showHome();

  // If the hash points at a section on the homepage (e.g. "#projects"),
  // scroll to it once the home view is visible again.
  if (hash.length > 1) {
    const target = document.getElementById(hash.slice(1));
    if (target) {
      requestAnimationFrame(() => target.scrollIntoView());
    }
  }
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);

/* ── 4. ACTIVE NAV-LINK HIGHLIGHTING (home view only) ────────────────────── */
const homeSections = document.querySelectorAll('#view-home section[id]');
const navItems = document.querySelectorAll('.nav-links a[data-nav]');

if (homeSections.length && navItems.length) {
  const setActive = (id) => {
    navItems.forEach(link => {
      link.classList.toggle('active', link.dataset.nav === id);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  homeSections.forEach(section => observer.observe(section));
}
