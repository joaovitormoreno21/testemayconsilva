// ════════════════════════════════════════════
// CONFIGURAÇÃO
// ════════════════════════════════════════════
const CONFIG = {
  // Web3Forms — contato (coloque sua access_key abaixo)
  WEB3FORMS_KEY: '0516b733-8803-4697-97d6-81293f0b6bad',

  // Utterances — comentários via GitHub Issues (100% gratuito, sem anúncios)
  GITHUB_REPO: 'joaovitormoreno21/testemayconsilva',

  // Área restrita
  FORMSPREE_AREA_RESTRITA: 'https://formspree.io/f/SEU_ID_AQUI',
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

async function loadPosts() {
  try {
    const res = await fetch('posts.json');
    ALL_POSTS = await res.json();
    ALL_POSTS.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (e) {
    ALL_POSTS = [];
  }
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

  const paragraphs = post.content.split('\n\n').map(p => `<p>${p}</p>`).join('');

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
    loadUtterances(post.id);
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

function loadUtterances(postId) {
  const script = document.createElement('script');
  script.src = 'https://utteranc.es/client.js';
  script.setAttribute('repo', CONFIG.GITHUB_REPO);
  script.setAttribute('issue-term', 'post-' + postId);
  script.setAttribute('theme', 'github-light');
  script.setAttribute('crossorigin', 'anonymous');
  script.async = true;
  document.getElementById('utterances-comments').appendChild(script);
}



// ════════════════════════════════════════════
// FORMULÁRIO DE CONTATO — Web3Forms
// ════════════════════════════════════════════
async function submitContact(event) {
  event.preventDefault();
  const form = event.target;
  const statusEl = document.getElementById('contact-status');
  const btn = form.querySelector('.form-submit');

  btn.disabled = true;
  btn.textContent = 'Enviando...';

  const data = {
    access_key: CONFIG.WEB3FORMS_KEY,
    subject: 'Contato via site — Maycon Silva Aguiar',
    from_name: form.nome.value,
    email: form.email.value,
    instituicao: form.instituicao.value,
    curso_disciplina: form.curso_disciplina.value,
    mensagem: form.descricao.value,
    to: 'mayconsilvaaguiar@gmail.com,maycon.aguiar@ifrj.edu.br',
    botcheck: '',
  };

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (json.success) {
      statusEl.textContent = 'Mensagem enviada! O Maycon vai receber por e-mail e responder em breve.';
      statusEl.className = 'form-status show success';
      form.reset();
    } else {
      throw new Error('Falha');
    }
  } catch (e) {
    statusEl.textContent = 'Não foi possível enviar. Tente novamente ou use o e-mail direto abaixo.';
    statusEl.className = 'form-status show error';
  }

  btn.disabled = false;
  btn.textContent = 'Enviar mensagem';
}

// ════════════════════════════════════════════
// ÁREA RESTRITA — Formspree (mantido)
// ════════════════════════════════════════════
async function submitAreaRestrita(event) {
  event.preventDefault();
  const form = event.target;
  const statusEl = document.getElementById('area-restrita-status');
  const btn = form.querySelector('.form-submit');

  btn.disabled = true;
  btn.textContent = 'Enviando...';

  try {
    const res = await fetch(CONFIG.FORMSPREE_AREA_RESTRITA, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    });
    if (res.ok) {
      statusEl.textContent = 'Cadastro enviado! O Maycon vai te enviar a senha por e-mail em breve.';
      statusEl.className = 'form-status show success';
      form.reset();
    } else { throw new Error(); }
  } catch (e) {
    statusEl.textContent = 'Não foi possível enviar. Tente novamente.';
    statusEl.className = 'form-status show error';
  }

  btn.disabled = false;
  btn.textContent = 'Solicitar acesso';
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
