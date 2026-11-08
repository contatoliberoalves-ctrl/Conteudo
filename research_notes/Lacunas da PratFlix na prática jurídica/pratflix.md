# PratFlix ("a advocacia na prática"): inventário público da oferta (nov/2026)

> Método e alcance: 15 chamadas de busca/fetch em 08/11/2026, sem login. Fontes públicas indexadas sobre a PratFlix são **praticamente inexistentes**. Nenhum buscador (consultas "PratFlix advocacia na prática", "pratflix Líbero Filho", "pratflix.com.br", "PratFlix hotmart/kiwify/cademi/memberkit", "Grupo de Aperfeiçoamento na Advocacia") retornou página sobre a plataforma. Por isso, além das fontes web, uso como **fonte interna (não pública na web, mas versionada no repositório do autor)** os moldes de divulgação da PratFlix deste repositório: `moldes/pratflix/` e `moldes/carrossel-nativo/dados.json`. Eles mostram o que o próprio autor divulga, mas não comprovam o catálogo interno. Cada item tem o nível de confiança indicado: **[confirmado-web]**, **[interno]** (material de divulgação do próprio autor no repositório) ou **[inferência]**.

## 1. O que é a PratFlix, quem ensina e desde quando

### Takeaway
A PratFlix se apresenta como "a advocacia na prática", plataforma do Líbero Filho, com tela inicial em estilo streaming ("Aprenda. Aplique. Evolua."). Não há site, página de vendas nem produto em Hotmart/Kiwify/Eduzz/Cademí/Memberkit indexado publicamente. A hospedagem, a data de lançamento e o corpo docente não puderam ser confirmados.

### Cited Findings
- O autor, Líbero Filho, é descrito no canal do YouTube como "Advogado, Mestrando em Direito pela UNICAP, Escritor e Professor de Direito Constitucional, Eleitoral e Ética no Método VDE para OAB e Concursos". O Instagram pessoal dele é @liberofilho. **[confirmado-web, via snippet de busca]** — [YouTube Líbero Filho](https://www.youtube.com/@liberofilhooab); [Jusbrasil: Líbero Alves Rodrigues Filho](https://contatoliberoalves.jusbrasil.com.br/) (o fetch direto deu 403; o handle @liberofilho apareceu no snippet)
- O título atual do canal é "Líbero Filho TV | Direito Constitucional e Ética". **[confirmado-web]** — [YouTube](https://www.youtube.com/@liberofilhooab)
- No X ele aparece como "Prof. Líbero Filho - OAB (@ProfLiberofilho)", com foco em OAB e 2ª fase de Constitucional. **[confirmado-web, snippet; o fetch deu 402]** — [X](https://x.com/ProfLiberofilho)
- Os vídeos públicos do canal tratam de OAB 2ª fase, não de prática da advocacia. Exemplos: "Tudo sobre Ação Popular para a 2ª fase da OAB" e "Principais peças da 2ª fase de Direito Constitucional (OAB 40)". **[confirmado-web]** — [vídeo 1](https://www.youtube.com/watch?v=nPBPLOXytRw); [vídeo 2](https://www.youtube.com/watch?v=xaUlLhQTcZk)
- Os domínios `pratflix.com.br`, `www.pratflix.com.br`, `pratflix.com` e `app.pratflix.com.br` não responderam em 08/11/2026: o proxy devolveu "CONNECT tunnel failed, 502", o que é compatível com domínio inexistente ou não resolvido. **[confirmado-teste próprio; não é prova de que o domínio não exista]**
- O perfil público @pratflix no Instagram é "P R A T (@pratflix)", com 53 seguidores, 170 seguindo e 10 posts. Nada indica que pertença ao Líbero. **[confirmado-web, metadados da página]** — [Instagram @pratflix](https://www.instagram.com/pratflix/)
- A tela inicial da plataforma mostra o slogan "APRENDA. APLIQUE. EVOLUA.", o nome PRATFLIX, um carrossel de destaques (indicador "01") e a foto de um corredor de escritório em tons escuros, num layout de streaming parecido com Netflix. **[interno]**: `moldes/pratflix/fotos/corredor.jpg` (o README do molde o descreve como "recorte da tela inicial da PratFlix")
- O autor descreve a PratFlix como "plataforma 'a advocacia na prática' do Líbero Filho" e a assina como "PratFlix, a advocacia na prática". **[interno]**: `moldes/pratflix/README.md`, `.claude/skills/molde-pratflix/SKILL.md`, `moldes/carrossel-nativo/dados.json` (post "areas-advocacia-pratflix")
- A divulgação é feita pelo perfil pessoal @liberofilho (campo `perfil` do molde). **[interno]**: `moldes/pratflix/molde.json`
- Nomes parecidos que podem gerar confusão: "Curso AdvogadoFlix" (Edvan Rodrigues da Silva, Hotmart, Google Ads para advogados) e "Advocacia na Prática" (marca de outro vendedor na Hotmart/Reclame Aqui; série do Estratégia OAB). Nenhum tem relação demonstrada com a PratFlix. — [Hotmart AdvogadoFlix](https://hotmart.com/pt-br/marketplace/produtos/curso-advogadoflix/W59960515M); [Hotmart "Advocacia na Prática"](https://hotmart.com/pt-br/marketplace/especialista/advocacia-na-pratica/IQENQPU9BM); [Reclame Aqui "Advocacia Na Prática"](https://www.reclameaqui.com.br/empresa/advocacia-na-pratica/); [Estratégia OAB](https://oab.estrategia.com/portal/advocacia-na-pratica-associe-teoria-pratica/)

### Inferências
- A plataforma provavelmente fica numa área de membros white-label (Cademí, Memberkit, Curseduca etc.) num subdomínio que não foi indexado. O visual "flix" de streaming é comum nessas ferramentas. **[inferência, sem prova]**
- Como nada está indexado, é provável que a PratFlix seja nova ou que a venda e o acesso passem por links privados (direct do Instagram via "Comenta #PRATFLIX", grupo de WhatsApp), não por SEO. **[inferência]**
- Não há indício público de professores além do Líbero. **[inferência]**

### Gaps
- URL da plataforma, ferramenta de hospedagem, data de lançamento, CNPJ e corpo docente: nada encontrado.
- A Reclame Aqui não tem página "PratFlix" nos resultados. Não confirmei por busca direta no site, que tem proteção anti-bot.

## 2. Áreas do Direito, títulos de cursos/trilhas e temas práticos

### Takeaway
Nenhum catálogo público foi encontrado. Os materiais de divulgação mostram só os temas usados como isca e conteúdo: escolha da área de atuação, carteirinha da OAB, erros de jovens advogados, IA na gestão do escritório e prompts de foto profissional. Não há lista pública de cursos por área (cível, família, trabalhista etc.).

### Cited Findings
- Carrossel com CTA para a PratFlix: "7 dúvidas para decidir em que área atuar na advocacia" (contencioso x consultivo, pessoa física x empresa, demanda local, ritmo, formas de honorário, escolher só uma área, afinidade). O CTA diz "Quer ver como é o dia a dia de cada área na prática? Comenta #PRATFLIX que eu te mando o link". **[interno]**: `moldes/carrossel-nativo/dados.json`
- Material gratuito "Documentos e passo a passo pra solicitar a carteirinha da OAB" (PDF com 9 itens, "Comente #CARTEIRA"), com bônus de live gratuita no domingo 08/11 às 20h: "Os 3 erros que os jovens advogados mais cometem e como fugir deles". **[interno]**: `moldes/pratflix/dados.json` (post "material-carteirinha-oab")
- Carrossel "IA na advocacia: monte o dashboard do seu escritório com IA" (prazos, processos, clientes e honorários num painel, com prompts prontos). **[interno]**: `moldes/pratflix/dados.json` (post "dashboard-escritorio-ia")
- PDF "Prompts de foto profissional para advogadas e advogados": 7 prompts de IA, "Foto profissional de advogado de graça". **[interno]**: `moldes/pratflix/pdf.json`

### Inferências
- O CTA "ver como é o dia a dia de cada área na prática" sugere conteúdo organizado por área de atuação, mas quais áreas existem não pode ser verificado. **[inferência]**
- O público-alvo aparente é o recém-aprovado ou jovem advogado (primeiros passos, carteirinha, escolha de área), com uma camada de produtividade/IA e gestão de escritório. **[inferência a partir dos temas]**

### Gaps
- Títulos de cursos, trilhas, carga horária e áreas (cível, família, trabalhista, previdenciário, penal, tributário, consumidor): não verificáveis, porque ficam atrás de login ou não estão publicados.
- Petições/modelos, audiências, prospecção/marketing jurídico: não há menção pública nem interna como módulo. Só aparecem temas de IA, gestão e carreira.

## 3. Formatos (vídeo, modelos, PDFs, lives, comunidade, mentoria, certificado, app)

### Takeaway
Confirmados só pela divulgação interna: grupos gratuitos de WhatsApp ("Grupo de Aperfeiçoamento na Advocacia", com hashtag #pratflix, e "Grupo Dicas da Advocacia", com #ADV), materiais gratuitos em PDF, carrosséis com prompts e lives gratuitas. Videoaulas são prováveis pelo formato "flix", mas não foram comprovadas. Não há evidência de certificado, app, mentoria, correção de peças ou eventos presenciais.

### Cited Findings
- "Grupo de Aperfeiçoamento na Advocacia": grupo gratuito/comunidade, "Conteúdo prático, dicas e materiais para quem quer crescer na advocacia", selo "ACESSO GRATUITO", benefícios "Dicas · Materiais · No seu ritmo", com entrada via "Comente #pratflix pra receber o link do grupo". **[interno]**: `moldes/pratflix/dados.json` (post "grupo-pratflix"); `moldes/pratflix/README.md`
- "Grupo de Dicas da Advocacia": grupo gratuito no WhatsApp, "Dicas práticas, materiais e o dia a dia de quem vive a advocacia de verdade", entrada via link nos stories ou "Comenta #ADV". Há também símbolo para a foto do grupo de WhatsApp. **[interno]**: `moldes/pratflix/dados.json`
- Live gratuita anunciada (domingo 08/11, 20h). O molde tem um layout "evento" para convites de live. **[interno]**: `moldes/pratflix/dados.json`, `moldes/pratflix/README.md`
- Materiais em PDF A4 na identidade PratFlix (formato "copie e cole" com prompts). **[interno]**: `moldes/pratflix/README.md`, `pdf.json`

### Inferências
- O funil aparente é: post/carrossel → "Comenta #X" → direct com link → grupo gratuito de WhatsApp / material → oferta da plataforma. **[inferência]**
- "No seu ritmo" sugere aulas gravadas sob demanda. **[inferência]**

### Gaps
- Videoaulas, banco de petições/modelos, certificado, app próprio, mentoria, correção, eventos presenciais: nada público. Mesmo que existam, estão atrás de login.
- Não encontrei o número de membros dos grupos de WhatsApp.

## 4. Preço, planos, garantia, gratuidade, alunos, depoimentos

### Takeaway
Não há nenhuma informação pública de preço, plano, garantia, número de alunos ou depoimentos. O único "gratuito" confirmado (internamente) é o acesso aos grupos e materiais de isca.

### Cited Findings
- O selo padrão do layout "original" é "ACESSO GRATUITO", usado para os grupos. **[interno]**: `moldes/pratflix/README.md`
- A instrução interna do molde diz "Não invente benefícios nem números da plataforma". Ou seja, nem o próprio material de divulgação traz métricas declaradas. **[interno]**: `.claude/skills/molde-pratflix/SKILL.md`
- Nenhuma página de vendas, checkout ou produto foi encontrada em Hotmart, Kiwify, Eduzz, Cademí ou Memberkit. **[confirmado-busca negativa]** — [busca Hotmart/Kiwify/Cademí/Memberkit sem resultados para "PratFlix"](https://hotmart.com/pt-br/marketplace/produtos/curso-advogadoflix/W59960515M) (só o homônimo AdvogadoFlix apareceu)

### Inferências
- Se "acesso gratuito" se refere à própria plataforma (e não só ao grupo), a PratFlix pode funcionar como tier gratuito/isca de outro produto pago. Não dá para distinguir com o que é público. **[inferência fraca]**

### Gaps
- Preço, mensal/anual, garantia de 7 dias, número de alunos, depoimentos e avaliações na Reclame Aqui: tudo desconhecido.

## 5. Marcas relacionadas do mesmo autor (sobreposição)

### Takeaway
O Líbero opera várias marcas educacionais, quase todas voltadas a OAB/concursos, não à prática da advocacia. A PratFlix é a única voltada ao advogado já inscrito.

### Cited Findings
- Método VDE: ele é professor de Constitucional, Eleitoral e Ética "no Método VDE para OAB e Concursos" (mentoria com Natália Valença). **[confirmado-web, snippet]** — [YouTube](https://www.youtube.com/@liberofilhooab)
- Outras marcas na divulgação do autor: @constitucionalgabaritado (OAB 2ª fase Constitucional), @eticagabaritadanaoba (Ética OAB), Concurso com Líbero (@concursocomlibero, concursos), Argumenta com Líbero (provas discursivas), Cartório com Líbero (ENAC/concursos de cartório), PodConst (podcast com Natália Valença). Ele também é titular do Cartório de Registro Civil de Curral Queimado (Petrolina/PE). **[interno]**: `/home/user/Conteudo/CLAUDE.md` e skills dos moldes

### Inferências
- A sobreposição com a PratFlix vem do mesmo funil de público (aprovados na OAB que viram advogados) e do perfil @liberofilho como canal comum. **[inferência]**

### Gaps
- Não verifiquei se essas marcas citam a PratFlix publicamente (Instagram exige login).

---
**Limitações gerais:** Instagram @liberofilho e a hashtag #pratflix redirecionam para login (não acessados). O X deu 402, o Jusbrasil 403 e o YouTube carrega sem descrição nem lista de vídeos via fetch. TikTok e Threads não foram consultados por limite de chamadas. Para completar o inventário, o caminho é pedir ao autor o link da plataforma ou da página de vendas, ou prints do catálogo.
