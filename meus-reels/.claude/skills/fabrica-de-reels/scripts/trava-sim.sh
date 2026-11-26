#!/bin/bash
# Trava do ok: nenhuma chamada paga na Avatrix sem o aluno ter respondido "sim" há pouco.
# Um script pros dois eventos: UserPromptSubmit abre a janela; PreToolUse barra a chamada paga fora dela.
# Abre só com mensagem que COMEÇA com "sim", "pode gerar" ou "pode gastar" e não tem "?" ("pode ser", "pode não" e perguntas não abrem).
# Janela de 2 h (cobre um reel com folga). "sim ... até <número> ... por dia" abre até 23:59 do dia. Um "sim" depois nunca encurta a janela aberta.
# Cotação (get_cost: true) passa: não gasta nada. Falha FECHADA: evento desconhecido ou ferramenta sem nome bloqueiam.
# Sem python3 (lê o JSON com sed), pra não abrir a trava sozinha num Mac sem python.
IN=$(cat); DIR="${CLAUDE_PROJECT_DIR:-$PWD}"; F="$DIR/.claude/ok-do-aluno"
plano=$(printf '%s' "$IN" | tr '\n' ' ')
campo() { printf '%s' "$plano" | sed -n "s/.*\"$1\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p"; }
ev=$(campo hook_event_name); agora=$(date +%s)
bloqueia() { echo "TRAVA DO OK: $1 Pare, diga ao aluno o que vai gerar e o máximo que pode gastar, e espere ele responder 'sim'. Não mexa no arquivo da trava (.claude/ok-do-aluno) nem neste script." >&2; exit 2; }

if [ "$ev" = "UserPromptSubmit" ]; then
  p=$(campo prompt)
  if printf '%s' "$p" | grep -q -i -E '^[[:space:]]*(sim|pode gerar|pode gastar)([^[:alpha:]]|$)' && ! printf '%s' "$p" | grep -q -F '?'; then
    if printf '%s' "$p" | grep -q -i -E '^[[:space:]]*sim.*at(é|e)[^0-9]*[0-9][0-9.]*.*por dia'; then
      fim=$(( $(date -d 'tomorrow 00:00' +%s 2>/dev/null || date -v+1d -v0H -v0M -v0S +%s) - 1 ))
    else
      fim=$((agora + 7200))
    fi
    velho=$(cat "$F" 2>/dev/null || echo 0); case "$velho" in ''|*[!0-9]*) velho=0;; esac
    [ "$velho" -gt "$fim" ] && fim=$velho
    mkdir -p "$(dirname "$F")"; echo "$fim" > "$F"
  fi
  exit 0
fi

[ "$ev" = "PreToolUse" ] || bloqueia "evento desconhecido ('$ev')."
t=$(campo tool_name)
[ -n "$t" ] || bloqueia "ferramenta sem nome."
case "$t" in
  *[Aa]vatrix*generate_image|*[Aa]vatrix*generate_video|*[Aa]vatrix*generate_voice|*[Aa]vatrix*generate_influencer|\
  *[Aa]vatrix*generate_batch|*[Aa]vatrix*change_voice|*[Aa]vatrix*download_social|*[Aa]vatrix*send_message|\
  *[Aa]vatrix*confirm_card|*[Aa]vatrix*edit_image|*[Aa]vatrix*enhance_image|*[Aa]vatrix*transfer_motion|*[Aa]vatrix*cut_video) ;;
  *) exit 0;;
esac
printf '%s' "$plano" | grep -q -E '"get_cost"[[:space:]]*:[[:space:]]*true' && exit 0
fim=$(cat "$F" 2>/dev/null || echo 0)
case "$fim" in ''|*[!0-9]*) fim=0;; esac
[ "$fim" -ge "$agora" ] && exit 0
bloqueia "esta chamada é paga e o aluno ainda não disse 'sim' pra esse gasto (ou o ok venceu)."
