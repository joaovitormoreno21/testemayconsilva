import { loadComments, submitContactFirebase, submitAreaRestritaFirebase } from './firebase.js';

// ════════════════════════════════════════════
// CONFIGURAÇÃO
// ════════════════════════════════════════════
const CONFIG = {
  // Configurações gerais do site
  // Formulários e comentários estão integrados via Firebase/Web3Forms no arquivo firebase.js
  SENHA_AREA_RESTRITA: 'linguistica2026',

  EMAIL_PRINCIPAL: 'mayconsilvaaguiar@gmail.com',
  WHATSAPP: '5521979827136',
};

// ════════════════════════════════════════════
// NAVEGAÇÃO ENTRE PÁGINAS
// ════════════════════════════════════════════
function showPage(name, link) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.site-nav a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  if (link) link.classList.add('active');
  window.scrollTo({ top: 0 });
  if (name === 'blog') renderBlogList();
}

function showTab(section, tab, btn) {
  const prefix = section + '-';
  document.querySelectorAll('[id^="' + prefix + '"]').forEach(p => p.classList.remove('active'));
  btn.closest('.section-page, .page').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(prefix + tab).classList.add('active');
  btn.classList.add('active');
}

// ════════════════════════════════════════════
// BLOG — carregar posts do posts.json
// ════════════════════════════════════════════
let ALL_POSTS = [];
let POSTS_LOADED = false;
let POSTS_LOADING = null;

async function loadPosts() {
  if (POSTS_LOADED) return ALL_POSTS;
  if (POSTS_LOADING) return POSTS_LOADING;

  POSTS_LOADING = fetch('posts.json')
    .then(res => {
      if (!res.ok) throw new Error('Não foi possível carregar posts.json');
      return res.json();
    })
    .then(posts => {
      ALL_POSTS = posts;
      ALL_POSTS.sort((a, b) => new Date(b.date) - new Date(a.date));
      POSTS_LOADED = true;
      return ALL_POSTS;
    })
    .catch(() => {
      ALL_POSTS = [];
      POSTS_LOADED = true;
      return ALL_POSTS;
    });

  return POSTS_LOADING;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function getAllTags() {
  const tags = new Set();
  ALL_POSTS.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
  return [...tags];
}

let currentBlogFilter = { search: '', tag: '' };

function renderBlogList() {
  const listEl = document.getElementById('blog-posts-list');
  const sidebarEl = document.getElementById('blog-tag-cloud');
  if (!listEl) return;

  if (!POSTS_LOADED) {
    listEl.innerHTML = '<p style="color:var(--ink3);padding:2rem 0;">Carregando posts...</p>';
    loadPosts().then(renderBlogList);
    return;
  }

  if (sidebarEl && !sidebarEl.dataset.rendered) {
    const tags = getAllTags();
    sidebarEl.innerHTML = tags.map(t =>
      `<button class="tag-cloud-item" onclick="filterByTag('${t}', this)">${t}</button>`
    ).join('');
    sidebarEl.dataset.rendered = 'true';
  }

  let filtered = ALL_POSTS;
  if (currentBlogFilter.search) {
    const q = currentBlogFilter.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }
  if (currentBlogFilter.tag) {
    filtered = filtered.filter(p => (p.tags || []).includes(currentBlogFilter.tag));
  }

  if (filtered.length === 0) {
    listEl.innerHTML = '<p style="color:var(--ink3);padding:2rem 0;">Nenhum post encontrado.</p>';
    return;
  }

  listEl.innerHTML = filtered.map(p => `
    <article class="blog-post-card">
      <div class="blog-post-date">${formatDate(p.date)}</div>
      <h3 class="blog-post-title"><a href="#" onclick="openPost('${p.id}');return false">${p.title}</a></h3>
      <p class="blog-post-excerpt">${p.excerpt}</p>
      <div class="blog-post-tags">${(p.tags || []).map(t => `<span class="blog-tag">${t}</span>`).join('')}</div>
      <a class="blog-read-more" href="#" onclick="openPost('${p.id}');return false">Ler post completo →</a>
    </article>
  `).join('');
}

function searchBlog(value) {
  currentBlogFilter.search = value;
  renderBlogList();
}

function filterByTag(tag, btn) {
  const isActive = currentBlogFilter.tag === tag;
  currentBlogFilter.tag = isActive ? '' : tag;
  document.querySelectorAll('.tag-cloud-item').forEach(b => b.classList.remove('active'));
  if (!isActive) btn.classList.add('active');
  renderBlogList();
}

function openPost(id) {
  const post = ALL_POSTS.find(p => p.id === id);
  if (!post) return;

  document.getElementById('page-blog').classList.remove('active');
  document.getElementById('page-blog-post').classList.add('active');

  const paragraphs = post.content
    .split('\n\n')
    .map(p => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
    .join('');

  document.getElementById('blog-post-detail').innerHTML = `
    <button class="blog-back" onclick="closePost()">← Voltar para o blog</button>
    <div class="blog-post-tags" style="margin-bottom:1rem">${(post.tags || []).map(t => `<span class="blog-tag">${t}</span>`).join('')}</div>
    <h1 class="blog-detail-title">${post.title}</h1>
    <div class="blog-detail-meta">${formatDate(post.date)}</div>
    <div class="blog-detail-body">${paragraphs}</div>
  `;

  const commentsWrap = document.getElementById('utterances-comments');
  commentsWrap.innerHTML = '';

  if (post.comments_enabled) {
    document.getElementById('comments-section').style.display = 'block';
    loadComments(post.id, commentsWrap);
  } else {
    document.getElementById('comments-section').style.display = 'none';
  }

  window.scrollTo({ top: 0 });
}

function closePost() {
  document.getElementById('page-blog-post').classList.remove('active');
  document.getElementById('page-blog').classList.add('active');
  window.scrollTo({ top: 0 });
}





// ════════════════════════════════════════════
// FORMULÁRIO DE CONTATO — Web3Forms
// ════════════════════════════════════════════
async function submitContact(event) {
  event.preventDefault();
  const form = event.target;
  const statusEl = document.getElementById('contact-status');
  const btn = form.querySelector('.form-submit');
  await submitContactFirebase(form, statusEl, btn);
}

// ════════════════════════════════════════════
// ÁREA RESTRITA — Firebase/Web3Forms
// ════════════════════════════════════════════
async function submitAreaRestrita(event) {
  event.preventDefault();
  const form = event.target;
  const statusEl = document.getElementById('area-restrita-status');
  const btn = form.querySelector('.form-submit');
  await submitAreaRestritaFirebase(form, statusEl, btn);
}

function tryUnlock(event) {
  event.preventDefault();
  const input = document.getElementById('unlock-password');
  const errorEl = document.getElementById('unlock-error');
  if (input.value === CONFIG.SENHA_AREA_RESTRITA) {
    document.getElementById('locked-content').style.display = 'none';
    document.getElementById('unlocked-content').style.display = 'block';
    sessionStorage.setItem('area_unlocked', 'true');
  } else {
    errorEl.style.display = 'block';
    input.value = '';
  }
}


function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Disponibiliza funções para os onclick do HTML mesmo usando script type="module"
window.showPage = showPage;
window.showTab = showTab;
window.searchBlog = searchBlog;
window.filterByTag = filterByTag;
window.openPost = openPost;
window.closePost = closePost;
window.submitContact = submitContact;
window.submitAreaRestrita = submitAreaRestrita;
window.tryUnlock = tryUnlock;

// ════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  loadPosts();
  if (sessionStorage.getItem('area_unlocked') === 'true') {
    const locked = document.getElementById('locked-content');
    const unlocked = document.getElementById('unlocked-content');
    if (locked && unlocked) {
      locked.style.display = 'none';
      unlocked.style.display = 'block';
    }
  }
});
