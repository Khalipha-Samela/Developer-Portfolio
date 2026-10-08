const menuToggle = document.getElementById('menu-toggle');
document.querySelectorAll('.navlinks a').forEach(link => {
  link.addEventListener('click', () => { menuToggle.checked = false; });
});

// TODO: replace with the real path to your CV file
const CV_URL = 'assets/cv/Khalipha Samela_CV.pdf';

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function categoryIcon(category){
  const map = {
    'Full Stack': 'fa-layer-group',
    'Frontend': 'fa-desktop',
    'Desktop': 'fa-window-restore'
  };
  return map[category] || 'fa-code';
}

// ---- Tech → layer color mapping, used only for the compact card tags ----
// Unrecognized tech falls back to neutral gray rather than guessing wrong.
const TECH_LAYER_MAP = {
  'React': 'c', 'Vue': 'c', 'Angular': 'c', 'Tailwind CSS': 'c',
  'JavaScript': 'c', 'JavaScript (ES6+)': 'c', 'JavaScript (ES6)': 'c',
  'TypeScript': 'c', 'HTML5': 'c', 'HTML': 'c', 'CSS3': 'c', 'CSS': 'c',
  'Lucide React': 'c', 'LocalStorage API': 'c', 'jQuery': 'c',
  'Node.js': 's', 'Express': 's', 'PHP': 's', 'Django': 's', 'Flask': 's',
  'JWT': 's', 'JWT Auth': 's', 'REST API': 's', 'Auth': 's', 'Supabase Auth': 's',
  'PostgreSQL': 'd', 'MySQL': 'd', 'Supabase': 'd', 'MongoDB': 'd',
  'SQLite': 'd', 'Firebase': 'd', 'Redis': 'd'
};

function classifyTech(tech){
  return TECH_LAYER_MAP[tech] || 'n';
}

function tagClassForCard(tech, category){
  if (category === 'Frontend') return 'c';
  if (category === 'Desktop') return 'n';
  return classifyTech(tech);
}

function barHtml(category){
  if (category === 'Full Stack') {
    return '<div class="bar"><span class="c"></span><span class="s"></span><span class="d"></span></div>';
  }
  if (category === 'Frontend') {
    return '<div class="bar"><span class="c"></span></div>';
  }
  return '<div class="bar"><span class="n"></span></div>'; // Desktop / anything else
}

function buildCardLinksHtml(liveUrl, githubUrl){
  let html = '';
  if (liveUrl) html += `<a href="${liveUrl}" target="_blank" rel="noopener noreferrer">Live →</a>`;
  if (githubUrl) html += `<a href="${githubUrl}" target="_blank" rel="noopener noreferrer">Source →</a>`;
  return html;
}

function buildProjectCard(p){
  const tags = (p.tech || []).slice(0, 5)
    .map(t => `<span class="layer-tag ${tagClassForCard(t, p.category)}">${escapeHtml(t)}</span>`)
    .join('');
  return `
    <div class="project" data-category="${escapeHtml(p.category)}">
      ${barHtml(p.category)}
      <div class="project-body">
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-desc">${escapeHtml(p.shortDescription || p.description)}</p>
        <div class="layer-tags">${tags}</div>
        <div class="project-links">${buildCardLinksHtml(p.liveUrl, p.githubUrl)}</div>
      </div>
    </div>`;
}

// ---- Render project cards from data/projects.js ----
// Sorted most-recent-first (stable — ties keep their order from the data file).
const sortedProjects = [...projectsData].sort((a, b) => (parseInt(b.date) || 0) - (parseInt(a.date) || 0));
const VISIBLE_COUNT = 3;
const visibleProjects = sortedProjects.slice(0, VISIBLE_COUNT);
const extraProjects = sortedProjects.slice(VISIBLE_COUNT);

const projectsVisibleEl = document.getElementById('projects-visible');
const projectsMoreEl = document.getElementById('projects-more');
const seeMoreBtn = document.getElementById('see-more-btn');

if (projectsVisibleEl) {
  projectsVisibleEl.innerHTML = visibleProjects.map(buildProjectCard).join('');
}
if (projectsMoreEl) {
  projectsMoreEl.innerHTML = extraProjects.map(buildProjectCard).join('');
}
if (seeMoreBtn) {
  if (extraProjects.length === 0) {
    seeMoreBtn.style.display = 'none';
  } else {
    seeMoreBtn.textContent = `See more projects (${extraProjects.length}) →`;
  }
}

const workCountEl = document.getElementById('work-count');
if (workCountEl) {
  const total = sortedProjects.length;
  workCountEl.textContent = `// ${total} project${total === 1 ? '' : 's'} · client → server → data`;
}

// ---- Project modal ----
const modal = document.getElementById('project-modal');
const modalImage = modal.querySelector('.modal-image-img');
const modalImageFallback = modal.querySelector('.modal-image-fallback');
const modalCategory = modal.querySelector('.modal-category');
const modalTitle = modal.querySelector('.modal-title');
const modalDesc = modal.querySelector('.modal-desc');
const modalFeaturesLabel = modal.querySelector('.modal-features-label');
const modalFeatures = modal.querySelector('.modal-features');
const modalTags = modal.querySelector('.modal-tags');
const modalLinks = modal.querySelector('.modal-links');
const modalClose = modal.querySelector('.modal-close');
let lastFocused = null;

function findProjectData(title){
  return projectsData.find(p => p.title === title);
}

function setModalImage(thumbnail, category){
  modalImageFallback.innerHTML = `<i class="fas ${categoryIcon(category)}"></i>`;
  if (thumbnail){
    modalImage.src = thumbnail;
    modalImage.alt = '';
    modalImage.hidden = false;
    modalImageFallback.hidden = true;
    modalImage.onerror = () => {
      modalImage.hidden = true;
      modalImageFallback.hidden = false;
    };
  } else {
    modalImage.hidden = true;
    modalImage.removeAttribute('src');
    modalImageFallback.hidden = false;
  }
}

function buildModalLinksHtml(liveUrl, githubUrl){
  let links = '';
  if (liveUrl){ links += `<a href="${liveUrl}" target="_blank" rel="noopener noreferrer"><i class="fas fa-arrow-up-right-from-square"></i>Live</a>`; }
  if (githubUrl){ links += `<a href="${githubUrl}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i>Source</a>`; }
  return links;
}

function openModal(card){
  const title = card.querySelector('.project-title').textContent.trim();
  const data = findProjectData(title);
  if (!data) return; // shouldn't happen now that cards are generated from projectsData

  setModalImage(data.thumbnail, data.category);
  modalCategory.textContent = data.date ? `${data.category} · ${data.date}` : data.category;
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.description;

  if (data.features && data.features.length){
    modalFeaturesLabel.style.display = '';
    modalFeatures.style.display = '';
    modalFeatures.innerHTML = data.features.map(f => `<li>${escapeHtml(f)}</li>`).join('');
  } else {
    modalFeaturesLabel.style.display = 'none';
    modalFeatures.style.display = 'none';
    modalFeatures.innerHTML = '';
  }

  modalTags.innerHTML = (data.tech || []).map(t => `<span class="layer-tag n">${escapeHtml(t)}</span>`).join('');
  modalLinks.innerHTML = buildModalLinksHtml(data.liveUrl, data.githubUrl);

  lastFocused = document.activeElement;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal(){
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

// Attach handlers after rendering, so dynamically-created cards are included.
document.querySelectorAll('.project').forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    openModal(card);
  });
  card.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a')) {
      e.preventDefault();
      openModal(card);
    }
  });
});

modalClose.addEventListener('click', closeModal);
modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

// ---- See more projects ----
if (seeMoreBtn && projectsMoreEl) {
  seeMoreBtn.addEventListener('click', () => {
    const isHidden = projectsMoreEl.hasAttribute('hidden');
    if (isHidden) {
      projectsMoreEl.removeAttribute('hidden');
      seeMoreBtn.textContent = 'Show less ↑';
      seeMoreBtn.setAttribute('aria-expanded', 'true');
    } else {
      projectsMoreEl.setAttribute('hidden', '');
      seeMoreBtn.textContent = `See more projects (${extraProjects.length}) →`;
      seeMoreBtn.setAttribute('aria-expanded', 'false');
      seeMoreBtn.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  });
}

// ---- Certifications (rendered from data/certificates.js) ----
const certTableEl = document.getElementById('cert-table');
if (certTableEl && typeof certificatesData !== 'undefined') {
  certTableEl.insertAdjacentHTML('beforeend', certificatesData.map(c => {
    const action = c.file
      ? `<a href="${escapeHtml(c.file)}" target="_blank" rel="noopener">View PDF <i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
      : '<span class="cert-none">-</span>';
    return `
      <div class="cert-row" role="row">
        <span class="cert-name" role="cell">${escapeHtml(c.name)}</span>
        <span class="cert-issuer" role="cell">${escapeHtml(c.issuer)}</span>
        <span class="cert-date" role="cell">${escapeHtml(c.date)}</span>
        <span class="cert-action" role="cell">${action}</span>
      </div>`;
  }).join(''));
}

// ---- Contact form (Netlify Forms) ----
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !message || !contactForm.checkValidity()) {
      formStatus.textContent = 'Please fill in your name, a valid email and a message.';
      formStatus.className = 'form-status error';
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    formStatus.textContent = 'Sending…';
    formStatus.className = 'form-status';

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(contactForm)).toString()
      });
      if (!res.ok) throw new Error('Request failed');

      contactForm.reset();
      formStatus.textContent = "Thanks, your message was sent. I'll get back to you soon.";
      formStatus.className = 'form-status success';
    } catch (err) {
      formStatus.textContent = 'Something went wrong. Please email me directly at samelakhalipha@gmail.com.';
      formStatus.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// ---- Warm the cache for modal thumbnails once the page is idle ----
function preloadThumbnails() {
  projectsData.forEach(p => {
    if (p.thumbnail) {
      const img = new Image();
      img.src = p.thumbnail;
    }
  });
}
window.addEventListener('load', () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(preloadThumbnails);
  } else {
    setTimeout(preloadThumbnails, 1500);
  }
});