# Kit Carrosséis: Estrutura de Peças (@constitucionalgabaritado)

Gerador automático de carrosséis para Instagram (3 slides de 1080×1350). O visual fica fixo no modelo; o conteúdo vem de `dados.json`. Cada carrossel sai como 3 PNGs prontos para postar.

## Como usar (1ª vez)
1. Instale o [Node.js](https://nodejs.org) (versão 18 ou mais nova).
2. Abra esta pasta no terminal e rode: `npm run setup`
3. Gere tudo: `npm run gerar`
4. As imagens saem em `saida/<id>/1.png`, `2.png` e `3.png` (mais `painel.png` com a visão panorâmica).

Para gerar só um: `node render.mjs habeas-data`

## Criar um carrossel novo
1. Coloque a foto em `fotos/` (vertical, rosto na parte de cima, com pelo menos 1020 px de largura).
2. Adicione um bloco em `dados.json`:

```json
{
  "id": "mandado-de-seguranca",
  "titulo": ["Mandado de", "Segurança"],
  "foto": "mandado-seguranca.jpg",
  "tema": "escuro",
  "enderecamento": "Texto do endereçamento",
  "qualificacao": "Qualificação e identificação da peça",
  "topicos": ["Dos Fatos", "Do Cabimento (observação opcional)", "Dos Pedidos"],
  "valor": "Valor da Causa"
}
```

### Campos
- `id`: nome da pasta de saída (sem espaços ou acentos).
- `titulo`: uma linha por item. Títulos longos devem ser quebrados em 2 linhas. O tamanho da fonte se ajusta sozinho.
- `tema`: `"escuro"` (slide 2 verde, slide 3 claro) ou `"claro"` (invertido).
- `topicos`: o texto entre parênteses no fim de um tópico vira uma observação menor abaixo dele. Com 7 ou mais tópicos, o espaçamento fica mais compacto sozinho.
- Opcionais: `kicker` (padrão "Estrutura de Peças"), `ctaTitulo`, `ctaSub`, `fotoAltura` (em px; use quando a foto for mais baixa que 1000 px).

## Usando com o Claude Code
Abra a pasta no Claude Code e peça, por exemplo:
> "Adicione ao dados.json os carrosséis abaixo e rode npm run gerar: [cole os dados]"

Ele só preenche o JSON e roda o script, sem mexer no visual, por isso gasta poucos créditos. Para mudar o design, edite `template.mjs` (todo o layout está nele).

## Tokens do design
- Verde escuro: `#3A4A44` · Verde-limão (destaque): `#8DC63F` · Fundo da capa: `#141412` · Off-white: `#F4F3EE`
- Fontes: Bebas Neue (títulos) + Poppins 300/500/600/700 (textos), via Google Fonts. É preciso estar conectado à internet ao gerar.
- Tamanho: painel de 3240×1350 cortado em 3 slides de 1080. O card do slide 2 começa em x=1020 e termina em x=2220, atravessando as divisas (efeito panorâmico ao arrastar).

## Arquivos
- `template.mjs`: modelo visual
- `render.mjs`: gera os PNGs (Playwright)
- `dados.json`: conteúdo dos carrosséis
- `fotos/`: fotos das capas
- `assets/logo.png`: selo Constitucional Gabaritado

Obs.: as fotos e o logo incluídos foram recortados das artes originais. Troque pelos arquivos em alta resolução para ter mais nitidez.
