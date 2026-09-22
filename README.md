# gugarciac.github.io

Portfólio de Gustavo Garcia, publicado em https://gugarciac.github.io.

Três arquivos e nenhuma dependência: `index.html`, `assets/style.css` e `assets/app.js`.
Sem framework, sem etapa de build, sem gerenciador de pacotes. Abra o `index.html` no navegador e está rodando.

## Como atualizar

Tudo que aparece no site está escrito no `index.html`, em português, na ordem em que aparece na tela.

- **Adicionar um projeto**: copie um bloco `<article class="entry">` dentro de `<div class="ledger">`, troque o `id`, o ano, o título, a linha de resumo, a lista de tecnologias e os textos. Os mais recentes ficam no topo. O primeiro projeto tem `<details open>`, para a página já abrir com conteúdo à mostra; os demais ficam fechados.
- **Projeto que tem site ou código público**: acrescente os botões em `<p class="entry__links">` (veja o Diário de Notícias). Quando o código é privado, a ficha diz "privado" e não há link.
- **Diagrama**: o bloco `<pre class="diagram">` é texto puro; desenhe com `─ ▶ │ ▼` ou apague o bloco se o projeto não pede.
- **Miniaturas**: cada projeto usa uma imagem de `assets/shots/` (1440×900 para sites, 390×844 para apps de celular). Para trocar, substitua o arquivo mantendo o nome.
- **Certificados**: a seção fica escondida até existir pelo menos um item. Copie o modelo comentado acima da seção para dentro de `<ol class="certs">` e coloque o PDF ou a imagem em `assets/certificados/`.
- **Trajetória, ficha técnica e contato**: edite as listas nas seções correspondentes.
- **Data de atualização**: no rodapé, dentro de `<footer class="colophon">`.

## Publicação

O site é servido pelo GitHub Pages a partir do branch `main`. Todo push em `main` publica em alguns minutos. O arquivo `.nojekyll` evita o processamento do Jekyll.
