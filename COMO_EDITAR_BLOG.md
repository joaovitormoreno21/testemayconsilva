# Como adicionar um novo post no blog

Você não precisa mexer no design do site. Para publicar um novo post, edite
apenas o arquivo `posts.json` — é uma lista simples, sem código HTML.

## Passo a passo

1. Abra o arquivo `posts.json` no GitHub (ou peça para o João abrir)
2. Copie um dos blocos abaixo e cole no TOPO da lista (logo depois do `[`)
3. Preencha os campos
4. Salve — o post aparece automaticamente no site

## Modelo para copiar

```json
{
  "id": "4",
  "title": "Título do novo post aqui",
  "date": "2026-07-15",
  "excerpt": "Um resumo curto de 1-2 frases que aparece na lista de posts.",
  "tags": ["tema1", "tema2"],
  "content": "O texto completo do post vai aqui.\n\nPara pular linha e criar um novo parágrafo, use \\n\\n entre os parágrafos, como nesse exemplo.",
  "comments_enabled": true
}
```

## Regras importantes

- **id**: sempre um número novo, maior que o último (se o último post tem
  id "3", o próximo é "4")
- **date**: formato AAAA-MM-DD (ano-mês-dia), exemplo: 2026-07-15
- **tags**: pode ter quantas quiser, sempre entre aspas e separadas por vírgula
- **content**: para parágrafos separados, use `\n\n` (barra invertida, n, barra
  invertida, n) entre eles
- Não esqueça da vírgula `,` depois de `}` se não for o último post da lista
- O último post da lista não leva vírgula depois do `}`

## Se algo der errado

Arquivos JSON são sensíveis a erros de formatação (vírgulas faltando, aspas
erradas). Se o blog parar de mostrar os posts depois de uma edição, é quase
sempre isso. Pode mandar o arquivo para o João revisar.
