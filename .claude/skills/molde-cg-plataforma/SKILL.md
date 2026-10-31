---
name: molde-cg-plataforma
description: Gera posts (carrosséis e telas únicas 1080×1350) no molde "Plataforma (divulgação)" do @constitucionalgabaritado, que divulgam a plataforma Constitucional com Líbero (Reforço) com prints dela em janelas de navegador, notebook e celular. Versões sem foto (vitrine escura e recursos clara) e com foto do autor. Use quando pedirem post de divulgação da plataforma, do Reforço ou "como é por dentro".
---

# Molde: Plataforma (divulgação)

Pasta `moldes/cg-plataforma/`. Leia o `README.md`.

1. Prints da plataforma em `prints/` (fora do git). Numa sessão nova, baixe da pasta do Drive indicada no README e
   rode `python3 recortar_prints.py <pasta>` (cria os JPG e os recortes `c_*.jpg`).
2. Os posts são funções em `render.mjs` (`POSTS`). Para um post novo, copie a estrutura de `carrossel-vitrine`
   (escuro) ou `carrossel-recursos` (claro): capa com pouco texto, um recurso por slide com título curto, no máximo
   3 benefícios e a tela grande. Acrescente o id em `dados.json`.
3. Só afirme o que aparece nos prints (números, recursos). Sem preço sem confirmação.
4. Gere com `node render.mjs <id>` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY`), confira os PNGs e atualize a galeria principal (`python3 galeria/atualizar.py cg-plataforma`).
