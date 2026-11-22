// Criativos de anúncio da linha "Revisão em Dicas" (feed 1080×1350 e stories 1080×1920), sem foto do autor.
// Cada layout segue um formato estático que funciona em Meta Ads e é diferente dos outros na estrutura:
// educativo (infográfico da nota), crenca (crença x virada), postit (bilhete "feio" de urgência), faq (objeção),
// grade (páginas do material + preço), pegadinha (certo ou errado), versus (dois jeitos de revisar),
// pagina (uma dica real ampliada, com marca-texto) e os nativos de story: enquete, caixinha e lembrete.
// Todo texto de conteúdo vem das dicas e do edital (nada de depoimento, número ou conversa inventados).
import { FONTES, T, I, M, PERFIL, TEMAS, esc, marca, simbolo, azulejo, visto, carimbo } from './tema.mjs';

export const FONTES_CR = FONTES + '&family=Caveat:wght@600;700';
const MAO = "font-family:'Caveat',cursive;font-weight:700";
const n3 = n => String(n).padStart(3, '0');

export function renderCriativo(cr, prod, dicas, img) {
  const c = TEMAS[prod.tema];
  const story = cr.formato === 'story';
  const W = 1080, H = story ? 1920 : 1350;
  // área segura: nos stories, topo e pé ficam livres para a interface do Instagram
  const topo = story ? 250 : 70, pe = story ? 330 : 70, lado = 76;
  const d = n => dicas[n];
  const fundoEscuro = `background:${c.escuro}`;
  const tex = (op = .16, lado = 108) => `<div style="position:absolute;inset:0;background-image:${azulejo(c.claro, op, lado)}"></div><div style="position:absolute;inset:0;background:radial-gradient(90% 50% at 0% 100%,${c.escuro3} 0%,transparent 70%),radial-gradient(70% 40% at 100% 0%,rgba(240,85,58,.26) 0%,transparent 70%)"></div>`;
  const area = (html, extra = '') => `<div style="position:absolute;left:${lado}px;right:${lado}px;top:${topo}px;bottom:${pe}px;display:flex;flex-direction:column;${extra}">${html}</div>`;
  const selo = (t, escuro = true) => `<span style="align-self:flex-start;${M};font-size:23px;letter-spacing:.1em;text-transform:uppercase;background:${c.cor};color:#fff;padding:11px 18px;border-radius:9px">${esc(t)}</span>`;
  const assin = (cor = '#fff', sub = c.claro, extra = '') => `<div style="display:flex;align-items:center;justify-content:space-between;${extra}">${marca(62, cor, sub, 'm' + cr.id)}<span style="${M};font-size:21px;letter-spacing:.12em;color:${sub}">${PERFIL}</span></div>`;
  const botao = (t, escuro = false) => `<div style="align-self:flex-start;display:flex;align-items:center;gap:14px;background:${escuro ? c.escuro : c.cor};color:#fff;${I};font-weight:800;font-size:32px;padding:22px 34px;border-radius:999px">${esc(t)}<svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
  const cartaoDica = (x, px = 1, marcada = false) => `<div style="background:#fff;border-radius:${22 * px}px;display:grid;grid-template-columns:${116 * px}px 1fr;padding:${22 * px}px ${30 * px}px ${22 * px}px 0;box-shadow:0 30px 60px -28px rgba(0,0,0,.55)"><div style="text-align:center;border-right:2px solid ${c.linha};margin-right:${26 * px}px"><div style="${T};font-size:${54 * px}px;line-height:1;color:${c.corForte}">${n3(x.n)}</div><div style="display:flex;justify-content:center;margin-top:${10 * px}px">${marcada ? visto(34 * px, c.ok, 3.6) : `<span style="width:${28 * px}px;height:${28 * px}px;border:3px solid ${c.tinta};border-radius:7px"></span>`}</div></div><div><div style="${I};font-weight:800;font-size:${30 * px}px;line-height:1.3;color:${c.tinta}">${esc(x.r)}</div><div style="${I};font-size:${25 * px}px;line-height:1.4;color:#4A3B3F;margin-top:${8 * px}px">${esc(x.e)}</div></div></div>`;

  const L = {
    // 1. Infográfico educativo: a conta da nota (edital, itens 7 a 9)
    educativo: () => `<div style="position:absolute;inset:0;background:${c.papel}"></div>${area(`
      <div style="${M};font-size:24px;letter-spacing:.2em;text-transform:uppercase;color:${c.corForte}">TCE MA 2026 · prova objetiva</div>
      <div style="${T};font-size:${story ? 118 : 104}px;line-height:.9;color:${c.tinta};margin-top:14px">Nem toda questão<br>vale <span style="color:${c.cor}">o mesmo</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:${story ? 60 : 40}px">
        ${[['40', 'questões gerais', '1 ponto cada', '40 pontos', false], ['60', 'questões específicas', '2 pontos cada', '120 pontos', true]].map(([n, a, b, t, f]) => `<div style="background:${f ? c.escuro : '#fff'};border:2px solid ${f ? c.escuro : c.linha};border-radius:26px;padding:30px 32px"><div style="${T};font-size:150px;line-height:.82;color:${f ? c.claro : c.tinta}">${n}</div><div style="${I};font-weight:800;font-size:29px;color:${f ? '#fff' : c.tinta};margin-top:16px">${a}</div><div style="${I};font-size:26px;color:${f ? 'rgba(255,255,255,.8)' : c.cinza};margin-top:4px">${b}</div><div style="${M};font-size:24px;letter-spacing:.06em;color:${f ? c.claro : c.corForte};margin-top:18px;padding-top:16px;border-top:2px dashed ${f ? 'rgba(255,211,196,.4)' : c.linha}">= ${t}</div></div>`).join('')}</div>
      <div style="margin-top:22px;background:#fff;border:2px solid ${c.linha};border-radius:26px;padding:26px 32px"><div style="display:flex;height:44px;border-radius:12px;overflow:hidden"><div style="width:25%;background:${c.escuro3}"></div><div style="width:75%;background:${c.cor}"></div></div><div style="display:flex;justify-content:space-between;${I};font-weight:700;font-size:26px;color:${c.tinta};margin-top:14px"><span>25% dos pontos</span><span style="color:${c.corForte}">75% dos pontos estão nas específicas</span></div></div>
      <div style="margin-top:auto"><div style="${I};font-size:30px;line-height:1.4;color:${c.tinta};margin-bottom:26px">Na Revisão em Dicas, <b>280 das 400 dicas</b> são das matérias que valem 2 pontos.</div>${assin(c.tinta, c.corForte)}</div>`)}`,

    // 2. Crença x virada
    crenca: () => `<div style="position:absolute;inset:0;${fundoEscuro}"></div>${tex()}${area(`
      ${selo('Prova dia ' + prod.prova)}
      <div style="${T};font-size:${story ? 132 : 118}px;line-height:.9;color:rgba(255,255,255,.42);margin-top:34px;text-decoration:line-through;text-decoration-color:${c.cor};text-decoration-thickness:8px">Reler tudo<br>de novo</div>
      <div style="${T};font-size:${story ? 132 : 118}px;line-height:.9;color:#fff;margin-top:26px">Rever só o que<br><span style="color:${c.claro}">você hesitou</span></div>
      <div style="display:grid;gap:18px;margin-top:${story ? 70 : 46}px">${cartaoDica(d(186), .92, true)}<div style="transform:translateX(34px) rotate(1deg)">${cartaoDica(d(320), .92)}</div></div>
      <div style="margin-top:auto"><div style="${I};font-size:30px;line-height:1.4;color:rgba(255,255,255,.86);margin-bottom:26px">400 dicas com caixinha pra marcar. Na véspera, você revisa só as marcadas.</div>${assin()}</div>`)}`,

    // 3. Bilhete "feio": post-it de urgência sobre a página do material
    postit: () => `<div style="position:absolute;inset:0;background:#D9D2CB"></div>
      <img src="${img.pagina}" style="position:absolute;left:50%;top:${story ? 300 : 90}px;width:900px;transform:translateX(-50%) rotate(-3deg);box-shadow:0 40px 80px -30px rgba(0,0,0,.5);border-radius:10px">
      <div style="position:absolute;left:${story ? 150 : 170}px;top:${story ? 760 : 420}px;width:700px;background:#FFE66B;padding:54px 56px 62px;transform:rotate(3.5deg);box-shadow:0 34px 50px -22px rgba(0,0,0,.55),inset 0 -40px 50px -40px rgba(0,0,0,.12)">
        <div style="position:absolute;left:50%;top:-28px;width:200px;height:58px;margin-left:-100px;background:rgba(255,255,255,.55);transform:rotate(-4deg);box-shadow:0 2px 6px rgba(0,0,0,.12)"></div>
        <div style="${MAO};font-size:88px;line-height:1;color:#1B1B1B">prova do TCE MA<br>é domingo, ${prod.prova}</div>
        <div style="${MAO};font-size:66px;line-height:1.08;color:#1B1B1B;margin-top:26px">revisar as 400 dicas<br>e marcar as que errei <span style="color:${c.corForte}">!!</span></div>
        <svg width="560" height="26" viewBox="0 0 560 26" style="display:block;margin-top:8px"><path d="M4 16C90 2 170 24 260 12S440 4 556 14" fill="none" stroke="${c.corForte}" stroke-width="6" stroke-linecap="round"/></svg></div>
      <div style="position:absolute;left:${lado}px;right:${lado}px;bottom:${pe}px;background:${c.escuro};border-radius:26px;padding:26px 32px;display:flex;align-items:center;justify-content:space-between">${marca(58, '#fff', c.claro, 'm' + cr.id)}<div style="text-align:right"><div style="${T};font-size:44px;line-height:1;color:#fff">Revisão em Dicas</div><div style="${M};font-size:20px;letter-spacing:.1em;color:${c.claro};margin-top:6px">TCE MA · AUDITOR</div></div></div>`,

    // 4. Objeção respondida: dá tempo? (plano de sete dias do próprio material)
    faq: () => `<div style="position:absolute;inset:0;background:${c.papel}"></div>${area(`
      <div style="${M};font-size:24px;letter-spacing:.2em;text-transform:uppercase;color:${c.corForte}">TCE MA · última semana</div>
      <div style="${T};font-size:${story ? 124 : 110}px;line-height:.9;color:${c.tinta};margin-top:14px">“Ainda dá tempo<br>de revisar?”</div>
      <div style="${I};font-weight:800;font-size:38px;color:${c.corForte};margin-top:22px">Dá. Uma frente por dia:</div>
      <div style="display:grid;gap:${story ? 14 : 10}px;margin-top:22px">${[['Financeiro e execução orçamentária'], ['Contabilidade Pública'], ['Auditoria e controle'], ['Administrativo e contratações'], ['Constitucional e demais específicas'], ['Gerais e legislação do TCE MA'], ['Dicas marcadas e treino de discursiva']].map(([t], i) => `<div style="display:grid;grid-template-columns:118px 1fr;align-items:center;background:#fff;border:2px solid ${i === 6 ? c.cor : c.linha};border-radius:18px;padding:${story ? 20 : 14}px 26px"><span style="${M};font-size:21px;letter-spacing:.12em;color:${c.corForte}">DIA ${i + 1}</span><span style="${I};font-weight:700;font-size:29px;color:${c.tinta}">${t}</span></div>`).join('')}</div>
      <div style="margin-top:auto">${assin(c.tinta, c.corForte)}</div>`)}`,

    // 5. Grade: o que vem no material + preço
    grade: () => `<div style="position:absolute;inset:0;${fundoEscuro}"></div>${tex(.13)}${area(`
      ${selo(prod.selo)}
      <div style="${T};font-size:${story ? 128 : 112}px;line-height:.88;color:#fff;margin-top:26px">400 dicas.<br><span style="color:${c.claro}">2 PDFs.</span></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:${story ? 60 : 38}px">${[['capa1', 'Parte 1 · rápida'], ['pagina', 'Regra + distinção'], ['capa2', 'Parte 2 · explicada'], ['explicada', 'Explicação + fundamento'], ['painel', 'Painel de revisão'], ['questoes', '12 questões e 6 discursivas']].map(([k, t]) => `<div><div style="height:${story ? 300 : 230}px;border-radius:14px;overflow:hidden;background:#fff"><img src="${img[k]}" style="width:100%;display:block"></div><div style="${I};font-weight:700;font-size:21px;color:${c.claro};margin-top:9px">${t}</div></div>`).join('')}</div>
      <div style="margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between"><div><div style="${M};font-size:21px;letter-spacing:.14em;color:${c.claro}">PARTE 1 + PARTE 2</div><div style="${T};font-size:120px;line-height:.9;color:#fff"><span style="font-size:52px">R$ </span>${esc(prod.preco)}</div></div>${marca(58, '#fff', c.claro, 'm' + cr.id)}</div>`)}`,

    // 6. Pegadinha: certo ou errado, com uma dica real
    pegadinha: () => `<div style="position:absolute;inset:0;background:${c.cor}"></div><div style="position:absolute;inset:0;background-image:${azulejo('#fff', .16, 108)}"></div>${area(`
      <span style="align-self:flex-start;${M};font-size:23px;letter-spacing:.14em;text-transform:uppercase;background:${c.escuro};color:#fff;padding:11px 18px;border-radius:9px">Certo ou errado? · Controle Externo</span>
      <div style="background:#fff;border-radius:30px;padding:${story ? 60 : 46}px 50px;margin-top:34px;box-shadow:0 40px 70px -34px rgba(0,0,0,.5)"><div style="${I};font-weight:800;font-size:${story ? 56 : 50}px;line-height:1.22;color:${c.tinta}">“A pretensão de ressarcimento fundada em decisão de tribunal de contas é imprescritível.”</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:38px">${['CERTO', 'ERRADO'].map(t => `<div style="border:3px solid ${c.tinta};border-radius:18px;padding:22px;text-align:center;${T};font-size:52px;color:${c.tinta}">${t}</div>`).join('')}</div></div>
      <div style="${T};font-size:${story ? 96 : 84}px;line-height:.92;color:#fff;margin-top:${story ? 60 : 40}px">A resposta é<br>a dica <span style="background:${c.escuro};padding:0 .14em">057</span></div>
      <div style="margin-top:auto"><div style="${I};font-weight:600;font-size:30px;line-height:1.4;color:#fff;margin-bottom:26px">Uma das 400 da Revisão em Dicas do TCE MA. Gabarito na legenda.</div>${assin('#fff', c.escuro)}</div>`)}`,

    // 7. Dois jeitos de revisar
    versus: () => `<div style="position:absolute;inset:0;background:${c.papel}"></div><div style="position:absolute;left:0;right:0;top:50%;bottom:0;background:${c.escuro}"></div><div style="position:absolute;left:0;right:0;top:50%;bottom:0;background-image:${azulejo(c.claro, .13, 108)}"></div>
      <div style="position:absolute;left:${lado}px;right:${lado}px;top:${topo}px;height:${H / 2 - topo - 50}px;display:flex;flex-direction:column;justify-content:center">
        <div style="${M};font-size:23px;letter-spacing:.18em;color:${c.cinza}">ÚLTIMA SEMANA · JEITO 1</div><div style="${T};font-size:${story ? 112 : 98}px;line-height:.9;color:${c.cinza};margin-top:10px">Reabrir a lei seca<br>e o PDF de 300 páginas</div>
        <div style="display:grid;gap:10px;margin-top:22px">${['Não termina até domingo', 'Relê o que já sabia', 'Chega na prova sem saber onde erra'].map(t => `<div style="${I};font-size:30px;color:${c.cinza};display:flex;gap:14px;align-items:center"><span style="${T};font-size:34px;color:${c.cor}">✕</span>${t}</div>`).join('')}</div></div>
      <div style="position:absolute;left:50%;top:50%;width:128px;height:128px;margin:-64px 0 0 -64px;border-radius:50%;background:${c.cor};display:flex;align-items:center;justify-content:center;${T};font-size:54px;color:#fff;border:8px solid ${c.papel}">VS</div>
      <div style="position:absolute;left:${lado}px;right:${lado}px;top:${H / 2 + 80}px;bottom:${pe}px;display:flex;flex-direction:column">
        <div style="${M};font-size:23px;letter-spacing:.18em;color:${c.claro}">ÚLTIMA SEMANA · JEITO 2</div><div style="${T};font-size:${story ? 112 : 98}px;line-height:.9;color:#fff;margin-top:10px">400 dicas com<br><span style="color:${c.claro}">caixinha pra marcar</span></div>
        <div style="display:grid;gap:10px;margin-top:22px">${['Uma regra por linha, por matéria', 'Marca só onde hesitou', 'Véspera: revisa as marcadas'].map(t => `<div style="${I};font-weight:600;font-size:30px;color:#fff;display:flex;gap:14px;align-items:center">${visto(34, c.claro, 3.6)}${t}</div>`).join('')}</div>
        <div style="margin-top:auto">${assin()}</div></div>`,

    // 8. Uma dica real ampliada, com marca-texto
    pagina: () => `<div style="position:absolute;inset:0;background:${c.papel}"></div><div style="position:absolute;left:0;top:0;bottom:0;width:22px;background:${c.cor}"></div>${area(`
      <div style="${M};font-size:24px;letter-spacing:.2em;text-transform:uppercase;color:${c.corForte}">Dica 048 de 400 · Controle Externo</div>
      <div style="display:flex;align-items:flex-start;gap:30px;margin-top:${story ? 60 : 36}px"><div style="${T};font-size:230px;line-height:.78;color:transparent;-webkit-text-stroke:4px ${c.cor}">048</div></div>
      <div style="${I};font-weight:800;font-size:${story ? 88 : 84}px;line-height:1.12;color:${c.tinta};margin-top:34px;letter-spacing:-.02em">Contas de governo recebem <span style="background:linear-gradient(transparent 52%,#FFD9A0 52%)">parecer prévio.</span></div>
      <div style="${I};font-size:${story ? 46 : 44}px;line-height:1.36;color:#4A3B3F;margin-top:28px">Contas de administradores são <b style="color:${c.tinta}">julgadas</b> pelo tribunal competente. Não troque apreciação por julgamento.</div>
      <div style="${MAO};font-size:62px;color:${c.corForte};transform:rotate(-3deg);margin-top:30px;align-self:flex-end">a banca troca os dois ↑</div>
      <div style="margin-top:auto"><div style="${I};font-size:30px;line-height:1.4;color:${c.tinta};margin-bottom:26px">Assim, por matéria, até a 400. <b>Revisão em Dicas · TCE MA.</b></div>${assin(c.tinta, c.corForte)}</div>`)}`,

    // 9. Nativo de story: texto do Instagram + enquete
    enquete: () => `<div style="position:absolute;inset:0;background:linear-gradient(160deg,${c.escuro3},${c.escuro} 70%)"></div>
      <div style="position:absolute;left:${lado}px;right:${lado}px;top:${topo + 90}px;text-align:center">
        <span style="${I};font-weight:800;font-size:66px;line-height:1.5;color:#fff;background:${c.cor};padding:8px 26px;border-radius:18px;box-decoration-break:clone;-webkit-box-decoration-break:clone">quem vai fazer o TCE MA domingo?</span>
        <div style="${I};font-weight:700;font-size:54px;line-height:1.3;color:#fff;margin-top:70px">uma questão específica<br>vale quantos pontos?</div></div>
      <div style="position:absolute;left:140px;right:140px;top:${topo + 640}px;background:#fff;border-radius:34px;padding:44px 40px 40px;box-shadow:0 30px 60px -20px rgba(0,0,0,.5)"><div style="${I};font-weight:800;font-size:44px;text-align:center;color:#111">Sem olhar o edital:</div><div style="display:grid;gap:16px;margin-top:30px">${['1 ponto', '2 pontos', 'depende da matéria'].map(t => `<div style="border:3px solid #E3E3E3;border-radius:22px;padding:26px;text-align:center;${I};font-weight:700;font-size:40px;color:#111">${t}</div>`).join('')}</div></div>
      <div style="position:absolute;left:${lado}px;right:${lado}px;bottom:${pe + 20}px;text-align:center"><span style="${I};font-weight:700;font-size:40px;line-height:1.6;color:#111;background:#fff;padding:8px 22px;border-radius:14px;box-decoration-break:clone;-webkit-box-decoration-break:clone">isso muda o que você revisa primeiro</span></div>`,

    // 10. Nativo de story: caixinha de perguntas respondida
    caixinha: () => `<div style="position:absolute;inset:0;background:${c.papel}"></div><div style="position:absolute;inset:0;background-image:${azulejo(c.cor, .1, 108)}"></div>
      <div style="position:absolute;left:150px;right:150px;top:${topo + 60}px;border-radius:34px;overflow:hidden;box-shadow:0 30px 60px -24px rgba(0,0,0,.35)"><div style="background:${c.escuro};color:#fff;${I};font-weight:700;font-size:36px;text-align:center;padding:28px 30px">Me pergunte sobre o TCE MA</div><div style="background:#fff;${I};font-weight:600;font-size:44px;line-height:1.3;text-align:center;color:#111;padding:44px 40px">o que eu reviso primeiro na última semana?</div></div>
      <div style="position:absolute;left:${lado}px;right:${lado}px;top:${topo + 520}px"><div style="${I};font-weight:800;font-size:58px;line-height:1.25;color:${c.tinta}">O que vale 2 pontos:</div>
        <div style="display:grid;gap:16px;margin-top:30px">${['Financeiro: despesa, receita e LRF', 'Contabilidade Pública: PCASP e demonstrações', 'Auditoria: evidências e achados', 'Contratações: Lei 14.133'].map((t, i) => `<div style="display:grid;grid-template-columns:70px 1fr;align-items:center;background:#fff;border:2px solid ${c.linha};border-radius:22px;padding:24px 28px"><span style="${T};font-size:52px;line-height:1;color:${c.cor}">${i + 1}</span><span style="${I};font-weight:700;font-size:35px;line-height:1.25;color:${c.tinta}">${t}</span></div>`).join('')}</div>
        <div style="${I};font-size:36px;line-height:1.4;color:${c.tinta};margin-top:34px">Depois, as dicas que você marcou. Está tudo na <b>Revisão em Dicas</b>, link aqui embaixo.</div></div>`,

    // 11. Nativo de story: tela bloqueada com o lembrete da prova
    lembrete: () => `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#3D1220 0%,#17060B 60%,#0E0306 100%)"></div><div style="position:absolute;inset:0;background-image:${azulejo(c.claro, .07, 150)}"></div>
      <div style="position:absolute;left:0;right:0;top:${topo + 20}px;text-align:center;color:#fff"><div style="${I};font-weight:600;font-size:42px;opacity:.9">domingo, 22 de novembro</div><div style="${I};font-weight:700;font-size:250px;line-height:1;letter-spacing:-.04em">21:47</div></div>
      <div style="position:absolute;left:60px;right:60px;top:${topo + 500}px;display:grid;gap:18px">${[['Calendário', 'agora', 'Prova TCE MA · Auditor', 'Domingo, 29/11, turno da manhã.', '#FF3B30'], ['Lembretes', 'há 2 min', 'Revisar as 400 dicas', 'Hoje: Direito Financeiro, dicas 166 a 205.', c.cor], ['Lembretes', 'há 2 min', 'Marcar as que errei', 'Na véspera, revisar só as marcadas.', c.cor]].map(([app, q, t, s, cor]) => `<div style="background:rgba(255,255,255,.2);backdrop-filter:blur(20px);border-radius:38px;padding:30px 34px;display:grid;grid-template-columns:84px 1fr;gap:24px;align-items:center"><div style="width:84px;height:84px;border-radius:20px;background:#fff;display:flex;align-items:center;justify-content:center"><span style="width:44px;height:44px;border-radius:${app === 'Calendário' ? 8 : 50}%;background:${cor}"></span></div><div><div style="display:flex;justify-content:space-between;${I};font-size:27px;color:rgba(255,255,255,.7)"><span>${app}</span><span>${q}</span></div><div style="${I};font-weight:700;font-size:36px;color:#fff;margin-top:2px">${t}</div><div style="${I};font-size:31px;line-height:1.3;color:rgba(255,255,255,.88);margin-top:2px">${s}</div></div></div>`).join('')}</div>
      <div style="position:absolute;left:${lado}px;right:${lado}px;bottom:${pe + 10}px;display:flex;align-items:center;justify-content:space-between">${marca(58, '#fff', c.claro, 'm' + cr.id)}<div style="text-align:right"><div style="${T};font-size:44px;line-height:1;color:#fff">Revisão em Dicas</div><div style="${M};font-size:20px;letter-spacing:.1em;color:${c.claro};margin-top:6px">TCE MA · 400 DICAS</div></div></div>`,
  };
  const corpo = (L[cr.layout] || (() => { throw new Error('layout desconhecido: ' + cr.layout); }))();
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES_CR}" rel="stylesheet"><style>*{box-sizing:border-box}body{margin:0}p{margin:0}</style></head><body><div id="arte" style="position:relative;width:${W}px;height:${H}px;overflow:hidden">${corpo}</div><script>document.fonts.ready.then(() => { window.__pronto = true; });</script></body></html>`;
  return { html, W, H };
}
