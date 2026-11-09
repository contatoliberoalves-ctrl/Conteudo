# Muros da Aprovação (vídeo 16 s, 720×1280)

Curta motivacional para OAB/concursos, desenhado todo em código num canvas 2D (`index.html`; cada quadro é função pura do tempo, `seek(t)`).
Muros, meta e legendas ficam no `CONFIG` do topo do `index.html`.

```bash
CHROMIUM_PATH=/opt/pw-browsers/chromium node render.mjs contato   # saida/contato.jpg (2 quadros/s)
CHROMIUM_PATH=/opt/pw-browsers/chromium node render.mjs video     # saida/video-mudo.mp4
bash baixar_sons.sh /tmp/sons && python3 -I som.py /tmp/sons      # saida/muros-da-aprovacao.mp4
```

Sons e trilha: OpenGameArt, licença CC0 (pacotes "100 CC0 SFX", "100 CC0 SFX #2", "75 CC0 breaking/falling/hit SFX", "Electricity game sound pack", "Breaking rock", "Cave in", "Air whoosh"; trilhas "Epic Boss Battle", de Juhani Junkala, e "Adventure Theme Intro"). `saida/` fica fora do git.
