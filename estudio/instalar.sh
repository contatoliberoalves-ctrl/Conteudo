#!/usr/bin/env bash
# Prepara o estúdio de vídeo. Rápido quando já está tudo instalado.
#   bash estudio/instalar.sh            básico: transcrição, cortes, legendas, rosto, narração edge-tts
#   bash estudio/instalar.sh --skills   + skills oficiais do HyperFrames (HeyGen) e do Remotion
#   bash estudio/instalar.sh --voz      + Chatterbox (clonagem de voz; baixa ~3 GB, ideal com GPU)
#   bash estudio/instalar.sh --tudo     tudo isso
set -euo pipefail
cd "$(dirname "$0")"
EST=$(pwd)
RAIZ=$(cd .. && pwd)
SKILLS=0; VOZ=0
for a in "$@"; do
  case $a in --skills) SKILLS=1;; --voz) VOZ=1;; --tudo) SKILLS=1; VOZ=1;; esac
done

ok() { printf '  \033[32m✓\033[0m %s\n' "$1"; }

# 1. ffmpeg com libass (legendas)
command -v ffmpeg >/dev/null || { echo "instale o ffmpeg (apt install ffmpeg / brew install ffmpeg)"; exit 1; }
FILTROS=$(ffmpeg -hide_banner -filters 2>/dev/null)
grep -qE " subtitles +V" <<<"$FILTROS" || echo "  ⚠ ffmpeg sem libass: as legendas não vão queimar"
ok "ffmpeg $(ffmpeg -version | head -1 | cut -d' ' -f3)"

# 2. Python
python3 - <<'EOF' 2>/dev/null || pip install -q faster-whisper opencv-python-headless numpy pillow edge-tts aiohttp yt-dlp fonttools onnxruntime requests 2>&1 | grep -v -i warning || true
import faster_whisper, cv2, numpy, PIL, edge_tts, aiohttp, fontTools, onnxruntime, requests
assert hasattr(cv2, "FaceDetectorYN")
EOF
command -v yt-dlp >/dev/null || pip install -q yt-dlp
ok "python: faster-whisper, opencv, pillow, edge-tts, yt-dlp"

# 3. Fontes dos perfis (Google Fonts, OFL), em versões estáticas para o libass
mkdir -p fontes
baixa() { [ -f "fontes/$2" ] || curl -sfL "https://raw.githubusercontent.com/google/fonts/main/ofl/$1" -o "fontes/$2"; }
baixa bebasneue/BebasNeue-Regular.ttf BebasNeue-Regular.ttf
baixa poppins/Poppins-ExtraBold.ttf Poppins-ExtraBold.ttf
baixa poppins/Poppins-Bold.ttf Poppins-Bold.ttf
estatica() {  # família-variável peso nome-final
  [ -f "fontes/$3.ttf" ] && return
  curl -sfL "https://raw.githubusercontent.com/google/fonts/main/ofl/$1%5Bwght%5D.ttf" -o /tmp/var.ttf
  fonttools varLib.instancer /tmp/var.ttf wght="$2" --update-name-table -q -o "fontes/$3.ttf"; rm -f /tmp/var.ttf
}
estatica bigshouldersdisplay/BigShouldersDisplay 900 BigShouldersDisplay-Black
estatica playfairdisplay/PlayfairDisplay 900 PlayfairDisplay-Black
estatica intertight/InterTight 800 InterTight-ExtraBold
estatica montserrat/Montserrat 800 Montserrat-ExtraBold
[ -f fontes/ArchivoExpanded-Black.ttf ] || { curl -sfL "https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/Archivo%5Bwdth%2Cwght%5D.ttf" -o /tmp/arch.ttf && \
  fonttools varLib.instancer /tmp/arch.ttf wght=900 wdth=125 --update-name-table -q -o fontes/ArchivoExpanded-Black.ttf; rm -f /tmp/arch.ttf; }
ok "fontes: $(ls fontes/*.ttf | wc -l) arquivos"

# 4. Detector de rosto (YuNet, 230 KB)
mkdir -p modelos
[ -f modelos/yunet.onnx ] || curl -sfL -o modelos/yunet.onnx \
  https://media.githubusercontent.com/media/opencv/opencv_zoo/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx
[ -f modelos/modnet.onnx ] || curl -sfL -o modelos/modnet.onnx https://huggingface.co/Xenova/modnet/resolve/main/onnx/model.onnx
ok "detector de rosto + recorte de pessoa (MODNet)"

# 5. Projeto de motion (Remotion + GSAP)
if command -v npm >/dev/null && [ ! -d motion/node_modules/remotion ]; then
  (cd motion && npm install --no-audit --no-fund >/dev/null 2>&1) && ok "motion: Remotion + GSAP instalados"
fi

# 6. Skills oficiais (ficam em .claude/skills/, fora do git)
if [ $SKILLS = 1 ]; then
  cd "$RAIZ"
  [ -d .claude/skills/hyperframes ] || npx -y skills add heygen-com/hyperframes --agent claude-code -y >/dev/null 2>&1
  [ -d .claude/skills/remotion-best-practices ] || npx -y skills add remotion-dev/skills --agent claude-code -y >/dev/null 2>&1
  [ -d .claude/skills/gsap-core ] || npx -y skills add greensock/gsap-skills --agent claude-code -y >/dev/null 2>&1
  cd "$EST"
  ok "skills HyperFrames + Remotion + GSAP em .claude/skills/"
fi

# 7. Clonagem de voz
if [ $VOZ = 1 ]; then
  python3 -c "import chatterbox" 2>/dev/null || pip install -q chatterbox-tts 2>&1 | grep -v -i warning || true
  ok "Chatterbox (clonagem de voz)"
fi

echo "Pronto. Comece com: python3 estudio/ev.py transcrever <pasta-dos-videos>"
