# Project folder convention

Each project gets its own folder: `projects/<slug>/`

- `cover.png` (or `.jpg` / `.webp`) is the card image. Use 16:9 if you can (e.g. 1600×900).
- Put any extra screenshots, GIFs, or PDFs here too and link to them from the summary or a demo page.

Then add an entry to `projects.json` at the root of the site:

```json
{
  "title": "My Project",
  "slug": "my-project",
  "date": "2026-10",
  "summary": "One or two sentences about what it does and what you used.",
  "tags": ["React", "Firebase"],
  "image": "projects/my-project/cover.png",
  "repo": "https://github.com/WJMcCartney/my-project",
  "demo": "",
  "featured": false
}
```

Or run `node add-project.js` and it'll do all of this for you.
