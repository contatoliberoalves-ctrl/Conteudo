# Biblioteca de animações / cards (paleta para os reels)

Catálogo de elementos animados para a faixa de cima. Tudo renderiza em HTML/CSS/SVG + GSAP (gen.py → render_cards.mjs).
Regras de ouro: entradas rápidas (0,15–0,25 s), gráficos que se DESENHAM/crescem, nada de caixa pulsando, cards contínuos e sincronizados com as palavras.
(Resumo em português da `animation-library.md` do kit original.)

## Já no gen.py
intro (avião no arco, motionPath) · statgraph (contagem + linha) · summary (palavra) · graph (linha sobe/desce) · crm · listcheck · calendar · comstep (riscado + carimbo) · iphone · wachat · msgtpl · vflow · cta (barra).

## Prontos em `card-snippets.md` (código para colar)
gancho em etapas com logo grande (texto → logo → carimbo, cada etapa numa palavra) · terminal que digita (contador + `textContent`, nunca TextPlugin) · pílula por palavra + resultado · blocos numerados 1-2-3-4 (`find_after`) · troca antes/depois · título com selo `01` · número que estoura (card < 1,2 s) · CTA com palavra colorida.

## Dos geradores de exemplo do kit original (no Drive)
- **preço riscado**: logo + preço grande + risco vermelho ("pare de pagar X").
- **versus**: "A x B" com os dois logos + barras por critério (uma empata, uma faz o seu ganhar). A comparação mais forte. Para Direito: MS x HC, ADI x ADC, ação popular x ação civil pública.
- **revelação de marca**: logo grande entrando (escala + giro) + nome + selo.
- **terminal (run | prompt)**: janela do macOS com linhas em sequência e cursor.
- **chips de teste**: cabeçalho versus + grade de chips com ícone, um acende na palavra.
- **quiz A/B**: duas janelas de navegador com prints REAIS e "?" no meio; depois o vencedor cresce com selo ✓. Para Direito: "qual é a peça?" com dois enunciados.
- **multiplicador**: número gigante contando (1→5) + "MENOS".
- **passos**: passos numerados na vertical com setas, um por palavra.
- **CTA de comentário**: pílula grande com a palavra entre aspas (sem emoji).

## Vistos nos reels de referência (para criar quando precisar)
**Dados**: barras verticais crescendo (scaleY, origem embaixo) · velocímetro com ponteiro girando até o valor · rosca/anel que enche + % no meio · mapa de calor/grade de contribuições acendendo em sequência · barra de progresso · 5 estrelas enchendo · tabela com linhas em sequência e uma coluna destacada.
**Tecnologia / produto**: janela de código digitando · diff (+verde/−vermelho) com contador · grade de chips com ícone · onda de áudio (só em cena de áudio).
**Layout / revelação**: comparação em 2 colunas (✗ riscado x ✓) · print real dentro de celular · chat (WhatsApp/iMessage) · fluxo com caixas e setas (vertical, de cima para baixo).

## Ideias extras (para variar)
odômetro (dígitos rolando) · mapa com pinos/rota · marca-texto passando numa palavra · carrossel/pilha de cartões · pizza se desenhando · linha do tempo com marcos acendendo · notificações empilhando · corrida de barras · contador "+N" subindo · tipografia cinética · cortina antes/depois.

## Ideias para Direito / concursos
- **artigo com grifo**: texto da lei em papel, marca-texto passando na expressão-chave (ex.: "direito líquido e certo").
- **carimbo "CAI NA PROVA" / "PEGADINHA"** batendo na palavra.
- **placar de votação**: 308/513 contando, barra de 3/5 enchendo, "2 turnos" ✓✓ (PEC).
- **rito em trilha**: estações acendendo uma a uma (iniciativa → discussão → votação → sanção/veto → promulgação).
- **balança** pendendo para um lado no "procedente".
- **calendário de prazo**: 120 dias correndo até o último dia em vermelho.
- **espelho da FGV**: tabela de critérios com pontos aparecendo (0,25 / 0,50…).

## Como pôr um card novo no gen.py
1. Um `tipo` novo em `inner(i,t,p)` (HTML + CSS do estado final).
2. Os tweens em `tw` para esse tipo (entrada + desenhar/crescer, ancorados em `s` ou num gatilho).
3. Use no `batidas.json` com o gatilho certo. Contínuo e sincronizado.
4. Renderize → extraia um quadro → compare com a referência → ajuste.

## Logo estilhaçando (destruir uma marca/coisa na palavra)
O logo bate na tela e, na palavra, quebra em cacos triangulares que giram e caem. Receita: contêiner `.shardbox{position:relative;width:260px;height:260px}` com N cópias do logo `<img class="shard">` (absolutas, tamanho cheio), cada uma recortada num triângulo (grade 3×3, cada célula em 2 triângulos via `clip-path:polygon(...)` → 18 cacos que formam o logo inteiro). Uma camada `.crack` (degradê radial branco, opacidade 0) pisca 0,05 s antes do impacto. Na palavra, cada caco anima `x/y/rotation/opacity` com `power2.in`: dx = (centro do caco − centro)·(2,2–3,8) + ruído, dy = centro·1,4 + queda de 120–420 px, rotação ±160°, duração 0,55–0,8 s, atraso por caco 0–0,06 s. Junte com um anel de choque vermelho e um tremor no contêiner. Semente fixa no aleatório para o render sair igual.
