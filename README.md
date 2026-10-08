# Khalipha Samela | Portfolio

Personal portfolio site for a junior full-stack developer. It is a static site (HTML, CSS, vanilla JavaScript) with no build step. Projects and certifications are rendered from data files, and the contact form is handled by Netlify Forms.

**Live site:** `https://khalipha-samela.netlify.app/`

## Features

- Responsive layout with a mobile navigation menu
- Project cards generated from `data/projects.js`, sorted newest first, with a "See more" toggle
- Accessible project detail modal (keyboard navigation, focus return, Escape to close)
- Certifications table generated from `data/certificates.js`
- Contact form backed by Netlify Forms, with honeypot spam protection and inline status messages
- CV download

## Tech stack

| Area | Technology |
| --- | --- |
| Markup | HTML5 |
| Styling | CSS3 |
| Behaviour | Vanilla JavaScript (ES6+) |
| Icons | Font Awesome 6 (CDN) |
| Forms | Netlify Forms |
| Hosting | Netlify |

## Project structure

```
Developer Portfolio
├─ assets
│  ├─ css
│  │  └─ style.css
│  ├─ cv
│  │  └─ Khalipha Samela_CV.pdf
│  ├─ images
│  │  ├─ certificates
│  │  │  ├─ fnb-cert.pdf
│  │  │  ├─ javascript-cert.pdf
│  │  │  ├─ prodigy-cert.pdf
│  │  │  └─ sql-cert.pdf
│  │  ├─ deadline-master-thumbnail.png
│  │  ├─ fileflow-thumbnail.png
│  │  ├─ kaizen-thumbnail.png
│  │  ├─ mealplanner-thumbnail.png
│  │  ├─ mindguard-thumbnail.png
│  │  ├─ trackmyjobs-thumbnail.png
│  │  └─ travelo-thumbnail.png
│  └─ js
│     └─ script.js
├─ data
│  ├─ certificates.js
│  └─ projects.js
└─ index.html

```

## Running locally

No dependencies or build tooling are required. Serve the folder with any static server:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open `http://localhost:8000`.

> The contact form submits to Netlify, so it will only work on a deployed Netlify site. Locally, it will display the error message.

## Updating content

### Adding a project

Add an object at the top of the array in `data/projects.js`. Cards are sorted by `date` (newest first), and the first three are visible by default.

```js
{
  "title": "Project Name",
  "category": "Full Stack",            // "Full Stack" | "Frontend" | "Desktop"
  "date": "2026",
  "thumbnail": "assets/images/project-thumbnail.png",
  "shortDescription": "One-line summary shown on the card.",
  "description": "Longer description shown in the modal.",
  "features": ["Feature one", "Feature two"],
  "tech": ["React", "Node.js", "PostgreSQL"],
  "liveUrl": "https://example.com",    // optional, use "" to hide
  "githubUrl": "https://github.com/..."
}
```

### Adding a certificate

Add an entry at the top of `data/certificates.js` (newest first). The `file` field is optional; leave it empty to show no link.

```js
{
  name: "Certificate Name",
  issuer: "Issuer",
  date: "Oct 2025",
  file: "assets/images/certificates/certificate.pdf"
}
```

### Tech tag colours

Card tags are coloured by layer (client, server, data). To classify a new technology, add it to `TECH_LAYER_MAP` in `assets/js/script.js`. Unrecognised technologies fall back to a neutral style.

## Deployment (Netlify)

1. Push the repository to GitHub.
2. In Netlify, choose **Add new site → Import an existing project** and select the repository.
3. Leave the build command empty and set the publish directory to `.`.
4. Deploy.

### Contact form setup

The form in `index.html` is configured for Netlify Forms (`name="contact"`, `data-netlify="true"`, hidden `form-name` field, and a honeypot field). After the first deploy:

1. Open **Site configuration → Forms** and confirm the `contact` form is listed.
2. Go to **Notifications → Add notification → Email notification**, select the `contact` form, and enter the destination address.

Submissions are also stored in the Netlify Forms dashboard.

## Notes

- Netlify serves files from a case-sensitive filesystem. Filenames referenced in the data files and HTML must match the files on disk exactly.
- Avoid spaces in filenames (for example, use `Khalipha-Samela-CV.pdf`).

## Contact

- Email: samelakhalipha@gmail.com
- GitHub: https://github.com/Khalipha-Samela
- LinkedIn: https://www.linkedin.com/in/khalipha-samela/

&copy; 2026 Khalipha Samela. All rights reserved.
