# Site Maycon Silva Aguiar — Guia de Deploy e Configuração

## Estrutura dos arquivos

```
index.html      → o site inteiro (todas as 6 abas)
style.css       → todo o visual
script.js       → toda a lógica (blog, busca, área restrita, formulários)
posts.json      → os posts do blog (edite SÓ este arquivo para novo post)
COMO_EDITAR_BLOG.md → guia para o Maycon publicar posts sozinho
```

## 1. Hospedar no GitHub Pages

1. Crie um repositório novo no GitHub (pode ser público)
2. Suba estes 5 arquivos para a raiz do repositório
3. Vá em **Settings → Pages**
4. Em "Source", selecione a branch `main` e pasta `/ (root)`
5. Salve — em alguns minutos o site estará em `https://seuusuario.github.io/nome-do-repo`

## 2. Conectar o domínio que o Maycon comprou

1. No mesmo painel **Settings → Pages**, em "Custom domain", digite o domínio
   (ex: `mayconsilvaaguiar.com`)
2. No painel do WordPress.com onde o domínio foi comprado, vá em
   **Domínios → DNS** e adicione estes registros:

   ```
   Tipo: A      | Nome: @  | Valor: 185.199.108.153
   Tipo: A      | Nome: @  | Valor: 185.199.109.153
   Tipo: A      | Nome: @  | Valor: 185.199.110.153
   Tipo: A      | Nome: @  | Valor: 185.199.111.153
   Tipo: CNAME  | Nome: www | Valor: seuusuario.github.io
   ```

3. Aguarde a propagação (pode levar até 24h, geralmente é mais rápido)
4. No GitHub Pages, marque "Enforce HTTPS" depois que o domínio propagar

## 3. Ativar os formulários (Formspree — gratuito)

O site usa [Formspree](https://formspree.io) para os 3 formulários: contato,
área restrita e newsletter. É gratuito até 50 envios/mês, suficiente para
começar.

1. Crie uma conta gratuita em formspree.io
2. Crie 3 forms separados: "Contato", "Área Restrita", "Newsletter"
3. Configure cada um para notificar:
   - `mayconsilvaaguiar@gmail.com`
   - `maycon.aguiar@ifrj.edu.br`
4. Copie o endpoint de cada form (formato `https://formspree.io/f/xxxxxxx`)
5. Abra o arquivo `script.js`, no topo, e cole nos campos:

```js
FORMSPREE_CONTATO: 'https://formspree.io/f/SEU_ID_AQUI',
FORMSPREE_AREA_RESTRITA: 'https://formspree.io/f/SEU_ID_AQUI_2',
FORMSPREE_NEWSLETTER: 'https://formspree.io/f/SEU_ID_AQUI_3',
```

## 4. Ativar comentários (Giscus — gratuito)

Comentários no blog usam [Giscus](https://giscus.app), que funciona via
GitHub Discussions — sem precisar de servidor próprio, e permite comentário
anônimo (usando uma conta GitHub genérica) ou identificado.

1. No repositório do site, vá em **Settings → General → Features** e ative
   "Discussions"
2. Acesse [giscus.app](https://giscus.app), cole a URL do seu repositório
3. Configure as opções (recomendo: mapeamento por "pathname", tema "light")
4. Copie o script gerado no final da página
5. Abra `script.js`, encontre a função `loadGiscus()` e substitua o
   placeholder pelo script copiado

## 5. Área restrita — nota de segurança importante

A senha da área restrita está configurada em `script.js`:

```js
SENHA_AREA_RESTRITA: 'linguistica2026',
```

**Atenção:** como o site é 100% estático (sem servidor), essa senha fica
visível para qualquer pessoa que abrir o código-fonte da página (clicar com
botão direito → "Ver código-fonte"). Isso é adequado para barrar acesso
casual, mas não é segurança real contra alguém com conhecimento técnico.

Para a função pretendida — controlar quem acessa materiais de disciplina —
isso é suficiente na prática, já que o fluxo real de controle é o cadastro
manual e o Maycon decidindo quem recebe a senha. Mas é importante que ele
saiba dessa limitação.

Se no futuro for necessário um controle mais rígido (login individual por
pessoa, por exemplo), seria necessário migrar para uma solução com backend
real — fora do escopo do GitHub Pages puro.

Para trocar a senha: edite a linha acima em `script.js` e suba a alteração
no GitHub.

## 6. Testando localmente antes de subir

Para ver o site funcionando no seu computador antes de publicar:

```bash
cd pasta-do-site
python3 -m http.server 8000
```

Depois abra `http://localhost:8000` no navegador. O blog só carrega
corretamente assim (servidor local) ou já publicado no GitHub Pages —
abrir o `index.html` direto clicando duas vezes não carrega o `posts.json`
por restrição de segurança do navegador.

## 7. Próximos passos pendentes

Estas páginas estão com placeholder aguardando conteúdo do Maycon:

- **Quem sou eu** — apresentação pessoal detalhada
- **Laboratório e projetos de pesquisa** — projetos em andamento
- **Área restrita** — lista real de disciplinas e arquivos

Quando o conteúdo chegar, essas seções são editadas diretamente no
`index.html`, seguindo o mesmo padrão visual das outras abas.
