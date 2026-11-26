# Cómo instalar la skill novelinha

[Português](COMO-INSTALAR.md) · **Español** · [English](COMO-INSTALAR.en.md)

La skill genera todo en tu cuenta de **Avatrix** y funciona en dos lugares: en el **sitio de Claude** (claude.ai, o la app de Claude en modo conversación), solo con clics, o en **Claude Code** (Claude en la computadora, que ejecuta comandos). ¿Usas el sitio? Sigue solo la parte "En el sitio de Claude" y salta el resto. Nada de terminal.

Los nombres de los botones son los de la ayuda de Claude en español (noviembre de 2026). Si en tu pantalla aparecen con otro nombre, usa el que ves.

## Lo más fácil: pega este mensaje en Claude
Sirve en Claude Code y en el sitio o la app de Claude. Abre Claude (en Claude Code, en la carpeta donde quieres trabajar) y pega:

```text
Instálame la skill novelinha de Avatrix. Los pasos están en https://raw.githubusercontent.com/avatrix-io/skills/main/INSTALL.md: léelo y síguelo. En Claude Code, hazlo todo tú. En el sitio o la app de Claude, guíame en los clics, uno a la vez: descargar https://github.com/avatrix-io/skills/releases/latest/download/novelinha.zip, cargarlo en Configuración > Plugins (o Personalizar > Habilidades en la pantalla antigua) y añadir el conector de Avatrix con la URL https://avatrix.io/mcp. Al final, dime qué escribo para empezar.
```

Descarga, instala, conecta Avatrix y se detiene para que entres a tu cuenta (`/mcp` > avatrix). No pide contraseña. Después, en una sesión nueva, escribe "haz una novelinha".

En el sitio de Claude (claude.ai), te guía en los mismos clics de la parte de abajo, uno a la vez.

## En el sitio de Claude (sin instalar nada)
1. **La skill:** en claude.ai, haz clic en tu nombre > Configuración > Plugins > Añadir y elige la opción de subir un plugin (en la pantalla antigua: Personalizar > Habilidades, haz clic en **+** > Crear habilidad > Cargar una habilidad). Elige el `novelinha.zip` que descargaste en la página de versiones del repositorio (Releases), tal como vino (no hace falta descomprimirlo) y confirma. La skill "novelinha" aparece activada.
2. **Avatrix (el conector):** todavía en Plugins, haz clic en Añadir > Añadir conector personalizado (en la pantalla antigua: Personalizar > Conectores > **+ Añadir** > Añadir conector personalizado). Nombre: `Avatrix`. URL: `https://avatrix.io/mcp`. Haz clic en Continuar hasta llegar a Añadir, entra con tu cuenta de Avatrix y haz clic en Permitir. Tiene que aparecer "Conectado".
3. **Internet para Avatrix:** ve a Configuración > Capacidades. Revisa que "Ejecución de código y creación de archivos" (o "Crear y editar archivos") esté activada: es la que une los pedazos de la novela. Activa la opción de usar internet al crear archivos y, en Sitios permitidos > Gestionar, añade `*.avatrix.io` (en la pantalla antigua: activa "Permitir salida de red" y pega `*.avatrix.io` en los dominios permitidos). Si no aparece el campo de dominios, tu cuenta de Claude todavía no tiene esa opción.
4. **Conversación nueva:** la red que activaste solo vale en una conversación nueva. Abre una y pregunta "¿qué personajes tengo en Avatrix?". El sitio pide permiso para ver tu cuenta: puedes hacer clic en Permitir siempre, porque leer no gasta nada.
5. **ffmpeg** (lo que une los clips) ya viene en el sitio. No instales nada.
6. **El candado del sí:** la skill solo gasta créditos después de tu "sí", un "sí" por imagen o video, y además el sitio pide permiso. Para generar imagen o video, haz clic en **Permitir una vez**, cada vez, nunca en Permitir siempre. Prueba: pide "usa la skill novelinha y genera una imagen de prueba" sin decir sí; tiene que decir el precio y esperar tu "sí".
7. **Una sola conversación:** haz toda la Parte 1 en la misma conversación y vuelve a ella para la Parte 2. En una conversación nueva Claude no ve los archivos de la anterior. Si tienes que abrir otra, pega la "ficha de la serie" que la skill muestra al final de cada etapa y escribe "novelinha continúa": la skill retoma donde se quedó con los personajes y las generaciones de tu cuenta de Avatrix. ¿Apareció un aviso de límite de Claude? Espera la hora que muestra y escribe "continúa", en la misma conversación.
8. **Usar:** escribe "haz una novelinha" y manda el link de una novela que se esté haciendo viral, o cuenta tu idea. La skill te responde en español y la novela sale en español.

## En Claude Code
¿Instalaste con el mensaje o con el plugin (los comandos `claude plugin` del README)? Salta esta parte: la skill, el candado del sí y el aviso de versión nueva ya vienen activados.

### 1. La carpeta en su lugar
1. Crea una carpeta para el proyecto (ej.: `mis-novelas`) y ábrela en Claude Code.
2. Descomprime el ZIP. Mueve la carpeta `novelinha` a `mis-novelas/.claude/skills/novelinha/` (queda `.../novelinha/SKILL.md`).
3. Las carpetas que empiezan con punto están ocultas en Mac: en el Finder, `Cmd + Shift + .` las muestra.

### 2. Conectar Avatrix a Claude
1. En la terminal, dentro de la carpeta del proyecto: `claude mcp add --transport http avatrix https://avatrix.io/mcp`
2. Abre Claude Code, escribe `/mcp`, elige `avatrix` y entra con tu cuenta de Avatrix.
3. Prueba: pregunta "¿cuántos créditos tengo en Avatrix?". Tiene que responder tu saldo.

### 3. ffmpeg (une los clips al final)
- Mac: `brew install ffmpeg` (sin Homebrew: brew.sh).
- Windows: `winget install ffmpeg`.
- Prueba: `ffmpeg -version`.

### 4. El candado del sí (obligatorio)
La skill solo gasta créditos después de tu "sí", y eso lo bloquea la máquina, no solo una promesa: un "sí" (o "yes", o "sim") libera UNA generación (un cuadro o un video). "Me gusta" u "ok" no liberan. Abre `mis-novelas/.claude/settings.json` (créalo si no existe) y déjalo así:
```json
{
  "hooks": {
    "UserPromptSubmit": [{"hooks": [{"type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/skills/novelinha/scripts/trava-sim.sh\""}]}],
    "PreToolUse": [{"matcher": ".*[Aa]vatrix.*generate_(image|video)", "hooks": [{"type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/skills/novelinha/scripts/trava-sim.sh\""}]}]
  }
}
```
Cierra y abre Claude Code de nuevo (solo lee el candado al abrir). Prueba: pide "genera una imagen de prueba" sin decir sí antes; tiene que aparecer "TRAVA DO SIM" y la skill tiene que detenerse y preguntar.

### 5. Usar
- Escribe: "haz una novelinha" y manda el link de una novela que se esté haciendo viral, o cuenta tu idea.
- La skill crea los personajes en Avatrix, muestra el guion, genera el clip 1 para que lo veas y solo sigue con tu "sí".
- Se detuvo a la mitad: "novelinha continúa".

## Idioma
La skill te responde en el idioma en que le escribes y la novela sale en ese idioma: diálogos, voces, país de los personajes (mexicanos, si no dices otro), hashtags y título. ¿Otro país u otro idioma para la novela? Dilo al empezar ("la novela en español de Argentina", "la novela en inglés"). El idioma queda fijo en toda la serie.

## Cuánto cuesta
La skill cotiza cada generación en el momento, con el precio que devuelve Avatrix, y muestra el total de la Parte 1 en créditos antes del primer "sí".
- El video sale en **Avatar Pro** (la escena con los personajes hablando juntos) o en **Persona Pro** (la voz de cada uno siempre igual, o "la calidad más alta": 1080p). No tienes que elegir.
- Otro modelo, solo si lo pides por su nombre.
En Avatar Pro la voz sale del propio video. Cambiar la voz de una frase que salió mal se cotiza antes, por segundo.

## Quién la hizo
Avatrix: [avatrix.io](https://avatrix.io).
