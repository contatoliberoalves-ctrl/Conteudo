#!/bin/bash
# Trava do sim: nenhuma geração paga na Avatrix sem um "sim" do aluno PRA AQUELE item.
# Um só script pros dois eventos: UserPromptSubmit cria 1 ficha quando o aluno diz sim; PreToolUse gasta 1 ficha por geração paga.
# Sem python3 (lê o JSON com sed), pra não abrir a trava sozinha num Mac sem python.
# Nome da ferramenta: vale "mcp__avatrix__generate_*" (terminal) e o conector do app do Claude ("...Avatrix...generate_*").
# shortcut: só generate_image e generate_video contam como pago; se a Avatrix criar outra tool paga, acrescentar no matcher do settings.json e aqui.
IN=$(cat); DIR="${CLAUDE_PROJECT_DIR:-$PWD}"; F="$DIR/.claude/sim-do-aluno"
campo() { printf '%s' "$IN" | tr '\n' ' ' | sed -n "s/.*\"$1\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p"; }
ev=$(campo hook_event_name)
if [ "$ev" = "UserPromptSubmit" ]; then
  p=$(campo prompt)
  # só o "sim" no idioma do aluno libera: sim / sí / yes (ou "pode gerar", "puedes generar", "go ahead").
  # "si" sem acento só vale sozinho ou no começo com pontuação ("si", "si, dale"): "si quieres" é condição, não sim.
  # "gostei", "ok", "segue", "me gusta", "nice" não liberam gasto; resposta que começa com não/no não libera.
  if { printf '%s' "$p" | grep -q -i -E '(^|[^[:alpha:]])(sim|sí|yes|pode gerar|puedes generar|go ahead)([^[:alpha:]]|$)' \
       || printf '%s' "$p" | grep -q -i -E '^[[:space:]]*si[[:space:]]*([.!,]|$)'; } \
     && ! printf '%s' "$p" | grep -q -i -E '^[[:space:]]*(n(ã|a)o|no)([^[:alpha:]]|$)'; then mkdir -p "$(dirname "$F")"; echo 1 > "$F"; fi
  exit 0
fi
if [ "$ev" = "PreToolUse" ]; then
  t=$(campo tool_name)
  case "$t" in *[Aa]vatrix*generate_image|*[Aa]vatrix*generate_video) ;; *) exit 0;; esac
  n=$(cat "$F" 2>/dev/null || echo 0)
  if [ "${n:-0}" -ge 1 ]; then echo $((n-1)) > "$F"; exit 0; fi
  echo "TRAVA DO SIM: esta geração é paga e o aluno ainda não disse 'sim' pra ela. Pare, diga o que vai gerar e quantos créditos custa, e espere o aluno responder 'sim' (em espanhol 'sí', em inglês 'yes'), no idioma da conversa. Um 'sim' libera UMA geração." >&2
  exit 2
fi
exit 0
