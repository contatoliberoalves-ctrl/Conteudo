# Como instalar a skill novelinha

**Português** · [Español](COMO-INSTALAR.es.md) · [English](COMO-INSTALAR.en.md)

A skill gera tudo na sua conta da **Avatrix** e roda em dois lugares: no **site do Claude** (claude.ai, ou o aplicativo do Claude no modo conversa), só clicando, ou no **Claude Code** (o Claude no computador, que roda comandos). Usa o site? Siga só a parte "No site do Claude" e pule o resto. Nada de terminal.

## O jeito mais fácil: cole esta mensagem no Claude
Serve no Claude Code e no site ou no app do Claude. Abra o Claude (no Claude Code, na pasta onde você quer trabalhar) e cole:

```text
Instala pra mim a skill novelinha da Avatrix. O passo a passo está em https://raw.githubusercontent.com/avatrix-io/skills/main/INSTALL.md: lê e segue. No Claude Code, faz tudo sozinho. No site ou no app do Claude, me guia nos cliques, um por vez: baixar https://github.com/avatrix-io/skills/releases/latest/download/novelinha.zip, subir em Configurações > Plugins e ligar o conector da Avatrix com o endereço https://avatrix.io/mcp. No fim, me diz o que eu digito pra começar.
```

Ele baixa, instala, liga a Avatrix e para pra você entrar na sua conta (`/mcp` > avatrix). Ele não pede senha. Depois, numa sessão nova, escreva "faz uma novelinha".

No site do Claude (claude.ai), ele te guia nos mesmos cliques da parte abaixo, um de cada vez.

## No site do Claude (sem instalar nada)
1. **A skill:** no claude.ai, clique no seu nome > Configurações > Plugins > Adicionar > Fazer upload de plugin. Escolha o `novelinha.zip` que você baixou na página de versões do repositório (Releases), do jeito que veio (não precisa abrir), e clique em Fazer upload. A lista mostra "Novelinha · Skill · Por você". Na tela antiga, com Personalização no menu: Personalização > Skills > Adicionar skill > Fazer upload.
2. **A Avatrix (o conector):** ainda em Plugins, clique em Adicionar > Adicionar conector personalizado. Nome: `Avatrix`. URL do servidor MCP: `https://avatrix.io/mcp`. Clique em Continuar, entre com a sua conta da Avatrix e clique em Permitir. Tem que aparecer "Conectado". Na tela antiga: Personalização > Conectores > Adicionar conector > personalizado, com o mesmo nome e endereço.
3. **A internet pra Avatrix:** clique no seu nome > Configurações > Recursos. Ligue "Criar e editar arquivos" (as skills precisam dela; é ela que junta os pedaços da novela) e "Usar a internet ao criar arquivos". Em "Sites permitidos", clique em Gerenciar e adicione `*.avatrix.io`. Na tela antiga, com "Permitir acesso de rede externo": ligue, escolha "Só gerenciadores de pacotes" e cole `*.avatrix.io` nos domínios permitidos. Se não aparecer nem Sites permitidos nem o campo dos domínios, a sua conta do Claude ainda não tem essa opção.
4. **Conversa nova:** a internet que você liberou só vale em conversa nova. Abra uma e pergunte "quais personagens eu tenho na Avatrix?". O site pede licença pra olhar a sua conta: pode clicar em Sempre permitir, que ler não gasta nada.
5. **O ffmpeg** (que junta os clipes) já vem no site. Não instale nada.
6. **A trava do sim:** a skill só gasta crédito depois do seu "sim", um "sim" por imagem ou vídeo, e o site ainda pede licença. Pra gerar imagem ou vídeo, clique em **Permitir uma vez**, toda vez, nunca em Sempre permitir. Teste: peça "usa a skill da novelinha e gera uma imagem de teste" sem dizer sim; ela tem que dizer o preço e esperar o seu "sim".
7. **Uma conversa só:** faça a Parte 1 inteira na mesma conversa e volte nela pra Parte 2. Numa conversa nova o Claude não vê os arquivos da anterior. Se precisar abrir outra, cole a "ficha da série" que a skill mostra ao fim de cada fase e escreva "novelinha continua": ela remonta onde parou pelos personagens e gerações da sua conta da Avatrix. Apareceu aviso de limite do Claude? Espere a hora que ele mostra e escreva "continua", na mesma conversa.
8. **Usar:** escreva "faz uma novelinha" e mande o link de uma novelinha que está viralizando, ou conte a sua ideia.

## No Claude Code, na mão
Instalou pela mensagem ou pelo plugin (o comando `claude plugin install novelinha@avatrix-skills` do README)? Pule esta parte: a skill, a trava do sim e o aviso de versão nova já vêm ligados.

### 1. A pasta no lugar
1. Crie uma pasta pro projeto (ex.: `minhas-novelas`) e abra ela no Claude Code.
2. Extraia o ZIP. Mova a pasta `novelinha` pra `minhas-novelas/.claude/skills/novelinha/` (fica `.../novelinha/SKILL.md`).
3. Pasta com ponto no começo é oculta no Mac: no Finder, `Cmd + Shift + .` mostra.

### 2. Ligar a Avatrix no Claude
1. No terminal, dentro da pasta do projeto: `claude mcp add --transport http avatrix https://avatrix.io/mcp`
2. Abra o Claude Code, digite `/mcp`, escolha `avatrix` e faça login com a sua conta da Avatrix.
3. Teste: peça "quanto crédito eu tenho na Avatrix?". Tem que responder o seu saldo.

### 3. ffmpeg (junta os clipes no fim)
- Mac: `brew install ffmpeg` (sem Homebrew: brew.sh).
- Windows: `winget install ffmpeg`.
- Teste: `ffmpeg -version`.

### 4. A trava do sim (obrigatório)
A skill só gasta crédito depois de um "sim" seu, e isso é travado por máquina, não só por promessa: um "sim" libera UMA geração (um quadro ou um vídeo). Abra `minhas-novelas/.claude/settings.json` (crie se não existir) e deixe assim:
```json
{
  "hooks": {
    "UserPromptSubmit": [{"hooks": [{"type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/skills/novelinha/scripts/trava-sim.sh\""}]}],
    "PreToolUse": [{"matcher": ".*[Aa]vatrix.*generate_(image|video)", "hooks": [{"type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/skills/novelinha/scripts/trava-sim.sh\""}]}]
  }
}
```
Feche e abra o Claude Code de novo (ele só lê essa trava ao abrir). Teste: peça "gera uma imagem de teste" sem dizer sim antes; tem que aparecer "TRAVA DO SIM" e a skill tem que parar e perguntar.

### 5. Usar
- Digite: "faz uma novelinha" e mande o link de uma novelinha que está viralizando, ou conte a sua ideia.
- A skill cria os personagens na Avatrix, mostra o roteiro, gera o clipe 1 pra você ver e só segue com o seu "sim".
- Parou no meio: "novelinha continua".

## Quanto custa
A skill cota cada geração na hora, com o preço que a Avatrix devolve, e mostra o total da Parte 1 em créditos antes do 1º "sim".
- O vídeo sai no **Avatar Pro** (a cena com os personagens falando juntos) ou no **Persona Pro** (1 pessoa falando, a voz de cada um sempre igual, ou "na qualidade mais alta": 1080p). Você não precisa escolher.
- Outro modelo, só se você pedir pelo nome.
No Avatar Pro a voz sai do próprio vídeo. Trocar a voz de uma fala que saiu errada é cotado antes, por segundo.

## Quem fez
Essa skill é do João Pedro (@joaopedroiaa). Quando quiser transformar o perfil em venda, o próximo passo é o Sistema Influencer IA: https://sistema-influencer-ia.vercel.app
