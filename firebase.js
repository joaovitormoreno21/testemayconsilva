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
    <div style="border-bottom:1px solid var(--border2);padding:14px 0;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
        <div style="width:32px;height:32px;border-radius:50%;background:var(--accent);
          display:flex;align-items:center;justify-content:center;
          color:#fff;font-size:13px;font-weight:500;flex-shrink:0;">
          ${c.nome.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style="font-size:13.5px;font-weight:500;color:var(--ink)">${escHtml(c.nome)}</div>
          <div style="font-size:11.5px;color:var(--ink3)">${formatTs(c.createdAt)}</div>
        </div>
      </div>
      <div style="font-size:14px;color:var(--ink2);line-height:1.65;padding-left:42px">
        ${escHtml(c.texto).replace(/\n/g,'<br>')}
      </div>
    </div>
  `).join('');

  containerEl.innerHTML = `
    <div style="margin-bottom:1.5rem">
      ${comments.length === 0
        ? '<p style="color:var(--ink3);font-size:13px;padding:1rem 0">Seja o primeiro a comentar.</p>'
        : list}
    </div>
    <div style="background:var(--white);border:1px solid var(--border);border-radius:10px;padding:1.25rem;">
      <div style="font-size:13px;font-weight:500;color:var(--ink2);margin-bottom:12px">Deixar um comentário</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <input id="comment-nome" type="text" placeholder="Seu nome"
          style="font-family:var(--sans);font-size:14px;padding:9px 12px;
            border:1px solid var(--border);border-radius:7px;background:var(--bg)">
        <textarea id="comment-texto" placeholder="Escreva seu comentário..." rows="4"
          style="font-family:var(--sans);font-size:14px;padding:9px 12px;
            border:1px solid var(--border);border-radius:7px;background:var(--bg);resize:vertical"></textarea>
        <button onclick="submitComment('${postId}')"
          style="align-self:flex-start;font-family:var(--sans);font-size:13.5px;
            font-weight:500;color:#fff;background:var(--accent);border:none;
            padding:9px 20px;border-radius:7px;cursor:pointer;">
          Publicar comentário
        </button>
        <div id="comment-status" style="font-size:13px;display:none"></div>
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
