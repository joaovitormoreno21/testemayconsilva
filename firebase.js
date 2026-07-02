// ════════════════════════════════════════════
// FIREBASE — Comentários, Contato, Área Restrita
// Para migrar para conta do Maycon: troque apenas o bloco firebaseConfig
// ════════════════════════════════════════════
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCu1oAhRCcmwdiw4hkucvRzLr3TJ8OF0GI",
  authDomain: "maycon-site.firebaseapp.com",
  projectId: "maycon-site",
  storageBucket: "maycon-site.firebasestorage.app",
  messagingSenderId: "766552716213",
  appId: "1:766552716213:web:f4f9fff55b253f492ddffc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── COMENTÁRIOS ──────────────────────────────
export async function loadComments(postId, containerEl) {
  containerEl.innerHTML = '<p style="color:var(--ink3);font-size:13px">Carregando comentários...</p>';
  try {
    const q = query(
      collection(db, 'comentarios', postId, 'items'),
      orderBy('createdAt', 'asc')
    );
    const snap = await getDocs(q);
    const comments = [];
    snap.forEach(doc => comments.push({ id: doc.id, ...doc.data() }));
    renderComments(comments, containerEl, postId);
  } catch (e) {
    containerEl.innerHTML = '<p style="color:var(--ink3);font-size:13px">Erro ao carregar comentários.</p>';
  }
}

function renderComments(comments, containerEl, postId) {
  const list = comments.map(c => `
    <article class="comment-item">
      <div class="comment-avatar">${escHtml(c.nome || '?').charAt(0).toUpperCase()}</div>
      <div class="comment-body">
        <div class="comment-meta">
          <strong>${escHtml(c.nome)}</strong>
          <span>${formatTs(c.createdAt)}</span>
        </div>
        <div class="comment-text">${escHtml(c.texto).replace(/\n/g,'<br>')}</div>
      </div>
    </article>
  `).join('');

  containerEl.innerHTML = `
    <div class="comment-list">
      ${comments.length === 0
        ? '<div class="comment-empty">Ainda não há comentários neste texto.</div>'
        : list}
    </div>
    <div class="comment-form-card">
      <div class="comment-form-title">Escrever comentário</div>
      <div class="comment-form-grid">
        <input id="comment-nome" class="comment-input" type="text" placeholder="Seu nome">
        <textarea id="comment-texto" class="comment-textarea" placeholder="Escreva seu comentário..." rows="4"></textarea>
        <button onclick="submitComment('${postId}')" class="comment-submit">
          Publicar comentário
        </button>
        <div id="comment-status" class="comment-status"></div>
      </div>
    </div>
  `;
}

window.submitComment = async function(postId) {
  const nome = document.getElementById('comment-nome').value.trim();
  const texto = document.getElementById('comment-texto').value.trim();
  const statusEl = document.getElementById('comment-status');

  if (!nome || !texto) {
    statusEl.textContent = 'Preencha nome e comentário.';
    statusEl.style.color = 'var(--danger)';
    statusEl.style.display = 'block';
    return;
  }

  const btn = document.querySelector('[onclick="submitComment(\'' + postId + '\')"]');
  btn.disabled = true;
  btn.textContent = 'Publicando...';

  try {
    await addDoc(collection(db, 'comentarios', postId, 'items'), {
      nome, texto, createdAt: serverTimestamp()
    });
    const wrap = document.getElementById('utterances-comments');
    await loadComments(postId, wrap);
  } catch (e) {
    statusEl.textContent = 'Erro ao publicar. Tente novamente.';
    statusEl.style.color = 'var(--danger)';
    statusEl.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Publicar comentário';
  }
};

// ── CONTATO ──────────────────────────────────
export async function submitContactFirebase(form, statusEl, btn) {
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  try {
    await addDoc(collection(db, 'contatos'), {
      nome: form.nome.value,
      email: form.email.value,
      instituicao: form.instituicao.value,
      curso_disciplina: form.curso_disciplina.value,
      mensagem: form.descricao.value,
      createdAt: serverTimestamp(),
      lido: false
    });

    // Também envia via Web3Forms para chegar no email
    const data = {
      access_key: '0516b733-8803-4697-97d6-81293f0b6bad',
      subject: 'Contato via site — Maycon Silva Aguiar',
      from_name: form.nome.value,
      email: form.email.value,
      instituicao: form.instituicao.value,
      curso_disciplina: form.curso_disciplina.value,
      mensagem: form.descricao.value,
      botcheck: '',
    };
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });

    statusEl.textContent = 'Mensagem enviada! O Maycon vai receber por e-mail e responder em breve.';
    statusEl.className = 'form-status show success';
    form.reset();
  } catch (e) {
    statusEl.textContent = 'Não foi possível enviar. Tente novamente.';
    statusEl.className = 'form-status show error';
  }
  btn.disabled = false;
  btn.textContent = 'Enviar mensagem';
}

// ── ÁREA RESTRITA ─────────────────────────────
export async function submitAreaRestritaFirebase(form, statusEl, btn) {
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  try {
    await addDoc(collection(db, 'area_restrita_cadastros'), {
      nome: form.nome.value,
      email: form.email.value,
      instituicao: form.instituicao.value,
      curso_disciplina: form.curso_disciplina.value,
      createdAt: serverTimestamp(),
      aprovado: false
    });

    // Notifica Maycon por email via Web3Forms
    const data = {
      access_key: '0516b733-8803-4697-97d6-81293f0b6bad',
      subject: 'Novo cadastro — Área Restrita',
      from_name: form.nome.value,
      email: form.email.value,
      instituicao: form.instituicao.value,
      curso_disciplina: form.curso_disciplina.value,
      mensagem: 'Novo pedido de acesso à área restrita.',
      botcheck: '',
    };
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });

    statusEl.textContent = 'Cadastro enviado! O Maycon vai te enviar a senha por e-mail em breve.';
    statusEl.className = 'form-status show success';
    form.reset();
  } catch (e) {
    statusEl.textContent = 'Não foi possível enviar. Tente novamente.';
    statusEl.className = 'form-status show error';
  }
  btn.disabled = false;
  btn.textContent = 'Solicitar acesso';
}

// ── UTILS ─────────────────────────────────────
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function formatTs(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });
}
