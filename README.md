# Site Maycon Silva Aguiar — Deploy e Configuração

## Estrutura dos arquivos

```text
index.html   → estrutura do site e páginas
style.css    → visual do site
script.js    → navegação, blog, busca, abas e área restrita
firebase.js  → comentários, formulário de contato e solicitação de acesso
posts.json   → posts do blog
```

## Correções aplicadas nesta versão

- Menu e botões corrigidos para funcionar com `script type="module"`.
- Imagem principal alterada para usar a foto já hospedada no site atual do Maycon.
- Blog com carregamento mais seguro do `posts.json`.
- Conteúdo dos posts escapado para evitar problemas com HTML digitado no JSON.
- README atualizado para refletir o uso real de Firebase + Web3Forms.

## 1. Hospedar no GitHub Pages

1. Crie um repositório novo no GitHub.
2. Suba os arquivos para a raiz do repositório.
3. Vá em **Settings → Pages**.
4. Em **Source**, selecione a branch `main` e a pasta `/ (root)`.
5. Salve. O site ficará disponível em algo como:

```text
https://seuusuario.github.io/nome-do-repositorio
```

## 2. Conectar o domínio comprado no WordPress.com

No GitHub Pages, em **Settings → Pages → Custom domain**, digite:

```text
mayconsilvaaguiar.com
```

Depois, no painel do WordPress.com onde o domínio foi comprado, entre em **Domínios → DNS** e configure:

```text
Tipo: A      | Nome: @   | Valor: 185.199.108.153
Tipo: A      | Nome: @   | Valor: 185.199.109.153
Tipo: A      | Nome: @   | Valor: 185.199.110.153
Tipo: A      | Nome: @   | Valor: 185.199.111.153
Tipo: CNAME  | Nome: www | Valor: seuusuario.github.io
```

Depois que propagar, marque **Enforce HTTPS** no GitHub Pages.

A propagação pode levar algumas horas.

## 3. Foto principal

Nesta versão, a imagem principal usa a foto já hospedada no site atual:

```text
https://mayconsilvaaguiar.com/wp-content/uploads/2026/04/servletrecuperafoto.jpg
```

Se quiser deixar o site 100% independente do WordPress, baixe essa imagem, coloque na pasta do projeto com o nome `foto.jpg` e altere o `src` da imagem no `index.html`.

## 4. Blog

Os posts ficam em `posts.json`.

Para adicionar um post, copie o modelo abaixo:

```json
{
  "id": "4",
  "title": "Título do post",
  "date": "2026-06-01",
  "excerpt": "Resumo curto do post.",
  "tags": ["tema 1", "tema 2"],
  "content": "Texto completo do post. Use duas quebras de linha para separar parágrafos.",
  "comments_enabled": true
}
```

Evite repetir IDs.

## 5. Comentários, contato e área restrita

O arquivo `firebase.js` usa Firebase/Firestore para:

- comentários do blog;
- mensagens de contato;
- solicitações de acesso à área restrita.

Ele também envia notificações por e-mail via Web3Forms.

Para migrar para uma conta do Maycon, troque o bloco `firebaseConfig` no arquivo `firebase.js` e revise a chave do Web3Forms usada no mesmo arquivo.

## 6. Área restrita

A senha atual está em `script.js`:

```js
SENHA_AREA_RESTRITA: 'linguistica2026'
```

Como o site é estático, essa senha fica visível no código-fonte. Ela serve como uma barreira simples para acesso casual, mas não é segurança real.

Para controle de acesso com login individual, seria necessário usar backend/autenticação real.

## 7. Pontos que ainda precisam ser revisados antes da entrega final

- Conferir os links reais de Lattes, ORCID, ResearchGate e Academia.edu.
- Confirmar se o WhatsApp e e-mails estão corretos.
- Substituir os textos de placeholder nas páginas "Quem sou eu" e "Laboratório e projetos de pesquisa".
- Revisar as regras do Firestore para permitir as leituras/gravações necessárias.
