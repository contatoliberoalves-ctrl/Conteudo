const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ic=(name,cls='')=>`<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem('anoreg-demo-'+key))??fallback}catch{return fallback}};
const save=(key,value)=>{try{localStorage.setItem('anoreg-demo-'+key,JSON.stringify(value))}catch{toast('O navegador não permitiu salvar esta preferência.')}};
let progress=read('progress',{}),readNotices=read('read',[]),savedEvents=read('events',[]),role='associado',portalPage='painel',courseFilter='Todas',newsFilter='Todas';
let notices=read('notices',[]);

const news=[
{id:'n1',category:'Institucional',source:'TJPE · Corregedoria',title:'Entidades dos cartórios de Pernambuco dialogam com a Corregedoria',description:'Encontro reúne representantes da atividade extrajudicial e do Tribunal de Justiça de Pernambuco.',url:'https://portal.tjpe.jus.br/web/corregedoria/-/associa%C3%A7%C3%B5es-de-cart%C3%B3rios-realizam-visita-de-cortesia-ao-novo-corregedor-geral-da-justi%C3%A7a-de-pernambuco'},
{id:'n2',category:'Cidadania',source:'ANOREG/BR',title:'Informação para cada momento da vida',description:'Conheça o papel dos serviços notariais e registrais e encontre orientações nos canais nacionais.',url:'https://www.anoreg.org.br/site/'},
{id:'n3',category:'Categoria',source:'ANOREG/SP',title:'Capacitação digital ganha espaço na atividade extrajudicial',description:'ANOREG/SP apresenta plataforma de ensino com conteúdos exclusivos para associados.',url:'https://www.anoregsp.org.br/noticias/97513/anoregsp-lanca-plataforma-ead-com-treinamentos-e-conteudos-exclusivos-para-associados?filtro=1%2C10'},
{id:'n4',category:'Categoria',source:'ANOREG/PE',title:'Formação e encontros para a comunidade notarial e registral',description:'Acompanhe os cursos divulgados pela entidade no portal institucional atual.',url:'https://www.anoregpe.org.br/cursos-abertos/'}];
const newsImages=['capa-reuniao.webp','capa-digital.webp','capa-formacao.webp','recife.webp'];

const services=[
{id:'cartorios',icon:'pin',title:'Encontre um cartório',text:'Localize a serventia e consulte os dados oficiais.',body:'Consulte os serviços extrajudiciais em Pernambuco pelo sistema Justiça Aberta do Conselho Nacional de Justiça. Confira endereço, especialidade e contatos antes de se deslocar.',links:[['Consultar Justiça Aberta · CNJ','https://www.cnj.jus.br/corregedoria/justica_aberta/']]},
{id:'certidoes',icon:'doc',title:'Certidões e registros',text:'Nascimento, casamento, óbito e outros documentos.',body:'Escolha a central correspondente ao documento de que você precisa. Os pedidos e pagamentos são realizados diretamente no canal oficial responsável.',links:[['Registro Civil · certidões','https://www.registrocivil.org.br/'],['Registro de Imóveis · ONR','https://registradores.onr.org.br/']]},
{id:'notas',icon:'pen',title:'Escrituras e procurações',text:'Conheça os serviços dos tabelionatos de notas.',body:'A plataforma e-Notariado reúne serviços notariais eletrônicos. Para saber os documentos, os custos e os requisitos do seu caso, procure o tabelionato responsável.',links:[['Acessar e-Notariado','https://www.e-notariado.org.br/']]},
{id:'protesto',icon:'shield',title:'Consulta de protesto',text:'Encontre os canais de consulta e regularização.',body:'Acesse a central nacional de protesto para consultar os serviços disponíveis. Confirme os dados da dívida e do cartório no próprio canal oficial.',links:[['Central nacional de protesto','https://www.pesquisaprotesto.com.br/']]}];

const courses=[
{id:'gestao',title:'Gestão que transforma o cartório',category:'Gestão',format:'Gravada',duration:'4 módulos',image:'capa-formacao.webp',description:'Pessoas, processos e qualidade no atendimento.',lessons:['Diagnóstico da rotina da serventia','Processos e organização da equipe','Atendimento centrado no cidadão','Indicadores e plano de melhoria']},
{id:'digital',title:'O presente digital da atividade extrajudicial',category:'Inovação',format:'Gravada',duration:'3 módulos',image:'capa-digital.webp',description:'Transformação digital com segurança e propósito.',lessons:['Serviços eletrônicos e centrais oficiais','Governança de dados e segurança','Acessibilidade nos canais digitais']},
{id:'encontro',title:'Conexões: diálogo entre especialidades',category:'Encontros',format:'Ao vivo',duration:'Programação em definição',image:'capa-reuniao.webp',description:'Um espaço de troca entre notários e registradores.',lessons:[]}];

const baseNotices=[
{id:'welcome',title:'Bem-vindo ao novo espaço de membros',body:'Reúna seus avisos, materiais e trilhas de formação em um só lugar. Comunicado ilustrativo.',audience:'Todos',category:'Institucional'},
{id:'learning',title:'Explore as trilhas da ANOREG Academia',body:'Abra uma trilha e conheça a organização dos módulos. Conteúdo ilustrativo, sem vídeos cadastrados.',audience:'Todos',category:'Capacitação'},
{id:'board',title:'Pauta de trabalho da diretoria',body:'Exemplo de comunicado restrito à gestão: acompanhar propostas de formação e organizar a pauta institucional.',audience:'Diretoria',category:'Gestão'}];
const allNotices=()=>[...notices,...baseNotices].filter(n=>role!=='associado'||n.audience==='Todos');

function toast(message,kind=''){const t=$('#toast');t.className='';t.innerHTML=/^\s*</.test(message)?message:`<span>${message}</span>`;if(kind)t.classList.add(kind);void t.offsetWidth;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),3600)}
let lastFocus;
function modal(title,content,kicker='ANOREG PERNAMBUCO',size=''){const m=$('#modal');if(!m.open)lastFocus=document.activeElement;m.className=size;$('#modal-kicker').textContent=kicker;$('#modal-content').innerHTML=`<h2 id="modal-title">${title}</h2>${content}`;if(!m.open)m.showModal()}
function closeModal(){$('#modal').close()}
$('#modal').addEventListener('close',()=>{if(lastFocus?.isConnected&&!lastFocus.closest('[inert]'))lastFocus.focus()});
$('#modal-close').onclick=closeModal;
$('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal()}});

/* Notícias */
function renderNews(){const list=newsFilter==='Todas'?news.slice(0,3):news.filter(n=>n.category===newsFilter);$('#news-grid').innerHTML=list.map((n,i)=>`<article class="news-card${newsFilter==='Todas'&&i===0?' featured':''}"><figure><img src="${newsImages[news.indexOf(n)%newsImages.length]}" alt="" loading="lazy"><span class="news-tag">${n.category}</span></figure><div class="news-body"><div class="news-meta">${n.source}</div><h3><a href="${n.url}" target="_blank" rel="noopener">${n.title}</a></h3><p>${n.description}</p><span class="text-link" aria-hidden="true">Ler na fonte oficial ${ic('ext')}</span></div></article>`).join('')}
$('#news-tabs').onclick=e=>{const b=e.target.closest('[data-filter]');if(!b)return;newsFilter=b.dataset.filter;$$('#news-tabs button').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});renderNews()};
renderNews();
$('#all-news').onclick=()=>modal('Notícias e informações',`<p>Uma seleção de conteúdos e referências oficiais. As publicações são abertas no portal de origem.</p><div class="info-list">${news.map(n=>`<a href="${n.url}" target="_blank" rel="noopener"><span><strong>${n.title}</strong><small>${n.category} · ${n.source}</small></span>${ic('ext')}</a>`).join('')}</div>`);

/* Cidadão */
$('#services').innerHTML=services.map((s,i)=>`<button class="service" data-service="${s.id}"><span class="service-icon">${ic(s.icon)}</span><span class="service-num">0${i+1}</span><h3>${s.title}</h3><p>${s.text}</p><span class="service-go">Ver caminho oficial ${ic('arrow')}</span></button>`).join('');
function showService(id){const s=services.find(s=>s.id===id);modal(s.title,`<p>${s.body}</p><div class="info-list">${s.links.map(([text,url])=>`<a href="${url}" target="_blank" rel="noopener"><span><strong>${text}</strong></span>${ic('ext')}</a>`).join('')}</div><p class="notice">Você será encaminhado ao órgão ou central responsável. Este portal não recebe documentos nem pagamentos por esses serviços.</p>`,'PARA O CIDADÃO')}

/* Academia pública */
$('#public-courses').innerHTML=courses.map(c=>`<article class="course-card"><div class="course-art"><img src="${c.image}" alt="" loading="lazy"><span class="tag">${c.format} · ${c.category}</span></div><div class="course-body"><h3>${c.title}</h3><p>${c.description}</p><div class="course-foot"><span>${c.lessons.length?c.lessons.length+' módulos':c.duration}</span><button class="text-link light" data-members>Conheça a proposta ${ic('arrow')}</button></div></div></article>`).join('');

/* Informações institucionais */
const info={
diretoria:['Presidência e diretoria',`<p>A presidência da ANOREG/PE é exercida por André Villaverde de Araújo, conforme o diretório da ANOREG/BR consultado para esta proposta.</p><div class="info-list"><div><span><strong>André Villaverde de Araújo</strong><small>Presidente · ANOREG Pernambuco</small></span></div><a href="https://www.anoreg.org.br/site/anoregs-estaduais/" target="_blank" rel="noopener"><span><strong>Consultar diretório da ANOREG/BR</strong></span>${ic('ext')}</a></div><p class="notice">A composição completa da diretoria, as fotos e os mandatos serão cadastrados a partir da documentação validada pela entidade.</p>`],
atuacao:['Atuação institucional',`<p>A proposta é tornar o trabalho institucional visível, com uma linha do tempo de pautas, interlocuções e resultados documentados.</p><div class="info-list"><a href="${news[0].url}" target="_blank" rel="noopener"><span><strong>Diálogo com a Corregedoria de Pernambuco</strong><small>Reunião das entidades da atividade extrajudicial · Fonte: TJPE</small></span>${ic('ext')}</a><a href="https://www.anoregpe.org.br/" target="_blank" rel="noopener"><span><strong>Acompanhar o acervo da ANOREG/PE</strong></span>${ic('ext')}</a></div><p class="notice">Novas conquistas serão publicadas com data, contexto e documentos de referência.</p>`],
transparencia:['Governança e transparência',`<p>Espaço planejado para reunir estatuto, composição da diretoria, relatórios institucionais e documentos de governança.</p><div class="info-list"><a href="https://www.anoregpe.org.br/" target="_blank" rel="noopener"><span><strong>Consultar o portal institucional atual</strong></span>${ic('ext')}</a><a href="https://www.anoregpe.org.br/missao-visao-e-valores/" target="_blank" rel="noopener"><span><strong>Missão, visão e valores</strong></span>${ic('ext')}</a></div><p class="notice">Os documentos serão incorporados após validação pela ANOREG/PE. Informações internas terão acesso definido conforme o perfil do membro.</p>`],
associar:['Associe-se à ANOREG/PE',`<p>Para conhecer os critérios, contribuições e benefícios vigentes, fale diretamente com a ANOREG Pernambuco.</p><div class="info-list"><a href="tel:+5581992569785"><span><strong>Ligar para (81) 99256-9785</strong></span>${ic('arrow')}</a><a href="https://www.anoregpe.org.br/" target="_blank" rel="noopener"><span><strong>Acessar o portal institucional atual</strong></span>${ic('ext')}</a></div><p class="notice">Contato conforme diretório da ANOREG/BR. Esta apresentação não recebe pedidos de associação.</p>`],
privacidade:['Privacidade',`<p>A área das comissões usa a conta autenticada na hospedagem e os vínculos definidos pela administração. Mensagens, respostas, arquivos, tarefas, pautas e atas são armazenados no servidor e ficam disponíveis aos integrantes autorizados e à administração.</p><p>Progresso, pontos, selos, comunicados de exemplo e preferências das demais seções continuam locais a este navegador. O botão abaixo apaga apenas esses dados locais, sem apagar registros das comissões.</p><p>Os links externos seguem as políticas dos respectivos portais. A página carrega fontes do Google Fonts. A hospedagem pode registrar dados técnicos conforme suas políticas.</p><button class="btn dark" id="clear-demo">Apagar dados locais de demonstração</button><p class="notice">A política institucional definitiva e os canais do encarregado serão cadastrados na implantação oficial.</p>`],
acessibilidade:['Acessibilidade',`<p>A proposta inclui navegação por teclado, foco visível, atalho para o conteúdo, adaptação a telas menores, descrição das imagens e respeito à preferência por movimento reduzido.</p><p>Use os controles de contraste e ampliação de texto no topo. O conteúdo e os formulários usam títulos, rótulos e elementos semânticos.</p><p>Uma auditoria completa de acessibilidade deverá acompanhar a implantação e o cadastro dos conteúdos oficiais.</p>`]
};

document.addEventListener('click',e=>{
 const el=e.target.closest('button,a');if(!el)return;
 if(el.matches('[data-members]'))showRoles();
 if(el.dataset.service){e.preventDefault();showService(el.dataset.service)}
 if(el.dataset.info){const [t,c]=info[el.dataset.info];modal(t,el.dataset.info==='diretoria'?`<figure class="dialog-cover"><img src="capa-reuniao.webp" alt="Ambiente de reunião ilustrativo"></figure>${c}`:c)}
 if(el.id==='clear-demo'){for(const k of Object.keys(localStorage)){if(k.startsWith('anoreg-demo-'))localStorage.removeItem(k)}progress={};readNotices=[];savedEvents=[];notices=[];document.body.classList.remove('contrast','large-font');syncA11y();closeModal();window.resetJourney?.();if(!$('#portal').hidden)renderPortal();toast('Dados locais de demonstração apagados.')}
});

/* Menu e acessibilidade */
const setMenu=open=>{$('#navlinks').classList.toggle('open',open);$('#menu').setAttribute('aria-expanded',String(open));$('#menu').setAttribute('aria-label',open?'Fechar menu':'Abrir menu');$('#menu').innerHTML=ic(open?'close':'menu')};
$('#menu').onclick=()=>setMenu(!$('#navlinks').classList.contains('open'));
$$('#navlinks a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
function syncA11y(){const c=document.body.classList.contains('contrast'),f=document.body.classList.contains('large-font');document.documentElement.classList.toggle('large-font',f);$('#contrast').setAttribute('aria-pressed',String(c));$('#font').setAttribute('aria-pressed',String(f));$('#font').lastChild.textContent=f?'Texto padrão':'Ampliar texto'}
if(read('contrast',false))document.body.classList.add('contrast');if(read('font',false))document.body.classList.add('large-font');syncA11y();
$('#contrast').onclick=()=>{document.body.classList.toggle('contrast');save('contrast',document.body.classList.contains('contrast'));syncA11y()};
$('#font').onclick=()=>{document.body.classList.toggle('large-font');save('font',document.body.classList.contains('large-font'));syncA11y();toast(document.body.classList.contains('large-font')?'Texto ampliado.':'Tamanho de texto padrão.')};
const headerEl=$('.site-header');addEventListener('scroll',()=>headerEl.classList.toggle('scrolled',scrollY>40),{passive:true});

/* Busca */
$('#search-open').onclick=()=>{modal('O que você procura?',`<label class="search-field big"><span class="sr-only">Pesquise no portal</span>${ic('search')}<input type="search" class="input" id="site-search" placeholder="Notícias, serviços, capacitação…" autocomplete="off"></label><div class="results" id="search-results"><p class="muted">Digite para encontrar um serviço ou seção. Experimente “certidão”, “cartório” ou “curso”.</p></div>`,'BUSCA');$('#site-search').focus()};
document.addEventListener('input',e=>{if(e.target.id!=='site-search')return;const q=normalizeOrg(e.target.value).trim();const entries=[{title:'Comissões temáticas e diretorias regionais',anchor:'#comissoes',text:'membros projetos atividades regiões'},...services.map(s=>({title:s.title,service:s.id,text:s.text})),...news.map(n=>({title:n.title,url:n.url,text:n.category})),{title:'ANOREG Academia · capacitação',anchor:'#academia',text:'cursos formação'},{title:'Normas e emolumentos',anchor:'#biblioteca',text:'legislação biblioteca'},{title:'A ANOREG Pernambuco',anchor:'#institucional',text:'institucional diretoria'}];const found=q?entries.filter(x=>normalizeOrg(x.title+' '+x.text).includes(q)):[];$('#search-results').innerHTML=q?(found.length?found.map(x=>x.service?`<button data-service="${x.service}"><span>${x.title}</span>${ic('arrow')}</button>`:`<a href="${x.url||x.anchor}" ${x.url?'target="_blank" rel="noopener"':'data-search-anchor="true"'}><span>${x.title}</span>${ic(x.url?'ext':'arrow')}</a>`).join(''):'<p class="empty">Nenhum resultado. Tente “certidão”, “cartório” ou “curso”.</p>'):'<p class="muted">Digite para encontrar um serviço ou seção.</p>'});
document.addEventListener('click',e=>{if(e.target.closest('[data-search-anchor]'))closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);$('#portal')?.classList.remove('nav-open');$('#portal-menu')?.setAttribute('aria-expanded','false')}});

/* Comissões e diretorias regionais */
let organizationKind='commissions',orgQuery='',orgExpanded=false,orgActive=null,orgView='projects',orgFilter='Todos';
const normalizeOrg=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const orgTitle=c=>c.name.replace(/^Comissão (de |da )/i,'').replace(/^Diretoria Regional da \d+ª Região - /i,'').replace(/ \(DR-\d+\)$/,'');
const initials=name=>name==='Não informado no projeto'?'—':name.split(' ').filter(x=>x.length>2).slice(0,2).map(x=>x[0]).join('');
function orgIcon(c){if(c.kind==='regional')return 'pin';const n=c.name;return /tecnolog/i.test(n)?'shield':/educa|treinamento/i.test(n)?'cap':/jurisprud|legislativa|tribut|prerrogativ|padroniza/i.test(n)?'scale':/comunica/i.test(n)?'megaphone':/evento/i.test(n)?'calendar':/mulheres|social/i.test(n)?'users':/convênio/i.test(n)?'seal':/gestão/i.test(n)?'chart':'flag'}
function renderOrganization(){
 const entries=organizationData[organizationKind].filter(c=>normalizeOrg(c.name+' '+c.members.map(m=>m.name).join(' ')+' '+c.projects.map(p=>p.title).join(' ')).includes(normalizeOrg(orgQuery)));
 $('#org-count').textContent=entries.length+(entries.length===1?' equipe':' equipes');
 $('#org-cards').innerHTML=entries.slice(0,orgExpanded||orgQuery?entries.length:6).map(c=>{const dr=c.name.match(/\(DR-(\d+)\)/);return `<button class="org-card" data-org-open="${c.id}" aria-haspopup="dialog"><span class="org-card-top"><span class="org-icon">${ic(orgIcon(c))}</span><span class="org-card-type">${c.kind==='regional'?'Diretoria regional · DR-'+dr?.[1]:'Comissão temática'}</span></span><strong>${esc(orgTitle(c))}</strong><span class="org-card-person"><span class="org-initial" aria-hidden="true">${esc(initials(c.members[0]?.name||''))}</span><span><small>${esc(c.members[0]?.role||'')}</small>${esc(c.members[0]?.name||'Composição em atualização')}</span></span><span class="org-card-foot"><span>${c.projects.length?c.projects.length+(c.projects.length===1?' projeto':' projetos'):'Projetos em atualização'} · ${c.members.length} integrantes</span><span class="org-card-action">${ic('arrow')}</span></span></button>`}).join('')||'<p class="empty">Nenhuma equipe encontrada. Tente outro nome ou região.</p>';
 $('#org-more').hidden=entries.length<=6||!!orgQuery;$('#org-more').textContent=orgExpanded?'Mostrar menos':'Ver todas as '+entries.length+' equipes';
}
function openOrganization(id){orgActive=[...organizationData.commissions,...organizationData.regions].find(c=>c.id===id);orgView='projects';orgFilter='Todos';renderOrgDialog()}
function editorialTitle(t){return t===t.toLocaleUpperCase('pt-BR')?t.charAt(0)+t.slice(1).toLocaleLowerCase('pt-BR').replace(/anoreg|lgpd|cnj|tjpe|pe\b|igb|abv|vp\b|lae|ti\b|qi\b/gi,w=>w.toUpperCase()):t}
function renderOrgDialog(){
 const c=orgActive;if(!c)return;
 const projects=c.projects.filter(p=>orgFilter==='Todos'||p.status===orgFilter);
 const filters=[...new Set(c.projects.map(p=>p.status))];
 const tabs=`<div class="org-dialog-head"><span class="org-icon big">${ic(orgIcon(c))}</span><p class="org-detail-intro">${esc(c.name)}</p></div><div class="segmented" role="group" aria-label="Conteúdo da equipe"><button data-org-view="projects" aria-pressed="${orgView==='projects'}">Projetos <span>${c.projects.length}</span></button><button data-org-view="members" aria-pressed="${orgView==='members'}">Integrantes <span>${c.members.length}</span></button></div>`;
 const content=orgView==='members'?`<div class="org-members">${c.members.map(m=>`<div class="org-member"><span class="org-initial" aria-hidden="true">${esc(initials(m.name))}</span><div><small>${esc(m.role)}</small><strong>${esc(m.name)}</strong></div></div>`).join('')}</div>`:`${filters.length>1?`<div class="chip-filters" role="group" aria-label="Filtrar projetos">${['Todos',...filters].map(f=>`<button data-org-filter="${esc(f)}" aria-pressed="${orgFilter===f}">${esc(f)}</button>`).join('')}</div>`:''}<div class="org-projects">${projects.length?projects.map(p=>`<article><span class="status-badge" data-status="${esc(p.status)}">${esc(p.status)}</span><h3>${esc(editorialTitle(p.title))}</h3>${p.description?`<p>${esc(p.description)}</p>`:''}${p.image?`<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`:''}</article>`).join(''):'<div class="empty-state"><h3>Novidades em breve</h3><p>As atividades desta equipe serão divulgadas aqui.</p></div>'}</div>${c.links.length?`<div class="info-list">${c.links.map(l=>`<a href="${esc(l.url)}" target="_blank" rel="noopener"><span><strong>${esc(l.label)}</strong></span>${ic('ext')}</a>`).join('')}</div>`:''}`;
 modal(esc(orgTitle(c)),`${tabs}${content}<p class="notice">Informações dos projetos de comissões e diretorias regionais da ANOREG/PE.</p>`,c.kind==='regional'?'DIRETORIAS REGIONAIS':'COMISSÕES TEMÁTICAS');
}
$$('[data-org-kind]').forEach(b=>b.addEventListener('click',()=>{organizationKind=b.dataset.orgKind;orgExpanded=false;$$('[data-org-kind]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});renderOrganization()}));
$('#org-search').addEventListener('input',e=>{orgQuery=e.target.value;renderOrganization()});
$('#org-more').onclick=()=>{orgExpanded=!orgExpanded;renderOrganization();if(!orgExpanded)$('#comissoes').scrollIntoView()};
$('#org-cards').onclick=e=>{const b=e.target.closest('[data-org-open]');if(b)openOrganization(b.dataset.orgOpen)};
document.addEventListener('click',e=>{const view=e.target.closest('[data-org-view]'),filter=e.target.closest('[data-org-filter]');if(view){orgView=view.dataset.orgView;renderOrgDialog();$('#modal').querySelector(`[data-org-view="${orgView}"]`).focus()}if(filter){orgFilter=filter.dataset.orgFilter;renderOrgDialog();$('#modal').querySelector(`[data-org-filter="${orgFilter}"]`)?.focus()}});
renderOrganization();
