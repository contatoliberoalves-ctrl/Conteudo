# Post Eduarda

Posts de tela única (1080×1350) da Eduarda Caraciolo (Advogada · Direito Civil e ECA), no clima das referências dela (weroutine e Amanda Fernandes).

```
CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]
```
Saída: `saida/<id>/1.png` e `painel.png`.

## dados.json
Lista de posts: `id`, `titulo` (nome na galeria), `layout` e os campos do layout. Marcação: `**negrito**`, `*cursiva*`, `{cor}`, `\n`.

**frase**: `frase` (frase curta, minúsculas, 2 a 4 linhas; `\n` quebra), `fim` (palavra final em cursiva, grande), `cor` (nevoa, salvia, cafe, rosa, areia), `alinhar` (`esquerda` ou centro), `fotos[]` (até 2, redondas, entre a frase e o fim), `fotosPos[]`, `ts` (tamanho da frase, padrão 150), `fimEscala` (tamanho do fim em relação à frase, padrão 1.35; diminua se o fim for longo).

**convite**: `manchete` (use `{…}` para o trecho rosa), `texto` (até ~25 palavras), `palavra` (a palavra para comentar), `oque` (o que ela manda: "o link", "o material"…), `conversa[]` (`{de: "ela" | "eu", texto}`, 2 ou 3 mensagens), `fundo` (palavra cursiva gigante ao fundo, ex.: "direito").

Fotos: `fotos/` (fora do git) ou as de exemplo em `../carrossel-eduarda-pop/imagens/`.
