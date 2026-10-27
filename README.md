# WJMcCartney.github.io

Personal portfolio for William McCartney: https://wjmccartney.github.io

Plain HTML, CSS, and JavaScript. No build step and no dependencies.

```
index.html            page content (about, skills, experience, contact)
assets/css/style.css  styles (light and dark mode)
assets/js/main.js     renders the Projects section from projects.json
projects.json         list of projects shown on the site
projects/<slug>/      screenshots for each project
add-project.js        helper that adds a project for you
serve.js              local preview server
```

## Add a project

### Option A: use the helper (on your computer)

```bash
node add-project.js
```

It asks for a title, summary, tags, links, and a screenshot path. Then it creates `projects/<slug>/`, copies the screenshot in as `cover.png`, and adds the entry to `projects.json`. Upload or push the changes and you're done.

### Option B: by hand (works on github.com too)

1. Create a folder `projects/my-project/` and put a screenshot in it named `cover.png`. 16:9 looks best.
2. Add an entry to `projects.json`:
   ```json
   {
     "title": "My Project",
     "slug": "my-project",
     "date": "2026-10",
     "summary": "One or two sentences.",
     "tags": ["React", "Firebase"],
     "image": "projects/my-project/cover.png",
     "repo": "https://github.com/WJMcCartney/my-project",
     "demo": "",
     "featured": false
   }
   ```
   Separate entries with a comma. Leave `repo`, `demo`, or `image` as `""` to hide them; a project without an image gets an initials placeholder.
3. Commit. GitHub Pages updates in about a minute.

Tag filter buttons are generated automatically from the tags you use. `featured: true` projects show first, then newest by date.

To edit skills or experience, change the text in `index.html` directly.

## Preview locally

```bash
node serve.js
```

Open http://localhost:8080. Opening `index.html` directly won't load the projects, because browsers block `fetch()` from `file://` pages.

## Publish to GitHub Pages (first time)

1. On github.com, create a **public** repository named exactly `WJMcCartney.github.io`.
2. Upload the files with either method:
   - **Browser:** click **Add file → Upload files** and drag in everything in this folder **except `Resume.xlsx` and the `.claude` folder**. Don't miss the hidden `.nojekyll` file; in File Explorer, turn on View → Hidden items.
   - **Git:** install [Git](https://git-scm.com/download/win) or [GitHub Desktop](https://desktop.github.com/), then commit and push this folder. `.gitignore` already keeps `Resume.xlsx` out.
3. Go to **Settings → Pages**, set Source to **Deploy from a branch**, and pick `main` / `(root)`.
4. The site goes live at https://wjmccartney.github.io within a few minutes.

> `Resume.xlsx` contains your phone number, so it is deliberately left out of the site. If you want a downloadable resume, export a PDF without the phone number, add it as `resume.pdf`, and link it from the nav in `index.html`.
