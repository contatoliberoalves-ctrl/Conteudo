---
name: molde-carrossel-nativo
description: Gera carrosséis no molde "Carrossel Nativo" do @liberofilho: foto do autor em tela cheia (ensaio, descontraída ou paisagem de viagem) + frases no estilo do texto nativo do Instagram (balões arredondados, fonte Classic, preto/branco/cores do app), em 3:4. Use quando o usuário mandar fotos pedindo "foto + frase", "estilo nativo do Insta", "texto do próprio Instagram" ou "Carrossel Nativo", ou quiser produzir muitos carrosséis simples com fotos dele.
---

# Molde: Carrossel Nativo (@liberofilho)

Pasta: `moldes/carrossel-nativo/`. O visual está em `template.mjs` e **não deve ser alterado** para gerar posts; só se edita `dados.json`.

## Passo a passo

1. Leia `moldes/carrossel-nativo/README.md` e o carrossel de exemplo em `dados.json`.
2. Fotos: salve as que o usuário mandar em `moldes/carrossel-nativo/fotos/` (fora do git, o repositório é público) com nomes curtos. **Olhe cada foto** antes de posicionar o texto: as frases não podem cobrir o rosto dele nem o ponto principal da paisagem. Use `fotoPos` para enquadrar.
3. Monte os slides como nos posts dele:
   - Capa: 1 bloco de destaque (cor: `bege`, `lilas`, `rosa` ou `menta`) + 1 bloco curto `branco` (o "título" do post), perto da base ou no meio.
   - Miolo: título curto em `preto` (ou `branco`) no alto e a explicação em `branco` embaixo; exemplos em `marrom`; prints de material com `print` e uma frase acima e outra abaixo.
   - Final: CTA em `verde`, `menta` ou `rosa`: "Comenta #X que eu te mando o link".
   - Texto do usuário **literal**; frases curtas (até ~4 linhas por bloco). Emojis funcionam (👇🙏).
4. Gere: `cd moldes/carrossel-nativo && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`. Tem que terminar com ✓. Confira os PNGs olhando se o texto ficou legível e fora do rosto.
5. Atualize a galeria (`python3 galeria/atualizar.py carrossel-nativo <id>` e publique no mesmo link, ver `CLAUDE.md`) e faça commit de `dados.json` (nunca das fotos).
