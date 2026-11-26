# Como instalar a skill fábrica de reels

A skill gera tudo na sua conta da **Avatrix** (imagem, voz e vídeo) e roda em dois lugares: no **site do Claude** (claude.ai, ou o aplicativo do Claude no modo conversa), só clicando, ou no **Claude Code** (o Claude no computador, que roda comandos). Usa o site? Siga só a parte "No site do Claude" e pule o resto. Nada de terminal.

## O jeito mais fácil: cole esta mensagem no Claude
Serve no Claude Code e no site ou no app do Claude. Abra o Claude (no Claude Code, na pasta onde você quer trabalhar) e cole:

```text
Instala pra mim a skill fabrica-de-reels da Avatrix. O passo a passo está em https://raw.githubusercontent.com/avatrix-io/skills/main/INSTALL.md: lê e segue. No Claude Code, faz tudo sozinho. No site ou no app do Claude, me guia nos cliques, um por vez: baixar https://github.com/avatrix-io/skills/releases/latest/download/fabrica-de-reels.zip, subir em Configurações > Plugins e ligar o conector da Avatrix com o endereço https://avatrix.io/mcp. No fim, me diz o que eu digito pra começar.
```

No Claude Code, ele baixa, instala, liga a Avatrix e para pra você entrar na sua conta (`/mcp` > avatrix). Ele não pede senha. Depois, numa sessão nova, escreva "cria meu personagem".

No site do Claude (claude.ai), ele te guia nos mesmos cliques da parte abaixo, um de cada vez.

## No site do Claude (sem instalar nada)
1. **A skill:** no claude.ai, clique no seu nome > Configurações > Plugins > Adicionar > Fazer upload de plugin. Escolha o `fabrica-de-reels.zip` (baixe em https://github.com/avatrix-io/skills/releases/latest/download/fabrica-de-reels.zip), do jeito que veio (não precisa abrir), e clique em Fazer upload. A lista mostra "Fabrica de reels · Skill · Por você". Na tela antiga, com Personalização no menu: Personalização > Skills > Adicionar skill > Fazer upload.
2. **A Avatrix (o conector):** ainda em Plugins, clique em Adicionar > Adicionar conector personalizado. Nome: `Avatrix`. URL do servidor MCP: `https://avatrix.io/mcp`. Clique em Continuar, entre com a sua conta da Avatrix e clique em Permitir. Tem que aparecer "Conectado". Na tela antiga: Personalização > Conectores > Adicionar conector > personalizado, com o mesmo nome e endereço.
3. **A internet pra Avatrix:** clique no seu nome > Configurações > Recursos. Ligue "Criar e editar arquivos" (as skills precisam dela; é ela que junta as cenas e escreve a legenda no vídeo) e "Usar a internet ao criar arquivos". Em "Sites permitidos", clique em Gerenciar e adicione `*.avatrix.io`. Na tela antiga, com "Permitir acesso de rede externo": ligue, escolha "Só gerenciadores de pacotes" e cole `*.avatrix.io` nos domínios permitidos. Se não aparecer nem Sites permitidos nem o campo dos domínios, a sua conta do Claude ainda não tem essa opção.
4. **Conversa nova:** a internet que você liberou só vale em conversa nova. Abra uma e escreva "cria meu personagem". A prova de que a skill está ligada é a primeira frase dela: "fábrica de reels v" + o número da versão (a tela de Skills do site mostra outro número; vale o da frase). Se ela responder sem essa frase, a skill não subiu: refaça o passo 1. O site pede licença pra olhar a sua conta: pode clicar em Sempre permitir, que ler não gasta nada; o mesmo vale pra esperar o que está gerando e pras ferramentas que não gastam (juntar as falas, subir arquivo, confirmar upload, tirar quadro de vídeo). Agendar post e ligar a DM: Permitir uma vez, porque publicam de verdade.
5. **O ffmpeg** (que monta o reel) já vem no site. Não instale nada.
6. **A trava do sim:** a skill mostra o preço antes e só gasta depois do seu "sim", e o site ainda pede licença. Pra gerar imagem, voz ou vídeo e pra trocar a voz, clique em **Permitir uma vez**, nunca em Sempre permitir. Quando ela gera várias de uma vez (o lote), um "Permitir uma vez" vale pelo lote inteiro; mesmo assim, um reel pede alguns cliques enquanto ela gera. Teste: peça "usa a fábrica de reels e gera uma imagem de teste" sem dizer sim; ela tem que dizer o preço e esperar.
7. **Um reel por conversa:** faça cada reel inteiro, do viral ao agendamento, na mesma conversa. Numa conversa nova o Claude não vê os arquivos da anterior. Se precisar abrir outra, cole a "ficha do reel" que a skill mostra ao fim de cada passo e escreva "fabrica continua". Apareceu aviso de limite do Claude? Espere a hora que ele mostra e escreva "continua", na mesma conversa.
8. **Arrastar arquivo (só no site):** subir o reel pra postar pede 1 arraste seu: a skill te entrega o reel na conversa e você arrasta ele pro cartão de upload da Avatrix. Fora ele: a sua foto, se ela for o rosto do personagem (1 arraste), e a troca de voz: 1 por cena quando o personagem não tem voz no idioma dele, e 1 no reel quando a voz dele é fixada por troca no fim; cena ou montagem refeita depois da troca pede mais 1. Fora isso, você não mexe em arquivo.
9. **A DM no site:** o site não roda nada sozinho. Depois do horário do post, volte na mesma conversa e escreva "fabrica dm": é aí que a DM automática liga. Quer que ela ligue sozinha? Use o Claude Code (abaixo).
10. **Usar:** siga na conversa do passo 4, que já começou o personagem ("cria meu personagem"): mande o link de reels de um perfil que você quer modelar, ou a sua ideia. Depois: "clona esse reel pro meu personagem" e o link do viral.

## No Claude Code, na mão
Instalou pela mensagem ou pelo plugin (o comando `claude plugin install fabrica-de-reels@avatrix-skills` do README)? Pule esta parte: a skill, a trava do sim e o aviso de versão nova já vêm ligados. Só o bloco `permissions` do passo 4 (a confirmação na tela antes de repostar, mandar DM à mão e responder comentário) o plugin não traz: pela mensagem, o Claude já junta ele; pelo comando, junte você ao `.claude/settings.json` da pasta do projeto, sem apagar o que já está lá.

### 1. A pasta no lugar
1. Crie uma pasta pro projeto (ex.: `meus-reels`) e abra ela no Claude Code.
2. Baixe o ZIP (https://github.com/avatrix-io/skills/releases/latest/download/fabrica-de-reels.zip) e extraia. Ele traz a pasta `fabrica-de-reels`: mova ela pra `meus-reels/.claude/skills/` (fica `meus-reels/.claude/skills/fabrica-de-reels/SKILL.md`).
3. Pasta com ponto no começo é oculta no Mac: no Finder, `Cmd + Shift + .` mostra.

### 2. Ligar a Avatrix no Claude
1. No terminal, dentro da pasta do projeto: `claude mcp add --transport http avatrix "https://avatrix.io/mcp"`
2. Abra o Claude Code, digite `/mcp`, escolha `avatrix` e faça login com a sua conta da Avatrix.
3. Teste: peça "quanto crédito eu tenho na Avatrix?". Tem que responder o seu saldo.

### 3. ffmpeg (monta o reel)
- Mac: `brew install ffmpeg` (sem Homebrew: brew.sh).
- Windows: `winget install ffmpeg`.
- Teste: `ffmpeg -version`.
- Os scripts da skill pedem o Python 3: teste `python3 --version`. Sem ele: Mac, `xcode-select --install` (ou python.org); Windows, `winget install Python.Python.3.12`. No Windows, a trava roda no Git Bash (git-scm.com).

### 4. A trava do sim e a confirmação de postagem (obrigatório)
A skill só gasta crédito depois de um "sim" seu, e isso é travado por máquina, não só por promessa. A sua mensagem precisa COMEÇAR com "sim" (ou "pode gerar", "pode gastar"): isso abre 2 horas pra ela gerar o que você aprovou. "sim, até 600 por dia" abre até o fim do dia. Um "sim" depois, no mesmo dia, não encurta essa janela. "Pode ser", "ok" e perguntas (mensagem com "?", mesmo começando com "sim") não liberam gasto. Repostar, mandar DM à mão e responder comentário pedem a sua confirmação na tela antes de sair; agendar post a skill confirma com você na conversa nos 3 primeiros posts de cada perfil. Abra `meus-reels/.claude/settings.json` (crie se não existir) e deixe assim:
```json
{
  "hooks": {
    "UserPromptSubmit": [{"hooks": [{"type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/skills/fabrica-de-reels/scripts/trava-sim.sh\""}]}],
    "PreToolUse": [{"matcher": ".*[Aa]vatrix.*(generate_(image|video|voice|influencer|batch)|change_voice|download_social|send_message|confirm_card|edit_image|enhance_image|transfer_motion|cut_video)", "hooks": [{"type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/skills/fabrica-de-reels/scripts/trava-sim.sh\""}]}]
  },
  "permissions": {
    "ask": ["mcp__avatrix__republish_post", "mcp__avatrix__send_dm", "mcp__avatrix__reply_comment"]
  }
}
```
Feche e abra o Claude Code de novo (ele só lê isso ao abrir). **Teste obrigatório:** peça "gera uma imagem de teste" sem dizer sim antes. Tem que aparecer "TRAVA DO OK" e a skill tem que parar e perguntar. Se não aparecer, a trava não está ligada: não gere nada até aparecer (confira o caminho da pasta do passo 1 e o arquivo acima).

### 5. Usar
- "cria meu personagem" (com o link de reels do perfil que você quer modelar, ou a ideia).
- "clona esse reel pro meu personagem" + o link do viral.
- Parou no meio: "fabrica continua".
- DM sozinha no horário do post: deixe a sessão aberta e digite `/loop 15m fabrica dm`. Esse comando só liga as DMs dos posts que já saíram; não gera nada. Sem ele, a DM liga quando você voltar e escrever "fabrica dm".

## Quanto custa (estimativa; a skill mostra o preço certo antes de cada gasto)
- **Criar o personagem** (uma vez): ~50 créditos (3 rostos, amostras de voz e a prova); com uma foto sua como rosto, ~10.
- **Ler o viral:** ~5 créditos (baixar o vídeo e a leitura no Chat IA, que sai do saldo comum e prende até 15 na hora, devolvendo o que sobrar).
- **Um reel de ~30 segundos:** ~75 créditos (fala, imagens e vídeo). De ~1 minuto: de ~130 a ~200. Leva alguns minutos.
- **Postar, ligar a DM e medir** pelo Piloto Automático: não gasta crédito. O Piloto precisa de um lugar na conta (o plano Ultimate vem com um; nos outros compra à parte). Sem Piloto, a skill entrega o reel e a legenda pra você postar à mão.
- O bônus da conta não paga geração; conte sempre com o saldo comum (é o que a skill mostra).

## Quem fez
Essa skill é do João Pedro (@joaopedroiaa). Quando quiser transformar o perfil em venda, o próximo passo é o Sistema Influencer IA: https://sistema-influencer-ia.vercel.app
