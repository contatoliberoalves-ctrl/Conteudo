# How to install the novelinha skill

[Português](COMO-INSTALAR.md) · [Español](COMO-INSTALAR.es.md) · **English**

The skill makes everything in your **Avatrix** account and runs in two places: on the **Claude website** (claude.ai, or the Claude app in chat mode), just clicking, or in **Claude Code** (Claude on your computer, which runs commands). Using the website? Follow only the "On the Claude website" part and skip the rest. No terminal.

Button names are the ones in Claude's help center (November 2026). If your screen shows a different name, use the one you see.

## The easiest way: paste this message into Claude
It works in Claude Code and on the Claude website or app. Open Claude (in Claude Code, in the folder where you want to work) and paste:

```text
Install the Avatrix novelinha skill for me. The steps are at https://raw.githubusercontent.com/avatrix-io/skills/main/INSTALL.md: read and follow them. In Claude Code, do everything yourself. On the Claude website or app, walk me through the clicks one at a time: download https://github.com/avatrix-io/skills/releases/latest/download/novelinha.zip, upload it in Settings > Plugins (or Customize > Skills on the old screen) and add the Avatrix connector with the URL https://avatrix.io/mcp. When you finish, tell me what to type to start.
```

It downloads, installs, connects Avatrix and stops so you can sign in to your account (`/mcp` > avatrix). It never asks for your password. Then, in a new session, type "make a novelinha".

On the Claude website (claude.ai), it walks you through the same clicks as the section below, one at a time.

## On the Claude website (nothing to install)
1. **The skill:** on claude.ai, click your name > Settings > Plugins > Add and pick the option to upload a plugin (on the old screen: Customize > Skills, click **+** > Create skill > Upload a skill). Pick the `novelinha.zip` you downloaded from the repository's Releases page, as it came (no need to unzip it), and confirm. The "novelinha" skill shows up turned on.
2. **Avatrix (the connector):** still in Plugins, click Add > Add custom connector (on the old screen: Customize > Connectors > **+ Add** > Add custom connector). Name: `Avatrix`. URL: `https://avatrix.io/mcp`. Click Continue until you reach Add, sign in with your Avatrix account and click Allow. It has to show "Connected".
3. **Network access for Avatrix:** go to Settings > Capabilities. Make sure "Code execution and file creation" (or "Create and edit files") is on: it's what joins the pieces of the drama. Turn on the option to use the internet when creating files and, under Allowed sites > Manage, add `*.avatrix.io` (on the old screen: turn on "Allow network egress" and paste `*.avatrix.io` in the allowed domains). If the domains field doesn't show up, your Claude account doesn't have that option yet.
4. **New chat:** the network access you turned on only works in a new chat. Open one and ask "what characters do I have on Avatrix?". The site asks permission to look at your account: you can click Always allow, since reading doesn't spend anything.
5. **ffmpeg** (which joins the clips) already comes with the website. Don't install anything.
6. **The "yes" lock:** the skill only spends credits after your "yes", one "yes" per image or video, and the site also asks permission. To generate an image or video, click **Allow once**, every time, never Always allow. Test: ask "use the novelinha skill and generate a test image" without saying yes; it has to tell you the price and wait for your "yes".
7. **One chat only:** make the whole Part 1 in the same chat and come back to it for Part 2. In a new chat Claude can't see the files from the previous one. If you have to open another, paste the "series sheet" the skill shows at the end of each stage and type "novelinha continue": the skill picks up where it stopped using the characters and generations in your Avatrix account. Got a Claude usage limit message? Wait until the time it shows and type "continue", in the same chat.
8. **Use it:** type "make a novelinha" and send the link to a micro drama that's going viral, or tell it your idea. The skill answers in English and the drama comes out in English.

## In Claude Code
Installed with the message or the plugin (the `claude plugin` commands in the README)? Skip this part: the skill, the "yes" lock and the new-version notice are already on.

### 1. The folder in place
1. Create a folder for the project (e.g. `my-dramas`) and open it in Claude Code.
2. Unzip the ZIP. Move the `novelinha` folder to `my-dramas/.claude/skills/novelinha/` (it ends up as `.../novelinha/SKILL.md`).
3. Folders starting with a dot are hidden on Mac: in Finder, `Cmd + Shift + .` shows them.

### 2. Connect Avatrix to Claude
1. In the terminal, inside the project folder: `claude mcp add --transport http avatrix https://avatrix.io/mcp`
2. Open Claude Code, type `/mcp`, choose `avatrix` and sign in with your Avatrix account.
3. Test: ask "how many credits do I have on Avatrix?". It has to answer with your balance.

### 3. ffmpeg (joins the clips at the end)
- Mac: `brew install ffmpeg` (no Homebrew: brew.sh).
- Windows: `winget install ffmpeg`.
- Test: `ffmpeg -version`.

### 4. The "yes" lock (required)
The skill only spends credits after your "yes", and that's locked by the machine, not just a promise: one "yes" (or "sí", or "sim") unlocks ONE generation (one frame or one video). "Nice" or "ok" don't unlock. Open `my-dramas/.claude/settings.json` (create it if it doesn't exist) and make it look like this:
```json
{
  "hooks": {
    "UserPromptSubmit": [{"hooks": [{"type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/skills/novelinha/scripts/trava-sim.sh\""}]}],
    "PreToolUse": [{"matcher": ".*[Aa]vatrix.*generate_(image|video)", "hooks": [{"type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/skills/novelinha/scripts/trava-sim.sh\""}]}]
  }
}
```
Close and reopen Claude Code (it only reads the lock when it opens). Test: ask "generate a test image" without saying yes first; "TRAVA DO SIM" has to show up and the skill has to stop and ask.

### 5. Use it
- Type: "make a novelinha" and send the link to a micro drama that's going viral, or tell it your idea.
- The skill creates the characters on Avatrix, shows the script, generates clip 1 for you to watch and only goes on with your "yes".
- Stopped halfway: "novelinha continue".

## Language
The skill answers in the language you write in, and the drama comes out in that language: dialogue, voices, the characters' country (American, unless you say otherwise), hashtags and title. Another country or another language for the drama? Say it at the start ("make it British", "the drama in Spanish"). The language stays the same for the whole series.

## How much it costs
The skill quotes every generation on the spot, with the price Avatrix returns, and shows the total for Part 1 in credits before the first "yes".
- The video comes out on **Avatar Pro** (the scene with the characters talking together) or on **Persona Pro** (each character's voice always the same, or "the highest quality": 1080p). You don't have to choose.
- Another model only if you ask for it by name.
On Avatar Pro the voice comes from the video itself. Changing the voice of a line that came out wrong is quoted first, per second.

## Who made it
Avatrix: [avatrix.io](https://avatrix.io).
