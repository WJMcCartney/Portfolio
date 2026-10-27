// Adds a new project to the portfolio:  node add-project.js
// Asks a few questions, creates projects/<slug>/, copies your screenshot in,
// and appends an entry to projects.json.
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = __dirname;
const jsonPath = path.join(root, "projects.json");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const lines = rl[Symbol.asyncIterator]();

async function ask(question, fallback = "") {
  process.stdout.write(fallback ? `${question} [${fallback}]: ` : `${question}: `);
  const { value, done } = await lines.next();
  const answer = done ? "" : value.trim();
  return answer || fallback;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function main() {
  const projects = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  console.log("\nAdd a project to your portfolio. Press Enter to skip optional questions.\n");

  const title = await ask("Project title");
  if (!title) throw new Error("A title is required.");

  let slug = slugify(title);
  while (projects.some((p) => p.slug === slug)) slug += "-2";

  const today = new Date().toISOString().slice(0, 7);
  const date = await ask("Date (YYYY-MM)", today);
  const summary = await ask("One or two sentence summary");
  const tags = (await ask("Tags, comma separated (e.g. React, Python)"))
    .split(",").map((t) => t.trim()).filter(Boolean);
  const repo = await ask("GitHub repo URL (optional)");
  const demo = await ask("Live demo URL (optional)");
  const imageSource = (await ask("Path to a screenshot to copy in (optional; you can drag the file into this window)"))
    .replace(/^["']|["']$/g, "");
  const featured = /^y/i.test(await ask("Feature it at the top? (y/n)", "n"));

  const folder = path.join(root, "projects", slug);
  fs.mkdirSync(folder, { recursive: true });

  let image = "";
  if (imageSource) {
    if (!fs.existsSync(imageSource)) throw new Error(`Screenshot not found: ${imageSource}`);
    const name = "cover" + path.extname(imageSource).toLowerCase();
    fs.copyFileSync(imageSource, path.join(folder, name));
    image = `projects/${slug}/${name}`;
  }

  projects.push({ title, slug, date, summary, tags, image, repo, demo, featured });
  fs.writeFileSync(jsonPath, JSON.stringify(projects, null, 2) + "\n");

  console.log(`\nAdded "${title}".`);
  console.log(`  Folder: projects/${slug}/  (put any extra screenshots here)`);
  console.log("  Preview with: node serve.js");
}

main()
  .catch((error) => {
    console.error(`\nError: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => rl.close());
