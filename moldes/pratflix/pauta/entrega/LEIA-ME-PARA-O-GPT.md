# Pauta · estúdio de conteúdo jurídico (PratFlix) — instruções para colocar online com banco de dados

## O que está no pacote
- `pauta.html` — o app inteiro em um arquivo (HTML + CSS + JS). Abre direto no navegador.
- `src/` — o mesmo app em arquivos separados (é aqui que se edita):
  - `index.html` (casca), `style.css` (visual), `areas.js` (16 áreas × 10 temas), `conteudo.js` (formatos, cronograma de 26 semanas, ganchos, guias, regras de ética), `app.js` (lógica e telas).
  - `montar.py` junta tudo em `pauta.html`.
- `schema.sql` — proposta de tabelas no Supabase (Postgres) com RLS.

## Como o app guarda dados hoje
Tudo fica no `localStorage`, numa chave só: `pauta.v2`. O formato é:

```json
{ "v": 2, "atual": "<id da conta aberta>", "tema": "auto|light|dark",
  "contas": [{
    "id": "...", "cor": "#1D5BF0",
    "perfil": { "nome","marca","arroba","cidade","tempo","areas":[],"principal","publico":[],"objetivo","redes":[],"freq":3,"dias":[],"video","tom","inicio":"AAAA-MM-DD" },
    "posts": [{ "id","data","semana","formato","pilar","area","ideia","titulo","status","roteiro","legenda","notas","check":[],"versoes":[{"data","roteiro"}],"num":{"alcance","curtidas","salvos","compart"} }],
    "tarefas": { "semana.indice": true },
    "favoritas": ["ideia-id"],
    "metricas": [{ "data","seguidores","alcance","salvos","compart","visitas","mensagens" }],
    "identidade": { "paleta","fonte" },
    "missoes": { "AAAA-MM-DD": ["peca","stories"] },
    "flags": { "identidade":true, "bio":true, "etica":true },
    "nivelVisto": 3, "conqVistas": ["plano","pub1"]
  }]
}
```

Só duas funções em `src/app.js` tocam no armazenamento:
- `carregar()` (linha ~44): lê o estado.
- `salvar()` (linha ~50): grava o estado inteiro. É chamada depois de cada ação.

## Caminho mais simples para pôr online (recomendado para começar)
1. Hospedar `pauta.html` (Vercel, Netlify, Hostinger, ou dentro da PratFlix em `/pratflix/pauta/`).
2. Login com Supabase Auth (o mesmo projeto da PratFlix, se quiser usar a mesma conta do aluno).
3. Criar a tabela `pauta_estado` do `schema.sql` (um JSON por usuário) e trocar:
   - `carregar()` → buscar `estado` do usuário logado (`select estado from pauta_estado where user_id = auth.uid()`); se não houver, começar vazio.
   - `salvar()` → `upsert` do JSON (com um pequeno atraso/debounce de ~800 ms para não gravar a cada tecla), mantendo o `localStorage` como cópia local/offline.
   Como `carregar()` hoje é síncrona e o Supabase é assíncrono, o início do app (`render()` no fim de `app.js`) deve esperar o carregamento: `S = await carregarRemoto(); C = ...; render();`.

## Caminho completo (tabelas normalizadas)
Para relatórios, painel do administrador e integração com o Instagram, usar as tabelas `pauta_contas`, `pauta_posts`, `pauta_metricas` do `schema.sql`. Cada objeto do JSON acima vira uma linha; os campos menores (tarefas, missões, flags, identidade) ficam em colunas `jsonb` da conta.

## Integrações previstas (opcionais)
- **Instagram Graph API** (conta profissional): preencher `pauta_metricas` e `posts.num` automaticamente (insights de mídia: reach, saved, shares, likes). Exige app na Meta e uma função no servidor (Supabase Edge Function) com o token do usuário.
- **Leitura semanal com IA**: hoje a tela Insights usa regras (`leitura()` em `app.js`). Pode chamar uma Edge Function que envia os números da conta para um modelo de linguagem e devolve título, texto e as três listas no mesmo formato.
- **Agendamento**: o botão “Programar no cronograma” só muda o status; publicação automática exige a API de publicação de conteúdo do Instagram.

## Regras para não quebrar
- Manter os `data-*` dos botões: toda a interação usa delegação de eventos em `document`.
- Downloads (.json e .ics) funcionam no site; só não funcionam dentro de visualizadores que bloqueiam download.
- O app precisa das fontes do Google Fonts (link no `index.html`).
- Conteúdo jurídico (temas, mitos, roteiros, regras de ética) deve ser revisado pelo responsável.
