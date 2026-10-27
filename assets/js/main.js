// Renders the Projects section from projects.json.
// To add a project, edit projects.json. No changes needed here.

const grid = document.getElementById("project-grid");
const filtersEl = document.getElementById("filters");
let projects = [];
let activeTag = "All";

document.getElementById("year").textContent = new Date().getFullYear();

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") node.className = value;
    else node.setAttribute(key, value);
  }
  for (const child of children) {
    if (child != null) node.append(child);
  }
  return node;
}

function formatDate(value) {
  if (!value) return "";
  const [year, month] = value.split("-");
  if (!month) return year;
  return new Date(Number(year), Number(month) - 1).toLocaleString("en-US", { month: "short", year: "numeric" });
}

function initials(title) {
  return title.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function placeholder(project) {
  return el("div", { class: "project-media placeholder", "aria-hidden": "true" }, initials(project.title));
}

function media(project) {
  if (!project.image) return placeholder(project);
  const img = el("img", { src: project.image, alt: `Screenshot of ${project.title}`, loading: "lazy" });
  const wrap = el("div", { class: "project-media" }, img);
  // Swap in the placeholder if the image path is wrong or missing.
  img.addEventListener("error", () => wrap.replaceWith(placeholder(project)));
  return wrap;
}

function card(project) {
  const links = el("div", { class: "project-links" });
  if (project.demo) links.append(el("a", { class: "btn small primary", href: project.demo, target: "_blank", rel: "noopener" }, "Live demo"));
  if (project.repo) links.append(el("a", { class: "btn small", href: project.repo, target: "_blank", rel: "noopener" }, "Code"));

  const title = el("h3", {}, project.title);
  if (project.featured) title.append(el("span", { class: "badge" }, "Featured"));

  const tags = el("ul", { class: "chips" }, ...(project.tags || []).map((tag) => el("li", {}, tag)));

  return el("article", { class: "card project" },
    media(project),
    el("div", { class: "project-body" },
      project.date ? el("div", { class: "project-meta" }, formatDate(project.date)) : null,
      title,
      el("p", {}, project.summary || ""),
      tags,
      links.childElementCount ? links : null,
    ),
  );
}

function render() {
  const visible = activeTag === "All" ? projects : projects.filter((p) => (p.tags || []).includes(activeTag));
  grid.replaceChildren(...visible.map(card));
  if (!visible.length) grid.append(el("p", { class: "muted" }, "No projects yet."));

  for (const button of filtersEl.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.tag === activeTag));
  }
}

function buildFilters() {
  const counts = new Map();
  for (const project of projects) {
    for (const tag of project.tags || []) counts.set(tag, (counts.get(tag) || 0) + 1);
  }
  // Most-used tags first, then alphabetical.
  const tags = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a) || a.localeCompare(b));

  filtersEl.replaceChildren(...["All", ...tags].map((tag) => {
    const button = el("button", { class: "filter", type: "button", "data-tag": tag }, tag);
    button.addEventListener("click", () => { activeTag = tag; render(); });
    return button;
  }));
  filtersEl.hidden = tags.length < 2;
}

async function load() {
  try {
    const response = await fetch("projects.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    projects = await response.json();
  } catch (error) {
    console.error("Could not load projects.json:", error);
    grid.replaceChildren(el("p", { class: "muted" },
      "Couldn't load projects. If you opened this file directly, run `node serve.js` and visit http://localhost:8080 instead."));
    return;
  }

  // Featured first, then newest.
  projects.sort((a, b) => (b.featured === true) - (a.featured === true) || (b.date || "").localeCompare(a.date || ""));
  buildFilters();
  render();
}

load();
