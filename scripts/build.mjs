// Dependency-free content renderer. Commit the output: GitHub Pages serves the root.
import { readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = JSON.parse(await readFile(path.join(root, 'content/portfolio.json'), 'utf8'));
const escape = (value = '') => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const checkedUrl = value => {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error(`Expected an HTTPS URL: ${value}`);
  return escape(url.href);
};
const checkedAsset = async value => {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_./-]+$/.test(value) || value.startsWith('/') || value.split('/').includes('..')) throw new Error('Asset paths must be relative paths inside this repository.');
  await access(path.join(root, value));
  return escape(value);
};
const icons = {
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  right: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  down: '<path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  github: '<path d="M9 19c-4.3 1.3-4.3-2.2-6-2.6m12 5v-3.4c.1-1-.3-1.8-.8-2.3 2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.3-3.3 4.3 4.3 0 0 0-.1-3.3S17.3 2.8 15 4.4a11.4 11.4 0 0 0-6 0C6.7 2.8 5.7 3.1 5.7 3.1a4.3 4.3 0 0 0-.1 3.3 4.7 4.7 0 0 0-1.3 3.3c0 4.7 2.8 5.7 5.5 6-.5.5-.9 1.3-.8 2.3v3.4"/>'
};
const icon = name => `<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[name]}</svg>`;
const github = checkedUrl(data.github);
const email = `mailto:${escape(data.email)}`;
const site = checkedUrl(data.siteUrl).replace(/\/$/, '');
const metaDescription = `Portfolio of ${data.name}, a software developer based in Nepal focused on full-stack Python and modern frontend development.`;
const year = new Date().getFullYear();
const sectionHeading = (title, index, id) => `<div class="section-heading"><span class="section-index" aria-hidden="true">${index}</span><h2 id="${id}-heading">${title}</h2></div>`;
let resumeControl = `<button class="button button-resume" type="button" aria-disabled="true" aria-describedby="resume-status">${icon('down')} Download Resume</button>`;
if (data.resume.path) {
  const resumePath = await checkedAsset(data.resume.path);
  if (!resumePath.toLowerCase().endsWith('.pdf')) throw new Error('The public resume must be a PDF.');
  const bytes = await readFile(path.join(root, data.resume.path));
  if (bytes.subarray(0, 5).toString() !== '%PDF-') throw new Error('The resume file is not a valid PDF.');
  resumeControl = `<a class="button button-secondary" href="${resumePath}" download="${escape(data.resume.filename)}">${icon('down')} Download Resume</a>`;
}
const projectCards = await Promise.all(data.projects.map(async (project, index) => {
  const image = project.image ? `<img class="project-image" src="${await checkedAsset(project.image)}" alt="${escape(project.imageAlt || project.name)}" width="800" height="500" loading="lazy" decoding="async">` : '';
  const links = [
    project.githubUrl ? `<a href="${checkedUrl(project.githubUrl)}" aria-label="View ${escape(project.name)} source on GitHub">GitHub ${icon('arrow')}</a>` : '',
    project.demoUrl ? `<a href="${checkedUrl(project.demoUrl)}" aria-label="Open the ${escape(project.name)} live demo">Live demo ${icon('arrow')}</a>` : ''
  ].filter(Boolean);
  return `<article class="project-card">${image}<div class="project-body">
    <div class="project-topline"><span class="project-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span>${escape(project.type)}</span></div>
    <h3>${escape(project.name)}</h3><p class="project-description">${escape(project.description)}</p>
    <div class="project-meta"><span>${escape(project.context)}</span>${project.technologies.length ? `<ul class="technology-list" aria-label="${escape(project.name)} technologies">${project.technologies.map(tech => `<li>${escape(tech)}</li>`).join('')}</ul>` : ''}</div>
    ${project.details.length ? `<details class="project-details"><summary>Project details ${icon('chevron')}</summary><ul>${project.details.map(detail => `<li>${escape(detail)}</li>`).join('')}</ul></details>` : ''}
    ${links.length ? `<div class="project-links">${links.join('')}</div>` : ''}
  </div></article>`;
}));
const experience = data.experience.length ? `<section class="section" id="experience" aria-labelledby="experience-heading">${sectionHeading('Experience', '06', 'experience')}<div>${data.experience.map(item => `<article class="credential"><div><h3>${escape(item.role)}</h3><p class="organization">${escape(item.organization)}</p>${item.description ? `<p class="credential-description">${escape(item.description)}</p>` : ''}</div><p class="period">${escape(item.period)}</p></article>`).join('')}</div></section>` : '';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="theme-color" content="#ffffff">
  <meta name="description" content="${escape(metaDescription)}">
  <title>${escape(data.name)} | ${escape(data.role)}</title>
  <link rel="canonical" href="${site}/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_US">
  <meta property="og:site_name" content="${escape(data.name)}">
  <meta property="og:title" content="${escape(data.name)} | ${escape(data.role)}">
  <meta property="og:description" content="${escape(metaDescription)}">
  <meta property="og:url" content="${site}/">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escape(data.name)} | ${escape(data.role)}">
  <meta name="twitter:description" content="${escape(metaDescription)}">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/style.css">
  <script src="js/script.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="header-inner container">
    <a class="brand" href="#top" aria-label="${escape(data.name)}, back to top"><span class="brand-mark" aria-hidden="true">pr.</span><span>${escape(data.name)}</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" hidden><span class="menu-label">Menu</span><span class="menu-icon" aria-hidden="true"><span></span><span></span></span></button>
    <nav class="primary-navigation" id="primary-navigation" aria-label="Main navigation">
      <a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#education">Education</a><a href="#training">Training</a>${data.experience.length ? '<a href="#experience">Experience</a>' : ''}<a href="#contact">Contact</a><a class="nav-resume" href="#resume">Resume ${icon('down')}</a>
    </nav>
  </div></header>
  <main class="container" id="main" tabindex="-1">
    <section class="hero" id="top" aria-labelledby="name-heading"><div class="hero-main">
      <p class="eyebrow">${escape(data.role)}</p>
      <h1 id="name-heading">${escape(data.name)}<span class="name-period" aria-hidden="true">.</span></h1>
      <p class="hero-role">${escape(data.specialization)}</p>
      <p class="hero-intro">${escape(data.summary)}</p>
      <div class="hero-actions" id="resume"><a class="button button-primary" href="#projects">View Projects ${icon('right')}</a><a class="button button-secondary" href="${github}" aria-label="View ${escape(data.name)} on GitHub">${icon('github')} GitHub</a>${resumeControl}</div>
      ${data.resume.path ? '' : `<p class="resume-status" id="resume-status">${escape(data.resume.unavailableMessage)}</p>`}
    </div><aside class="profile-note" aria-label="Profile at a glance"><p class="note-heading">At a glance</p><dl><div><dt>Based in</dt><dd>${escape(data.location)}</dd></div><div><dt>Background</dt><dd>IT Engineering graduate</dd></div><div><dt>Development focus</dt><dd>Python & modern frontend</dd></div></dl><a class="text-link" href="#contact">Get in touch ${icon('arrow')}</a></aside></section>

    <section class="section" id="about" aria-labelledby="about-heading">${sectionHeading('About', '01', 'about')}<div class="section-content"><p class="about-copy">${escape(data.about)}</p></div></section>

    <section class="section" id="skills" aria-labelledby="skills-heading">${sectionHeading('Technical skills', '02', 'skills')}<div class="skill-grid">${data.skills.map(group => `<div class="skill-group"><h3>${escape(group.name)}</h3><ul class="skill-list">${group.items.map(item => `<li>${escape(item)}</li>`).join('')}</ul></div>`).join('')}</div></section>

    <section class="section" id="projects" aria-labelledby="projects-heading">${sectionHeading('Selected projects', '03', 'projects')}<div><div class="section-intro"><p>Academic work</p><span>Web & desktop applications</span></div><div class="project-grid">${projectCards.join('')}</div></div></section>

    <section class="section" id="education" aria-labelledby="education-heading">${sectionHeading('Education', '04', 'education')}<div class="credential-list">${data.education.map(item => `<article class="credential"><div><h3>${escape(item.qualification)}</h3><p class="organization">${escape(item.institution)}</p>${item.status ? `<span class="completion-label">${escape(item.status)}</span>` : ''}</div><p class="period">${escape(item.period)}</p></article>`).join('')}</div></section>

    <section class="section" id="training" aria-labelledby="training-heading">${sectionHeading('Training', '05', 'training')}<div>${data.training.map(item => `<article class="credential training-credential"><div><p class="training-provider">${escape(item.provider)}</p><h3>${escape(item.name)}</h3><p class="credential-description">${escape(item.description)}</p></div><p class="period">${escape(item.duration)}</p></article>`).join('')}</div></section>
    ${experience}
    ${data.interests.length ? `<div class="interests"><h2>Areas of interest</h2><ul>${data.interests.map(item => `<li>${escape(item)}</li>`).join('')}</ul></div>` : ''}

    <section class="contact-section" id="contact" aria-labelledby="contact-heading"><div class="contact-copy"><p class="eyebrow">Contact</p><h2 id="contact-heading">Open to software<br class="desktop-break"> development opportunities.</h2><p>For roles in software engineering, frontend development, or full-stack Python, get in touch.</p></div><div class="contact-links"><a class="contact-email" href="${email}">${escape(data.email)} ${icon('arrow')}</a><a href="${github}" aria-label="View ${escape(data.name)} on GitHub">${icon('github')} GitHub <span aria-hidden="true">/ prashavr</span>${icon('arrow')}</a>${data.linkedin ? `<a href="${checkedUrl(data.linkedin)}">LinkedIn ${icon('arrow')}</a>` : ''}<p>${escape(data.location)}</p></div></section>
  </main>
  <footer class="site-footer container"><p><span>${escape(data.name)}</span><span class="copyright">© <span data-current-year>${year}</span></span></p><nav aria-label="Footer navigation"><a href="${github}">GitHub</a><a href="${email}">Email</a><a href="#top">Back to top ↑</a></nav></footer>
</body>
</html>
`;
await writeFile(path.join(root, 'index.html'), html.replace(/^[ \t]+$/gm, ''));
await writeFile(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site}/</loc></url></urlset>\n`);
await writeFile(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
console.log('Built index.html, sitemap.xml, and robots.txt. GitHub Pages can serve the repository root without a build step.');
