/* Área de membros: navegação, jornada (pontos, níveis e selos), Academia, agenda, biblioteca e gestão. */
let demoMode=false,activeCourse='gestao',activeLesson=0,learningTab='jornada',libraryFilter='Todas',libraryQuery='',noticeFilter='Todos',gainReason='';
let refsOpened=read('refs',[]),roomsVisited=read('rooms',[]);

/* ---------- Jornada ---------- */
const levels=[[0,'Ingresso'],[120,'Participante'],[300,'Colaborador'],[550,'Articulador'],[850,'Referência'],[1200,'Membro notável']];
const pointRules=[['Leitura de comunicado',10,'bell'],['Módulo concluído na Academia',40,'cap'],['Reflexão de aplicação registrada',20,'pen'],['Encontro acompanhado na agenda',15,'calendar'],['Referência oficial consultada',5,'book'],['Espaço de comissão visitado',10,'users'],['Publicação no espaço da comissão',25,'chat']];
const seals=[
 {id:'ingresso',title:'Primeiro acesso',desc:'Entrou na área de membros.',icon:'flag',test:s=>true},
 {id:'informado',title:'Bem informado',desc:'Leu todos os comunicados disponíveis.',icon:'bell',test:s=>s.noticesTotal>0&&s.notices>=s.noticesTotal},
 {id:'etapa',title:'Primeira etapa',desc:'Concluiu um módulo da Academia.',icon:'cap',test:s=>s.modules>=1},
 {id:'trilha',title:'Trilha concluída',desc:'Concluiu todos os módulos de uma trilha.',icon:'seal',test:s=>s.coursesDone>=1},
 {id:'reflexao',title:'Prática refletida',desc:'Registrou duas reflexões de aplicação.',icon:'pen',test:s=>s.reflections>=2},
 {id:'agenda',title:'Presença marcada',desc:'Acompanhou um encontro na agenda.',icon:'calendar',test:s=>s.events>=1},
 {id:'pesquisa',title:'Pesquisador',desc:'Consultou três referências oficiais.',icon:'book',test:s=>s.refs>=3},
 {id:'comissao',title:'Voz da comissão',desc:'Participou do espaço de uma comissão.',icon:'users',test:s=>s.rooms>=1||s.posts>=1}];
function reflectionCount(){let n=0;try{for(const k of Object.keys(localStorage))if(k.startsWith('anoreg-demo-note-')&&String(JSON.parse(localStorage.getItem(k))||'').trim())n++}catch{}return n}
function journeyStats(){
 const visible=allNotices().map(n=>n.id),noticesRead=visible.filter(id=>readNotices.includes(id)).length;
 const modules=courses.reduce((t,c)=>t+(progress[c.id]||[]).filter(i=>i<c.lessons.length).length,0),modulesTotal=courses.reduce((t,c)=>t+c.lessons.length,0);
 const s={notices:noticesRead,noticesTotal:visible.length,modules,modulesTotal,coursesDone:courses.filter(c=>c.lessons.length&&coursePercent(c.id)===100).length,reflections:reflectionCount(),events:savedEvents.length,refs:refsOpened.length,rooms:roomsVisited.length,posts:read('my-posts',0)};
 s.points=20+s.notices*10+s.modules*40+s.reflections*20+s.events*15+s.refs*5+s.rooms*10+s.posts*25;
 let li=0;levels.forEach(([min],i)=>{if(s.points>=min)li=i});
 s.level=li+1;s.levelName=levels[li][1];s.next=levels[li+1];s.floor=levels[li][0];
 s.levelPct=s.next?Math.round((s.points-s.floor)/(s.next[0]-s.floor)*100):100;
 s.seals=seals.map(x=>({...x,earned:x.test(s)}));s.sealsEarned=s.seals.filter(x=>x.earned).length;
 return s;
}
function coursePercent(id){const c=courses.find(x=>x.id===id);return c?.lessons.length?Math.round((progress[id]||[]).filter(i=>i<c.lessons.length).length/c.lessons.length*100):0}
const sealPoints=(()=>{const p=[];for(let i=0;i<48;i++){const a=i/48*Math.PI*2,r=i%2?44:48;p.push((50+r*Math.cos(a)).toFixed(2)+','+(50+r*Math.sin(a)).toFixed(2))}return p.join(' ')})();
function sealSVG(icon,earned){return `<svg class="seal-art ${earned?'earned':'locked'}" viewBox="0 0 100 100" aria-hidden="true"><polygon points="${sealPoints}" class="seal-edge"/><circle cx="50" cy="50" r="36" class="seal-face"/><circle cx="50" cy="50" r="31" class="seal-ring"/><use href="#i-${earned?icon:'lock'}" x="35" y="35" width="30" height="30" class="seal-icon"/></svg>`}
function ring(pct,inner,size='md'){return `<div class="ring ${size}" style="--p:${Math.max(0,Math.min(100,pct))}"><div>${inner}</div></div>`}
function bar(pct,cls=''){return `<div class="bar ${cls}" role="presentation"><span style="width:${Math.max(0,Math.min(100,pct))}%"></span></div>`}
let lastStats=null;
function checkGains(){
 const s=journeyStats(),prevPts=read('points-seen',null),prevSeals=read('seals-seen',null);
 if(prevPts!==null&&s.points>prevPts&&gainReason)toast(`<span class="toast-pts">+${s.points-prevPts}</span><span>${gainReason}</span>`,'gain');
 if(prevPts!==null){const prevLevel=levels.filter(([m])=>prevPts>=m).length;if(s.level>prevLevel)setTimeout(()=>toast(`${ic('seal')}<span><b>Novo nível alcançado</b> · ${s.levelName}</span>`,'level'),1200)}
 if(prevSeals){const fresh=s.seals.filter(x=>x.earned&&!prevSeals.includes(x.id));if(fresh.length)setTimeout(()=>toast(`${ic('seal')}<span><b>Selo conquistado</b> · ${fresh[0].title}</span>`,'level'),prevPts!==null&&s.level>levels.filter(([m])=>prevPts>=m).length?4200:1200)}
 save('points-seen',s.points);save('seals-seen',s.seals.filter(x=>x.earned).map(x=>x.id));gainReason='';lastStats=s;
}
window.resetJourney=()=>{refsOpened=[];roomsVisited=[]};

/* ---------- Entrada e navegação ---------- */
async function showRoles(){
 try{const session=await communityRequest('/api/community');demoMode=false;enterPortal(session.user.admin?'presidente':'associado')}
 catch(e){
  if(e.status===401||e.status===403){modal('Área de membros',`<p>Acesse com a conta autorizada pela ANOREG Pernambuco.</p><a class="btn dark" href="/signin-with-chatgpt?return_to=/" target="_top">Entrar com minha conta ${ic('arrow')}</a><p class="notice">O acesso às comissões depende do vínculo cadastrado pela administração.</p>`);return}
  showDemoRoles();
 }
}
function showDemoRoles(){modal('Como você quer explorar?',`<p>Nesta versão de apresentação, a área de membros funciona com dados de exemplo salvos apenas neste navegador. Escolha um perfil:</p><div class="role-grid">${[['associado','user','Associado(a)','Avisos, comissões, Academia, agenda e sua jornada.'],['diretoria','users','Diretoria','Tudo do associado, mais a gestão de comunicados.'],['presidente','seal','Presidência','Visão completa, com o panorama institucional.']].map(([id,i,t,d])=>`<button class="role-card" data-demo-role="${id}"><span class="role-icon">${ic(i)}</span><strong>${t}</strong><small>${d}</small><span class="role-go">${ic('arrow')}</span></button>`).join('')}</div><p class="notice">No portal publicado, o acesso usa a conta autorizada pela ANOREG/PE e os dados das comissões ficam no servidor.</p>`,'ÁREA DE MEMBROS · DEMONSTRAÇÃO','wide')}
function enterPortal(r){
 role=r;closeModal();$$('body>.utility,body>header,body>main,body>footer,body>.skip').forEach(el=>el.inert=true);
 $('#portal').hidden=false;document.body.style.overflow='hidden';$('#avatar').textContent={associado:'AS',diretoria:'DI',presidente:'PR'}[role];
 $('#change-role').hidden=!demoMode;$('#demo-pill').textContent=demoMode?'Demonstração':'Apresentação';
 $('#portal-mode-note').textContent=demoMode?'Dados de exemplo salvos neste navegador.':'Comissões com dados salvos. Academia e jornada em apresentação.';
 portalPage='painel';setPortalNav(false);if(read('points-seen',null)===null){save('points-seen',journeyStats().points);save('seals-seen',['ingresso'])}
 renderPortal();$('#portal').scrollTop=0;$('.portal-body').scrollTop=0;focusPortalHeading();
}
function leavePortal(){$$('body>.utility,body>header,body>main,body>footer,body>.skip').forEach(el=>el.inert=false);$('#portal').hidden=true;document.body.style.overflow='';location.hash='inicio';document.querySelector('header [data-members]').focus()}
$('#leave-portal').onclick=leavePortal;$('#portal-brand').onclick=e=>{e.preventDefault();leavePortal()};$('#change-role').onclick=showDemoRoles;$('#notifications').onclick=()=>navigate('avisos');
function setPortalNav(open){$('#portal').classList.toggle('nav-open',open);$('#portal-menu').setAttribute('aria-expanded',String(open));$('#portal-menu').innerHTML=ic(open?'close':'menu')}
$('#portal-menu').onclick=()=>setPortalNav(!$('#portal').classList.contains('nav-open'));
function focusPortalHeading(){const h=$('#portal-content h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true})}}
const roleLabel=()=>role==='presidente'?'Presidência':role==='diretoria'?'Diretoria':'Associado(a)';
function navGroups(){const g=[['Início',[['painel','home','Visão geral'],['jornada','seal','Minha jornada'],['avisos','bell','Avisos']]],['Participação',[['comunidades','users','Comissões'],['agenda','calendar','Agenda']]],['Conhecimento',[['cursos','cap','Academia'],['biblioteca','book','Biblioteca']]]];if(role!=='associado')g.push(['Gestão',[['gestao','pen','Comunicados'],...(role==='presidente'?[['institucional','chart','Visão institucional']]:[])]]);return g}
const pageTitles={painel:'Visão geral',jornada:'Minha jornada',avisos:'Avisos e comunicados',comunidades:'Comissões',agenda:'Agenda e encontros',cursos:'ANOREG Academia',biblioteca:'Biblioteca',gestao:'Gestão de comunicados',institucional:'Visão institucional',trilha:'ANOREG Academia / Trilha'};
function renderNav(s){
 const unread=s.noticesTotal-s.notices;
 $('#member-card').innerHTML=`<button class="member-card" data-page="jornada"><span class="member-top"><span class="avatar">${$('#avatar').textContent}</span><span><strong>${roleLabel()}</strong><small>Nível ${s.level} · ${s.levelName}</small></span></span>${bar(s.levelPct,'gold')}<span class="member-foot"><span>${s.points} pontos</span><span>${s.next?`faltam ${s.next[0]-s.points}`:'nível máximo'}</span></span></button>`;
 $('#portal-links').innerHTML=navGroups().map(([label,items])=>`<div class="nav-group"><span class="nav-label">${label}</span>${items.map(([id,icon,title])=>{const cur=portalPage===id||(id==='cursos'&&portalPage==='trilha');return `<button data-page="${id}" ${cur?'aria-current="page" class="active"':''}>${ic(icon)}<span>${title}</span>${id==='avisos'&&unread?`<span class="nav-count">${unread}</span>`:''}</button>`}).join('')}</div>`).join('');
 $('#points-chip').innerHTML=`${ic('seal')}<span><b>${s.points}</b> pts</span>`;$('#points-chip').setAttribute('aria-label',`Minha jornada: ${s.points} pontos, nível ${s.level}`);
 $('#notifications').innerHTML=ic('bell')+(unread?`<span class="bell-count">${unread}</span>`:'');$('#notifications').setAttribute('aria-label',`Avisos e comunicados, ${unread} não lidos`);
}
function updateBell(){if(!$('#portal').hidden)renderNav(journeyStats())}
function navigate(page){const allowed=[...navGroups().flatMap(g=>g[1].map(i=>i[0])),'trilha'];if(!allowed.includes(page))page='painel';portalPage=page;setPortalNav(false);renderPortal();$('.portal-body').scrollTop=0;focusPortalHeading()}
function heading(title,subtitle,extra='',eyebrow=''){return `<div class="portal-heading"><div><span class="eyebrow">${eyebrow||'ANOREG Pernambuco · '+roleLabel()}</span><h1>${title}</h1><p>${subtitle}</p></div>${extra}</div>`}
function renderPortal(){
 $('#breadcrumbs').textContent=pageTitles[portalPage]||'Visão geral';
 if(portalPage==='comunidades'){checkGains();renderNav(journeyStats());loadCommunity();return}
 const s=journeyStats();let html='';
 if(portalPage==='painel')html=homePage(s);
 if(portalPage==='jornada')html=journeyPage(s);
 if(portalPage==='avisos')html=noticesPage(s);
 if(portalPage==='cursos')html=academyPage(s);
 if(portalPage==='trilha')html=renderLearning();
 if(portalPage==='agenda')html=renderAgenda();
 if(portalPage==='biblioteca')html=renderLibrary();
 if(portalPage==='gestao'&&role!=='associado')html=managementPage();
 if(portalPage==='institucional'&&role==='presidente')html=renderInstitution();
 $('#portal-content').innerHTML=html;checkGains();renderNav(lastStats);
}

/* ---------- Visão geral ---------- */
function greeting(){const h=new Date().getHours();return h<12?'Bom dia':h<18?'Boa tarde':'Boa noite'}
function goals(s){return [
 {t:'Leia os comunicados pendentes',cur:s.notices,max:s.noticesTotal,pts:'+10 cada',page:'avisos',icon:'bell'},
 {t:'Conclua um módulo da Academia',cur:Math.min(s.modules,1),max:1,pts:'+40',page:'cursos',icon:'cap'},
 {t:'Consulte três referências oficiais',cur:Math.min(s.refs,3),max:3,pts:'+5 cada',page:'biblioteca',icon:'book'},
 {t:'Acompanhe um encontro da agenda',cur:Math.min(s.events,1),max:1,pts:'+15',page:'agenda',icon:'calendar'}]}
function goalRow(g){const done=g.cur>=g.max;return `<button class="goal ${done?'done':''}" data-page="${g.page}"><span class="goal-check">${ic(done?'check':g.icon)}</span><span class="goal-text"><b>${g.t}</b>${bar(g.max?g.cur/g.max*100:100)}</span><span class="goal-meta"><small>${g.cur}/${g.max}</small><em>${done?'Feito':g.pts}</em></span></button>`}
function nextCourse(){return courses.filter(c=>c.lessons.length).sort((a,b)=>{const pa=coursePercent(a.id),pb=coursePercent(b.id);return (pa===100)-(pb===100)||pb-pa})[0]}
function homePage(s){
 const exec=role!=='associado',c=nextCourse(),pct=coursePercent(c.id),done=(progress[c.id]||[]).length,list=goals(s),goalsDone=list.filter(g=>g.cur>=g.max).length;
 return `<section class="welcome">
  <div class="welcome-copy"><span class="eyebrow">${role==='presidente'?'Gabinete da presidência':exec?'Espaço da diretoria':'Espaço do associado'}</span><h1>${greeting()}! <em>Que bom ter você aqui.</em></h1><p>${exec?'As pautas, as pessoas e o conhecimento que movem a ANOREG Pernambuco, em um só lugar.':'Avisos, comissões e formação para acompanhar a evolução da sua atividade.'}</p><div class="welcome-actions"><button class="btn gold" data-page="${c?'cursos':'avisos'}">${pct?'Continuar trilha':'Começar pela Academia'} ${ic('arrow')}</button><button class="btn on-dark" data-page="comunidades">Minhas comissões</button></div></div>
  <button class="level-card" data-page="jornada">${ring(s.levelPct,`<strong>${s.level}</strong><small>nível</small>`,'lg')}<span class="level-info"><small>Sua jornada</small><b>${s.levelName}</b><span>${s.points} pontos${s.next?` · faltam ${s.next[0]-s.points} para <i>${s.next[1]}</i>`:''}</span></span></button>
 </section>
 <div class="stat-row">
  ${statTile('seal',s.points,'pontos de participação','jornada')}${statTile('flag',`${s.sealsEarned}<small>/${seals.length}</small>`,'selos conquistados','jornada')}${statTile('cap',`${s.modules}<small>/${s.modulesTotal}</small>`,'módulos concluídos','cursos')}${statTile('bell',s.noticesTotal-s.notices,'avisos não lidos','avisos')}
 </div>
 <div class="dash-grid">
  <section class="panel"><div class="panel-heading"><div><span class="eyebrow">Metas sugeridas</span><h2>Seus próximos passos</h2></div><span class="chip">${goalsDone} de ${list.length} concluídas</span></div><div class="goal-list">${list.map(goalRow).join('')}</div></section>
  <section class="panel continue"><div class="panel-heading"><div><span class="eyebrow">Continue aprendendo</span><h2>${c.title}</h2></div></div><div class="continue-body">${ring(pct,`<strong>${pct}%</strong>`,'md')}<div><p>${done} de ${c.lessons.length} módulos concluídos.</p><p class="muted small">${pct===100?'Trilha concluída. Selo garantido!':`Próximo: ${c.lessons[Math.min(...[...Array(c.lessons.length).keys()].filter(i=>!(progress[c.id]||[]).includes(i)))]}`}</p></div></div><button class="btn dark full" data-course="${c.id}">${pct?pct===100?'Revisar a trilha':'Continuar de onde parei':'Começar a trilha'} ${ic('arrow')}</button></section>
 </div>
 <div class="dash-grid">
  <section class="panel"><div class="panel-heading"><div><span class="eyebrow">Comunicação institucional</span><h2>Comunicados recentes</h2></div><button class="text-link" data-page="avisos">Ver todos ${ic('arrow')}</button></div>${allNotices().slice(0,2).map(noticeHTML).join('')}</section>
  <section class="panel"><div class="panel-heading"><div><span class="eyebrow">Coleção</span><h2>Seus selos</h2></div><button class="text-link" data-page="jornada">Ver jornada ${ic('arrow')}</button></div><div class="seal-mini">${s.seals.map(x=>`<span class="seal-mini-item ${x.earned?'earned':''}" title="${x.title}${x.earned?'':' (a conquistar)'}">${sealSVG(x.icon,x.earned)}<small>${x.title}</small></span>`).join('')}</div></section>
 </div>
 <div class="section-label"><span class="eyebrow">Atalhos</span></div>
 <div class="shortcut-grid">${[['users','Comissões','Converse com a equipe e acompanhe documentos, pautas e tarefas.','comunidades'],['calendar','Agenda','Encontros para aprender, participar e construir juntos.','agenda'],['book','Biblioteca','Fontes oficiais organizadas para a sua rotina.','biblioteca'],...(exec?[['pen','Comunicados','Crie e organize os avisos para os associados.','gestao']]:[])].map(([i,t,d,p])=>`<button class="shortcut" data-page="${p}"><span class="shortcut-icon">${ic(i)}</span><b>${t}</b><small>${d}</small>${ic('arrow','go')}</button>`).join('')}</div>`;
}
function statTile(icon,value,label,page){return `<button class="stat-tile" data-page="${page}"><span class="stat-icon">${ic(icon)}</span><strong>${value}</strong><small>${label}</small></button>`}

/* ---------- Minha jornada ---------- */
function journeyPage(s){
 const counts=[s.notices,s.modules,s.reflections,s.events,s.refs,s.rooms,s.posts];
 return heading('Minha jornada','Cada participação soma pontos, avança seu nível e libera selos. Acompanhe sua evolução na ANOREG/PE.')+
 `<section class="journey-hero">${ring(s.levelPct,`<strong>${s.points}</strong><small>pontos</small>`,'xl')}<div class="journey-copy"><span class="eyebrow">Nível ${s.level} de ${levels.length}</span><h2>${s.levelName}</h2><p>${s.next?`Faltam <b>${s.next[0]-s.points} pontos</b> para alcançar o nível <b>${s.next[1]}</b>.`:'Você alcançou o nível mais alto da jornada.'}</p>${bar(s.levelPct,'gold')}</div></section>
 <ol class="level-ladder">${levels.map(([min,name],i)=>`<li class="${i+1<s.level?'past':i+1===s.level?'current':''}"><span class="ladder-dot">${i+1<s.level?ic('check'):i+1}</span><b>${name}</b><small>${min} pts</small></li>`).join('')}</ol>
 <div class="section-label"><span class="eyebrow">Coleção de selos</span><h2>${s.sealsEarned} de ${seals.length} selos conquistados</h2></div>
 <div class="seal-grid">${s.seals.map(x=>`<article class="seal-card ${x.earned?'earned':''}">${sealSVG(x.icon,x.earned)}<div><b>${x.title}</b><small>${x.desc}</small><span class="seal-state">${x.earned?ic('check')+' Conquistado':'A conquistar'}</span></div></article>`).join('')}</div>
 <div class="dash-grid">
  <section class="panel"><div class="panel-heading"><div><span class="eyebrow">Regras</span><h2>Como somar pontos</h2></div></div><table class="points-table"><thead><tr><th>Ação</th><th>Pontos</th><th>Você</th></tr></thead><tbody><tr><td>${ic('flag')}Boas-vindas à área de membros</td><td>+20</td><td>1</td></tr>${pointRules.map(([t,p,i],k)=>`<tr><td>${ic(i)}${t}</td><td>+${p}</td><td>${counts[k]}</td></tr>`).join('')}</tbody></table></section>
  <section class="panel"><div class="panel-heading"><div><span class="eyebrow">Metas sugeridas</span><h2>Para avançar agora</h2></div></div><div class="goal-list">${goals(s).map(goalRow).join('')}</div></section>
 </div>
 <p class="notice">Jornada de apresentação: pontos, níveis e selos são calculados neste navegador. Na implantação, as regras podem ser ajustadas pela ANOREG/PE e vinculadas à conta de cada membro.</p>`;
}

/* ---------- Avisos ---------- */
function noticeHTML(n){const isRead=readNotices.includes(n.id);return `<article class="announcement ${isRead?'is-read':''}"><div class="announcement-meta"><span class="badge">${esc(n.category||'Comunicado')}</span><span>${n.audience==='Todos'?'Todos os membros':'Somente '+esc(n.audience)}</span></div><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p><button class="read-button" data-read="${esc(n.id)}" ${isRead?'aria-pressed="true"':''}>${isRead?ic('check')+'Lido':'Marcar como lido <em>+10 pts</em>'}</button></article>`}
function noticesPage(s){const list=allNotices().filter(n=>noticeFilter==='Todos'||!readNotices.includes(n.id));return heading('Avisos e comunicados','Comunicados organizados, com identificação do público e confirmação de leitura.')+`<div class="toolbar"><div class="tabs" role="group" aria-label="Filtrar avisos">${['Todos','Não lidos'].map(t=>`<button data-notice-filter="${t}" class="${noticeFilter===t?'active':''}" aria-pressed="${noticeFilter===t}">${t}${t==='Não lidos'?` <span>${s.noticesTotal-s.notices}</span>`:''}</button>`).join('')}</div><span class="muted small">${s.notices} de ${s.noticesTotal} lidos</span></div><div class="notice-list">${list.map(noticeHTML).join('')||'<div class="empty-state">'+ic('check')+'<h3>Tudo em dia.</h3><p>Você leu todos os comunicados disponíveis.</p></div>'}</div>`}

/* ---------- Academia ---------- */
function academyPage(s){const cats=['Todas','Gestão','Inovação','Encontros'];return heading('ANOREG Academia','Aprenda no seu ritmo. Troque experiências. Evolua na prática.')+
 `<div class="academy-summary"><div>${ring(s.modulesTotal?s.modules/s.modulesTotal*100:0,`<strong>${s.modules}</strong><small>de ${s.modulesTotal}</small>`,'md')}<span><b>Módulos concluídos</b><small>Cada módulo vale 40 pontos</small></span></div><div><span class="stat-icon">${ic('seal')}</span><span><b>${s.coursesDone} trilha${s.coursesDone===1?'':'s'} concluída${s.coursesDone===1?'':'s'}</b><small>Ao concluir, você recebe o selo da trilha</small></span></div><div><span class="stat-icon">${ic('pen')}</span><span><b>${s.reflections} reflex${s.reflections===1?'ão':'ões'}</b><small>Aplicação prática registrada</small></span></div></div>
 <div class="toolbar"><div class="tabs" role="group" aria-label="Filtrar trilhas">${cats.map(t=>`<button class="${courseFilter===t?'active':''}" aria-pressed="${courseFilter===t}" data-course-filter="${t}">${t}</button>`).join('')}</div></div>
 <div class="track-grid">${courses.filter(c=>courseFilter==='Todas'||c.category===courseFilter).map(trackCard).join('')}</div>
 <p class="notice">Catálogo ilustrativo. Aulas, docentes, transmissões e certificados serão cadastrados na implantação.</p>`}
function trackCard(c){const pct=coursePercent(c.id),n=c.lessons.length,d=(progress[c.id]||[]).length;return `<article class="track-card ${pct===100?'complete':''}"><div class="track-art"><img src="${c.image}" alt="" loading="lazy"><span class="tag">${c.format} · ${c.category}</span>${pct===100?`<span class="track-seal">${sealSVG('seal',true)}</span>`:''}</div><div class="track-body"><h3>${c.title}</h3><p>${c.description}</p>${n?`<div class="track-progress">${bar(pct)}<span><b>${d}/${n}</b> módulos · ${pct}%</span></div><div class="track-dots">${c.lessons.map((l,i)=>`<span class="${(progress[c.id]||[]).includes(i)?'on':''}" title="${l}"></span>`).join('')}<small>+${n*40} pts</small></div>`:`<div class="track-progress"><span>${c.duration}</span></div>`}<button class="btn ${pct&&pct<100?'dark':'ghost'} full" data-course="${c.id}">${!n?'Conhecer o encontro':pct===100?'Revisar trilha':pct?'Continuar trilha':'Começar trilha'} ${ic('arrow')}</button></div></article>`}
function showCourse(id){if(!courses.some(c=>c.id===id))return;activeCourse=id;const c=courses.find(x=>x.id===id),done=progress[id]||[];activeLesson=Math.max(0,c.lessons.findIndex((_,i)=>!done.includes(i)));learningTab='jornada';portalPage='trilha';closeModal();renderPortal();$('.portal-body').scrollTop=0;focusPortalHeading()}
const learningCopy={gestao:[['Observe antes de transformar','Escolha uma rotina de atendimento e identifique onde há espera, retrabalho e dúvidas recorrentes.','Descreva uma melhoria que você testaria na rotina da sua equipe.'],['Clareza para trabalhar melhor','Organize responsabilidades e pontos de passagem entre pessoas. Um processo claro ajuda a equipe a manter a continuidade do serviço.','Escolha uma atividade e descreva quem inicia, quem executa e quem confere.'],['O cidadão no centro','Uma orientação clara reduz retornos e torna o atendimento mais acolhedor. Observe linguagem, acessibilidade e organização das informações.','Reescreva uma orientação frequente em linguagem simples.'],['Da intenção ao acompanhamento','Defina uma melhoria pequena, uma pessoa responsável e uma forma de observar seu resultado. Compare o processo antes e depois.','Registre uma melhoria, seu responsável e como você irá acompanhá-la.']],digital:[['Uma experiência conectada','Conheça os canais oficiais utilizados na sua rotina e organize orientações claras para quem precisa acessá-los.','Liste os canais oficiais que sua equipe costuma indicar.'],['Cuidado com a informação','Revise quem precisa acessar cada informação e como a equipe reconhece solicitações suspeitas.','Identifique um ponto da rotina em que o acesso pode ser melhor organizado.'],['Acesso para mais pessoas','Textos legíveis, instruções claras e navegação por teclado tornam os canais digitais mais fáceis de usar.','Escolha um formulário e registre uma melhoria de clareza.']]};
function renderLearning(){
 const c=courses.find(c=>c.id===activeCourse),pct=coursePercent(c.id),done=progress[c.id]||[],copy=learningCopy[c.id]?.[activeLesson];
 const top=`<button class="text-link back-link" data-page="cursos">${ic('back')} Voltar à Academia</button><section class="learning-hero"><div><span class="eyebrow">ANOREG Academia · ${esc(c.category)}</span><h1>${c.title}</h1><p>${c.description}</p><div class="hero-pills"><span>${c.duration}</span>${c.lessons.length?`<span>+40 pts por módulo</span><span>Selo ao concluir</span>`:'<span>Encontro ao vivo</span>'}</div></div>${c.lessons.length?ring(pct,`<strong>${pct}%</strong><small>concluído</small>`,'lg'):''}</section>`;
 if(!c.lessons.length)return top+`<section class="panel"><span class="eyebrow">Encontro ao vivo</span><h2>Boas conversas abrem caminhos.</h2><p>Uma proposta para reunir experiências entre especialidades. Programação, convidados e transmissão ainda serão definidos.</p><button class="btn dark" data-page="agenda">Conhecer a proposta do encontro ${ic('arrow')}</button></section>`;
 const isDone=done.includes(activeLesson),tabs=[['jornada','Conteúdo','play'],['pratica','Aplicação na serventia','pen']];
 return top+`<div class="learning-layout"><aside class="learning-road"><h2>Sua trilha</h2><p>${done.length} de ${c.lessons.length} módulos concluídos</p><ol>${c.lessons.map((l,i)=>`<li><button data-module="${i}" class="${i===activeLesson?'selected':''} ${done.includes(i)?'done':''}" aria-current="${i===activeLesson?'step':'false'}"><span class="step-dot">${done.includes(i)?ic('check'):i+1}</span><span><small>${done.includes(i)?'Concluído · +40 pts':'Módulo '+(i+1)}</small><b>${l}</b></span></button></li>`).join('')}<li class="road-end ${pct===100?'done':''}"><span class="step-dot">${ic('seal')}</span><span><small>${pct===100?'Conquistado':'Ao final'}</small><b>Selo da trilha</b></span></li></ol></aside>
 <section class="panel lesson-surface"><div class="segmented" role="group" aria-label="Etapas do módulo">${tabs.map(([id,t,i],k)=>`<button data-learning-tab="${id}" aria-pressed="${learningTab===id}"><span class="seg-num">${k+1}</span>${t}</button>`).join('')}</div><span class="eyebrow">Módulo ${activeLesson+1} de ${c.lessons.length}${isDone?' · concluído':''}</span><h2>${copy[0]}</h2>
 ${learningTab==='jornada'?`<div class="lesson-visual"><span>${String(activeLesson+1).padStart(2,'0')}</span><div><strong>${c.lessons[activeLesson]}</strong><small>Roteiro de aprendizagem</small></div></div><p>${copy[1]}</p><button class="btn dark" data-learning-tab="pratica">Aplicar na serventia ${ic('arrow')}</button>`:learningTab==='pratica'?`<p>${copy[2]}</p><label class="field">Plano de aplicação<textarea id="learning-note" class="input" rows="5" placeholder="Registre como aplicar na sua serventia…">${esc(read('note-'+c.id+'-'+activeLesson,''))}</textarea></label><p class="muted small">Anotação particular, salva neste navegador. Cada plano registrado vale 20 pontos.</p><div class="button-row"><button class="btn ghost" data-save-reflection>Salvar plano</button>${isDone?`<span class="done-tag">${ic('check')}Módulo concluído</span>`:`<button class="btn dark" data-complete-module>Concluir módulo <em>+40 pts</em></button>`}</div>`:''}
 <footer class="lesson-footer"><span>${isDone?ic('check')+'Módulo concluído':'Conclua o módulo para somar 40 pontos'}</span>${activeLesson<c.lessons.length-1?`<button class="text-link" data-module="${activeLesson+1}">Próximo módulo ${ic('arrow')}</button>`:`<button class="text-link" data-page="cursos">Voltar ao catálogo ${ic('arrow')}</button>`}</footer></section></div>
 <p class="notice">Demonstração interativa: progresso e reflexões ficam neste navegador. Aulas, professores e certificados oficiais ainda não foram cadastrados.</p>`}

/* ---------- Biblioteca ---------- */
const references=[{id:'r-pe',title:'Normas e orientações de Pernambuco',source:'TJPE · Corregedoria',category:'Normas',url:'https://portal.tjpe.jus.br/web/corregedoria',desc:'Acompanhe as publicações e orientações no canal da Corregedoria.',code:'PE'},{id:'r-br',title:'Atos e orientações nacionais',source:'Conselho Nacional de Justiça',category:'Normas',url:'https://www.cnj.jus.br/corregedoria/',desc:'Acesso ao acervo e às informações da Corregedoria Nacional.',code:'BR'},{id:'r-anoreg',title:'Acervo da ANOREG Pernambuco',source:'ANOREG/PE',category:'Institucional',url:'https://www.anoregpe.org.br/',desc:'Publicações e informações institucionais da entidade.',code:'PE'},...news.map((n,i)=>({id:'r-'+n.id,title:n.title,source:n.source,category:n.category,url:n.url,desc:n.description,code:'0'+(i+1)}))];
function libraryResults(){const rows=references.filter(r=>(libraryFilter==='Todas'||r.category===libraryFilter)&&normalizeOrg(r.title+' '+r.source+' '+r.desc).includes(normalizeOrg(libraryQuery)));return rows.length?rows.map(r=>{const seen=refsOpened.includes(r.id);return `<a class="reference-card ${seen?'seen':''}" href="${r.url}" target="_blank" rel="noopener" data-ref="${r.id}"><div class="reference-cover"><span class="badge">${r.category}</span><strong>${r.code}</strong><small>${r.source}</small></div><div class="reference-body"><h3>${r.title}</h3><p>${r.desc}</p><b><span>${seen?ic('check')+'Consultada':'Consultar fonte oficial <em>+5 pts</em>'}</span>${ic('ext')}</b></div></a>`}).join(''):'<p class="empty">Nenhuma referência encontrada. Tente outro termo ou categoria.</p>'}
function renderLibrary(){return heading('Biblioteca de referências','Fontes confiáveis, organizadas para a sua rotina.')+`<div class="toolbar"><label class="search-field"><span class="sr-only">Buscar na biblioteca</span>${ic('search')}<input id="library-search" class="input" type="search" placeholder="Tema, órgão ou palavra-chave" value="${esc(libraryQuery)}"></label><div class="tabs" role="group" aria-label="Filtrar referências">${['Todas','Normas','Institucional','Cidadania','Categoria'].map(t=>`<button data-library-filter="${t}" class="${libraryFilter===t?'active':''}" aria-pressed="${libraryFilter===t}">${t}</button>`).join('')}</div></div><div class="reference-grid" id="reference-results" aria-live="polite">${libraryResults()}</div>`}

/* ---------- Agenda ---------- */
const meetingData=[{id:'live',type:'Encontro entre especialidades',title:'Conexões que fortalecem a atividade.',desc:'Um espaço para trocar experiências, discutir desafios e aproximar profissionais.',image:'capa-formacao.webp',format:'Online · proposto',agenda:['Abertura e apresentação dos participantes','Troca de experiências entre especialidades','Perguntas e encaminhamentos']},{id:'gestao',type:'Diálogo da diretoria',title:'Próximos passos, construídos em conjunto.',desc:'Alinhamento de prioridades e acompanhamento das frentes institucionais.',image:'capa-reuniao.webp',format:'A confirmar',agenda:['Prioridades das comissões','Organização das próximas entregas','Encaminhamentos da diretoria']}];
function renderAgenda(){return heading('Agenda e encontros','Encontros para aprender, participar e construir juntos.')+`<div class="meeting-grid">${meetingData.filter(e=>e.id!=='gestao'||role!=='associado').map(e=>{const on=savedEvents.includes(e.id);return `<article class="meeting-card"><div class="meeting-photo"><img src="${e.image}" alt=""><span class="date-block"><small>Data</small><b>A definir</b></span></div><div class="meeting-content"><span class="eyebrow">${e.type}</span><h2>${e.title}</h2><p>${e.desc}</p><dl class="meeting-meta"><div><dt>Quando</dt><dd>A definir</dd></div><div><dt>Formato</dt><dd>${e.format}</dd></div></dl><div class="button-row"><button class="btn dark" data-meeting="${e.id}">Ver programação</button><button class="btn ${on?'ghost':'outline'}" data-event="${e.id}" aria-pressed="${on}">${on?ic('check')+'Na minha agenda':'Acompanhar <em>+15 pts</em>'}</button></div></div></article>`}).join('')}</div><p class="notice">Encontros demonstrativos, sem data confirmada ou inscrição aberta. Sua seleção fica salva neste navegador.</p>`}

/* ---------- Gestão e visão institucional ---------- */
function managementPage(){return heading('Gestão de comunicados','Crie, revise e organize os comunicados deste ambiente.',`<button class="btn dark" id="new-notice">${ic('pen')} Novo comunicado</button>`)+`<section class="panel"><div class="panel-heading"><div><span class="eyebrow">Publicados nesta demonstração</span><h2>Comunicados</h2></div><span class="chip">Armazenamento local</span></div><table class="admin-table"><thead><tr><th>Título</th><th>Público</th><th>Ações</th></tr></thead><tbody>${notices.length?notices.map(n=>`<tr><td data-label="Título">${esc(n.title)}</td><td data-label="Público">${esc(n.audience)}</td><td data-label="Ações"><button class="text-link" data-edit-notice="${esc(n.id)}">Editar</button> <button class="text-link danger" data-delete-notice="${esc(n.id)}">Excluir</button></td></tr>`).join(''):'<tr><td colspan="3" class="muted">Ainda não há comunicados criados. Use “Novo comunicado” para experimentar.</td></tr>'}</tbody></table></section><section class="panel"><div class="panel-heading"><div><span class="eyebrow">Fluxo editorial proposto</span><h2>Do rascunho ao mural</h2></div></div><ol class="flow">${['Preparação do conteúdo','Revisão pela diretoria','Validação e publicação para o público escolhido'].map((t,i)=>`<li><span>${i+1}</span>${t}</li>`).join('')}</ol><p class="notice">A edição nesta versão atua somente nos exemplos deste navegador. Não publica no site oficial nem envia notificações a associados.</p></section>`}
function editNotice(id){const n=notices.find(n=>n.id===id);modal(n?'Editar comunicado':'Novo comunicado',`<form id="notice-form" data-id="${n?.id||''}"><label class="field">Título<input class="input" name="title" required maxlength="150" value="${esc(n?.title||'')}" placeholder="Qual é a informação principal?"></label><label class="field">Público<select class="input" name="audience"><option ${n?.audience==='Todos'?'selected':''}>Todos</option><option ${n?.audience==='Diretoria'?'selected':''}>Diretoria</option></select></label><label class="field">Mensagem<textarea class="input" name="body" required maxlength="3000" rows="5" placeholder="Escreva uma mensagem clara e objetiva.">${esc(n?.body||'')}</textarea></label><p class="notice">Salvo somente neste navegador, como exemplo de comunicação interna.</p><button type="submit" class="btn dark">Salvar comunicado</button></form>`,'GESTÃO DE CONTEÚDOS · EXEMPLO LOCAL')}
function renderInstitution(){const cs=organizationData.commissions,projects=cs.flatMap(c=>c.projects),max=Math.max(...cs.map(c=>c.projects.length));return heading('Visão institucional','Pessoas, iniciativas e próximos passos em uma visão integrada.')+`<div class="stat-row three">${statTile('flag',cs.length,'comissões temáticas','institucional')}${statTile('pin',organizationData.regions.length,'diretorias regionais','institucional')}${statTile('list',projects.length,'projetos no acervo fornecido','institucional')}</div><section class="panel"><div class="panel-heading"><div><span class="eyebrow">Frentes de atuação</span><h2>Projetos por comissão</h2></div><span class="chip">Selecione para conhecer</span></div><div class="commission-bars">${[...cs].sort((a,b)=>b.projects.length-a.projects.length).map(c=>`<button data-institution-commission="${c.id}"><span class="cb-name">${esc(orgTitle(c))}</span><span class="cb-bar"><span style="width:${max?c.projects.length/max*100:0}%"></span></span><span class="cb-num">${c.projects.length}</span></button>`).join('')}</div></section><p class="notice">Contagens calculadas a partir do acervo fornecido. Não representam indicadores de execução ou resultados da gestão.</p>`}

/* ---------- Eventos ---------- */
document.addEventListener('click',e=>{
 const el=e.target.closest('button,a');if(!el)return;
 if(el.dataset.demoRole){demoMode=true;enterPortal(el.dataset.demoRole);toast(`Você entrou como <b>${roleLabel()}</b>. Explore à vontade.`);return}
 if(el.dataset.page&&!$('#portal').hidden){navigate(el.dataset.page);return}
 if(el.dataset.course){showCourse(el.dataset.course);return}
 if(el.dataset.read&&!readNotices.includes(el.dataset.read)){readNotices.push(el.dataset.read);save('read',readNotices);gainReason='Comunicado lido';renderPortal()}
 if(el.dataset.noticeFilter){noticeFilter=el.dataset.noticeFilter;renderPortal()}
 if(el.dataset.courseFilter){courseFilter=el.dataset.courseFilter;renderPortal()}
 if(el.dataset.event){const id=el.dataset.event,on=!savedEvents.includes(id);savedEvents=on?[...savedEvents,id]:savedEvents.filter(x=>x!==id);save('events',savedEvents);if(on)gainReason='Encontro na sua agenda';renderPortal();if(!on)toast('Encontro removido da sua agenda.')}
 if(el.dataset.ref&&!refsOpened.includes(el.dataset.ref)){refsOpened.push(el.dataset.ref);save('refs',refsOpened);gainReason='Referência oficial consultada';setTimeout(renderPortal,50)}
 if(el.dataset.module!==undefined){activeLesson=Number(el.dataset.module);learningTab='jornada';renderPortal();focusPortalHeading()}
 if(el.dataset.learningTab){learningTab=el.dataset.learningTab;renderPortal()}
 if(el.hasAttribute('data-save-reflection')){const v=$('#learning-note').value.trim(),had=String(read('note-'+activeCourse+'-'+activeLesson,'')).trim();save('note-'+activeCourse+'-'+activeLesson,v);if(v&&!had){gainReason='Reflexão registrada';renderPortal()}else toast(v?'Reflexão atualizada.':'Escreva sua reflexão antes de salvar.')}
 if(el.hasAttribute('data-complete-module')&&!(progress[activeCourse]||[]).includes(activeLesson)){progress[activeCourse]=[...new Set([...(progress[activeCourse]||[]),activeLesson])];save('progress',progress);gainReason=coursePercent(activeCourse)===100?'Trilha concluída':'Módulo concluído';renderPortal()}
 if(el.dataset.libraryFilter){libraryFilter=el.dataset.libraryFilter;renderPortal()}
 if(el.dataset.meeting){const m=meetingData.find(x=>x.id===el.dataset.meeting);modal(m.title,`<figure class="dialog-cover"><img src="${m.image}" alt=""></figure><p>${m.desc}</p><h3>Proposta de programação</h3><ol class="flow">${m.agenda.map((a,i)=>`<li><span>${i+1}</span>${a}</li>`).join('')}</ol><p class="notice">Data, participantes e transmissão serão confirmados pela entidade.</p>`,'AGENDA · ENCONTRO PROPOSTO')}
 if(el.dataset.institutionCommission)openOrganization(el.dataset.institutionCommission);
 if(el.id==='new-notice'&&role!=='associado')editNotice();
 if(el.dataset.editNotice&&role!=='associado')editNotice(el.dataset.editNotice);
 if(el.dataset.deleteNotice&&role!=='associado'){const n=notices.find(n=>n.id===el.dataset.deleteNotice);if(n)modal('Excluir comunicado?',`<p>O comunicado “${esc(n.title)}” será removido deste navegador.</p><button class="btn dark" data-confirm-delete="${esc(n.id)}">Excluir comunicado</button>`)}
 if(el.dataset.confirmDelete&&role!=='associado'){notices=notices.filter(n=>n.id!==el.dataset.confirmDelete);save('notices',notices);closeModal();renderPortal();toast('Comunicado removido.')}
});
document.addEventListener('input',e=>{if(e.target.id==='library-search'){libraryQuery=e.target.value;$('#reference-results').innerHTML=libraryResults()}});
document.addEventListener('submit',e=>{if(e.target.id!=='notice-form')return;e.preventDefault();if(role==='associado')return;const data=new FormData(e.target),id=e.target.dataset.id||'local-'+Date.now();const n={id,title:String(data.get('title')).trim(),body:String(data.get('body')).trim(),audience:data.get('audience'),category:'Exemplo local'};if(!n.title||!n.body){toast('Preencha o título e a mensagem.');return}notices=[n,...notices.filter(x=>x.id!==id)];save('notices',notices);closeModal();renderPortal();toast('Comunicado salvo neste navegador.')});
