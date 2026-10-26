#!/usr/bin/env bash
# Genera img/ (avif, webp, jpg) desde origenes/. Requiere sips, cwebp, avifenc.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf img && mkdir -p img/galeria

gen() { # origen destino-sin-ext ancho
  local tmp; tmp="$(mktemp -d)"
  local w; w="$(sips -g pixelWidth "$1" | awk '/pixelWidth/{print $2}')"
  [ "$w" -lt "$3" ] && set -- "$1" "$2" "$w" # sin agrandar
  sips -Z "$3" "$1" --out "$tmp/i.jpg" >/dev/null
  sips -s format jpeg -s formatOptions 65 "$tmp/i.jpg" --out "$2.jpg" >/dev/null
  cwebp -quiet -q 70 "$tmp/i.jpg" -o "$2.webp"
  avifenc -s 6 -q 45 "$tmp/i.jpg" "$2.avif" >/dev/null
  rm -rf "$tmp"
}

for i in $(seq 1 12); do
  gen "origenes/$i.jpg" "img/galeria/$i-thumb" 400
  gen "origenes/$i.jpg" "img/galeria/$i" 1000
done
gen origenes/atencion.jpg img/atencion 800
sips -Z 180 origenes/favicon.png --out img/favicon.png >/dev/null
