# Fábrica de Corpóreos

Landing estática (HTML + CSS + JS mínimo), sin build.

## Desarrollo
Abrir `index.html` o `python3 -m http.server`.

## Imágenes
Las fuentes están en `origenes/`. Para regenerar `img/` (avif/webp/jpg): `./scripts/optimizar-imagenes.sh` (macOS: sips, cwebp, avifenc).

## Despliegue (CasaOS / Docker)
    docker compose up -d --build
Sitio en http://IP-DEL-SERVIDOR:8080. En CasaOS: *App Store → Custom Install → Import* y pegar `docker-compose.yml`.
