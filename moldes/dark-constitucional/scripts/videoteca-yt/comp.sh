cd /home/user/Conteudo/moldes/dark-constitucional
V=/tmp/claude-0/-home-user-Conteudo/e5c1d3d9-a352-5c85-9877-13e633f3b970/scratchpad/vt
for i in $(python3 -c "import json;print(' '.join(p['id'] for p in json.load(open('dados.json'))))"); do
  for k in reel yt; do
    src=saida/$i/video.mp4; old=saida/videoteca/video/$i.mp4; cap=saida/$i/capa.jpg
    [ $k = yt ] && src=saida/$i/youtube.mp4 && old=saida/videoteca-yt/video/$i.mp4 && cap=saida/$i/youtube-capa.jpg
    [ -f $V/capa-$k/$i.jpg ] || ffmpeg -v error -y -i $cap -vf "scale='min(720,iw)':-2" -q:v 4 $V/capa-$k/$i.jpg
    [ -f $V/$k/$i.mp4 ] && continue
    if [ -f $old ]; then cp $old $V/$k/$i.mp4; else
      ffmpeg -v error -y -i $src -c:v libx264 -preset medium -crf 27 -maxrate 1100k -bufsize 2200k -c:a aac -b:a 128k -movflags +faststart $V/$k/$i.mp4 && echo "ok $k $i"; fi
  done
done
echo FIM
