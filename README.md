# gugarciac.github.io

Portfólio de Gustavo Garcia, publicado em https://gugarciac.github.io.

HTML, CSS e JavaScript sem framework e sem etapa de build: `index.html`, `assets/tokens.css`, `assets/style.css` e `assets/app.js`. Abra o `index.html` no navegador e está rodando.

## Sistema de design

- `assets/tokens.css` traz os tokens do sistema de design (cores, tipografia, espaçamento, raios). Não edite as cores ou tamanhos direto no `style.css`: use os tokens.
- Galeria branca com faixas `--color-studio-mist` e cartões brancos de 28 px. Azul só em links (`--color-apple-blue`) e botões de ação (`--color-pricing-blue`). Laranja (`--color-launch-orange`) só para status como "Em produção".
- Tipografia: SF Pro nos aparelhos Apple, pela fonte do sistema, e Inter nos demais.
- Sem sombras projetadas: separação por contraste de fundo e contornos de 1 px.

## Como atualizar

Tudo que aparece no site está no `index.html`, em português, na ordem da tela.

- **Destaques** (carrossel): cada cartão é um `<li class="hl__card">` dentro de `#hl-track`. O `data-open` aponta para o `id` do projeto na lista, que abre ao clicar. Se adicionar ou remover um cartão, ajuste também os botões `hl__dot`.
- **Projetos**: cada projeto é um `<article class="entry">` dentro de `<div class="ledger">`, do mais recente ao mais antigo. O status em laranja fica em `entry__status`; a linha de resultado, em `entry__note`.
- **Links de um projeto**: botões em `<p class="entry__links">`. Quando o código é privado, a ficha diz "privado" e não há link.
- **Miniaturas e capturas**: imagens em `assets/shots/` (1440×900 para sites, 390×844 para apps de celular). Para trocar, substitua o arquivo mantendo o nome.
- **Números**: a seção "Em números." fica logo depois dos destaques.
- **Certificados**: a seção fica escondida até existir pelo menos um item. Copie o modelo comentado acima da seção para dentro de `<ol class="certs">` e coloque o PDF ou a imagem em `assets/certificados/`.
- **Data de atualização**: no rodapé.

## Movimento

A abertura entra em sequência, a captura do Diário cresce na rolagem e as seções sobem ao entrar na tela. Nos navegadores com animação ligada à rolagem, isso é só CSS; nos demais, o `app.js` faz o mesmo com `IntersectionObserver`. Quem ativa "reduzir movimento" no sistema não vê animação.

## Publicação

O site é servido pelo GitHub Pages a partir do branch `main`. Todo push em `main` publica em alguns minutos. O arquivo `.nojekyll` evita o processamento do Jekyll.
