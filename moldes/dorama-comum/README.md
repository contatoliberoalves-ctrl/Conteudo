# Identidade Cristão Dorameiro (@cristaodorameiro)

Base dos moldes `dorama-carrossel`, `dorama-post` e `dorama-nativo` (`identidade.mjs` e `render-base.mjs`).

- **Cores (as do Canva do perfil):** turquesa `#00CBAD` (capas e fechamento), laranja `#FFA34E` (destaques em itálico com contorno, estrelas, pétalas), branco e menta clarinho (conteúdo), pêssego (memes), petróleo escuro `#0E2A27` (versículos e capas com foto), com o vermelho `#CD2E3A` e o azul `#0047A0` da bandeira da Coreia só como detalhe (sombra do DORAMEIRO, bolinha da marca). Fundos: `turquesa`, `creme`/`branco`, `rosa`/`menta`, `laranja`, `noite`/`escuro`.
- **Fontes:** Fraunces (títulos; itálico laranja ou turquesa nos destaques), Plus Jakarta Sans (texto), Noto Serif KR (hangul decorativo), Figtree 800 (texto nativo do Insta); no logo, Lilita One (CRISTÃO, laranja com contorno) e Audiowide (DORAMEIRO, sombra vermelha e azul).
- **Marca (proposta B do molde `dorama-logo`, escolhida pelo usuário):** os quatro trigramas da bandeira formam uma cruz em volta do taegeuk (`cruzTrigramas`, `marca`), + "CRISTÃO DORAMEIRO". Avatar do perfil: `dorama-logo/saida/logo-b-trigramas/avatar.png`.
- **Assinaturas:** etiqueta "EP. 02 / 06" no topo dos slides, pétalas de cerejeira, cartaz do dorama, legenda de cena (branca com contorno) nos memes, estrelas e barras nas notas.
- **Texto rico:** `*itálico*` (serifa itálica rosa), `**negrito**`, `\n` quebra a linha.
- **Fotos** (cenas, pôsteres, fotos do autor) vão em `dorama-comum/fotos/`, **fora do git** (o repositório é público e as imagens de dorama têm direito autoral). Sem foto, o cartaz e a cena são tipográficos, em degradê com luzes. Os exemplos de capa com foto usam cenários da Coreia com licença livre (Wikimedia Commons; autores e licenças em `fotos/CREDITOS.txt`, recrie baixando de lá). Cenas: `noite`, `cerejeira`, `por`, `mar`, `neve`, `verde`, `vinho`.

## Fotos dos doramas
Os originais ficam no Drive do usuário, pasta "Fotos dos doramas" (https://drive.google.com/drive/folders/14WpPJSegzlVjJ54SRNcIHN9b4_QIFVRG), uma subpasta por dorama (`advogada-extraordinaria`, `pousando-no-amor`, `move-to-heaven`, `hometown-cha-cha-cha`, `goblin`, `reply-1988`) com `poster-01.jpg`, `cena-01.jpg`…, e a planilha `creditos`. Numa sessão nova, baixe tudo para `fotos/<dorama>/` (conector do Drive: `download_file_content` grava o base64 num arquivo; decodifique com python). Nos dados, `foto: "pousando-no-amor/cena-05.jpg"`; no `dorama` (cartaz), `foto` com o pôster. Crédito na capa: `"credito": "Imagem: tvN"` (emissora/produtora).

`acervo.json`: doramas e filmes que já apareceram no perfil e os formatos de post já usados (lidos do Canva).
