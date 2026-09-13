# Prashav Rimal — Portfolio

A static portfolio for software development, frontend engineering, and full-stack Python opportunities.

Production domain: https://prashavrimal.com.np

## Run locally

No packages or installation are required. From the repository directory:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. The committed HTML works without JavaScript. The small script enhances mobile navigation and keeps the footer year current.

## Update content

1. Edit `content/portfolio.json`.
2. Run `node scripts/build.mjs` with Node.js 18 or later.
3. Review the website locally and commit the JSON and generated `index.html`, `robots.txt`, and `sitemap.xml` together.

CSS is in `css/style.css`. Browser behavior is in `js/script.js`. The build script uses only Node.js built-ins. GitHub Pages serves the generated files; no build service is needed.

## Add or improve a project

Add an object to `projects`, following the existing entries. The layout grows automatically, including for future Python and full-stack projects.

- `name`, `type`, `context`, `description`: confirmed information only.
- `technologies`: known technologies; an empty array renders no technology labels.
- `details`: confirmed functionality, personal contributions, or technical decisions, one string per bullet. Nonempty details show a keyboard-accessible disclosure.
- `githubUrl`, `demoUrl`: real HTTPS links or `null`. Buttons are omitted until actual links are provided.
- `image`: an optional relative asset path such as `assets/hamro-mart.webp`, or `null`. Supply a descriptive `imageAlt`. Images use intrinsic dimensions and lazy loading.

Hamro Mart currently has no confirmed stack, features, screenshots, or repository/demo links. Java is the only confirmed technology for Employee Management System. No planned project is presented as completed work.

## Update the resume download

The public resume is `assets/Prashav-Rimal-Resume.pdf`. It was revised from the supplied resume using the confirmed graduation, career focus, and Mind Risers training details. Both navigation and hero download actions link to this PDF.

1. Replace the PDF at `assets/Prashav-Rimal-Resume.pdf` with the next approved version.
2. Set `resume.path` to `assets/Prashav-Rimal-Resume.pdf`.
3. Run `node scripts/build.mjs` and commit the PDF and updated files.

The button becomes a real download link automatically. The builder refuses missing files, paths outside this repository, and files without a PDF signature. To withdraw the download, set the path to `null`, rebuild, and remove the PDF from the published branch. Disabling a link alone does not make a previously published PDF private; Git history may retain it.

To regenerate the current PDF from portfolio content, use `python3 scripts/build-resume.py`. This optional authoring script requires ReportLab and the DejaVu Serif regular/bold fonts. Set `RESUME_FONT_DIR` if the font directory differs from `/usr/share/fonts/truetype/dejavu`. The phone number comes from the uploaded source resume. Review the rendered PDF after regeneration. These authoring dependencies are not loaded by the website or required by GitHub Pages.

## Optional sections

`experience` starts empty; no experience section or navigation link is shown. Add only confirmed entries with `role`, `organization`, `period`, and optional `description`. `linkedin` stays `null` until a real HTTPS profile URL is supplied. `interests` can be shortened or set to an empty array to hide that row.

## GitHub Pages and the custom domain

- Preserve the existing Pages source setting and DNS records. No workflow or hosting migration is required.
- `CNAME` remains exactly `prashavrimal.com.np`.
- Deploy from the existing repository root. `index.html` and public assets are committed; no Node.js process runs in production.
- `.nojekyll` prevents Jekyll processing.
- Main-page asset paths are relative, so the portfolio also renders below a repository path. Canonical links, sitemap, and the 404 return link intentionally use the custom domain.
- `404.html` uses canonical-domain asset URLs so nested missing paths render correctly on GitHub Pages.

SEO includes a title, description, canonical URL, Open Graph and social metadata, sitemap, robots.txt, and custom SVG favicon. No social image is claimed where none was supplied.

## Design and accessibility

System fonts, semantic landmarks, one primary heading, visible focus outlines, a skip link, descriptive links, native project disclosures, and reduced-motion support. Navigation stays visible on small screens when JavaScript is unavailable. No analytics, trackers, remote fonts, icon CDN, contact-form backend, or animation library is loaded.

## Content needed for a stronger job-application launch

- For each project: actual features, your contribution, confirmed stack, repository/demo URLs, and screenshots if available.
- Keep the downloadable resume aligned with portfolio updates.
- Optional: a completed Python/full-stack project and a real LinkedIn URL.

Keep claims aligned with work you can explain and demonstrate in an interview.
