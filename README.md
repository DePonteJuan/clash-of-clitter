# Clash of Critters — Planeador de evoluciones

Sitio estático para [GitHub Pages](https://pages.github.com/).

## Uso local

Sirve la carpeta del proyecto con cualquier servidor estático (los módulos ES no cargan bien con `file://`):

```bash
python -m http.server 8080
```

Abre `http://localhost:8080`.

## GitHub Pages

1. Sube este repo a GitHub.
2. Settings → Pages → Source: branch `main`, folder `/ (root)`.
3. Activa el workflow **Update evolution data** (Actions) si quieres ejecución manual; el cron corre los lunes.

## Actualizar datos del wiki

```bash
# Con Node (CI / local si tienes Node)
node scripts/scrape-wiki.mjs

# Con Python
python scripts/scrape_wiki.py
```

El progreso del usuario vive en `localStorage` del navegador (exportar/importar en la UI).
