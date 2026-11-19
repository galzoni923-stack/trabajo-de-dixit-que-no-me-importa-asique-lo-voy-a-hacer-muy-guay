# CIBERESTAFAS · Detecta, entiende y protege

Web educativa sobre las principales ciberestafas y fraudes digitales (proyecto de 4º ESO).
Experiencia 3D interactiva hecha con **Three.js**, **GSAP**, **Lenis**, **troika-three-text** y **postprocessing**.

## Cómo arrancarla

```bash
npm install
npm run dev       # servidor local con recarga en caliente
npm run build     # genera la web final en /dist
npm run preview   # sirve /dist para comprobarla
```

## Dónde está cada cosa

| Archivo | Qué hace |
| --- | --- |
| `src/data/content.js` | **Todo el texto**: las 15 estafas, los 10 consejos, el juego y las fuentes. Es lo que hay que revisar y reescribir con vuestras palabras. |
| `src/webgl/Scene.js` | La escena 3D: el cristal (tu identidad digital), los fragmentos, las partículas, el texto 3D y el post-procesado. |
| `src/webgl/shaders.js` | Los shaders GLSL: el cristal que se rompe, las partículas y el efecto de "señal interceptada". |
| `src/ui/dossier.js` | La página de cada estafa (se abre con `#/phishing`, `#/bizum`, etc.), con el diagrama animado "Ruta del ataque". |
| `src/ui/quiz.js` | El minijuego "¿Estafa o legítimo?". |
| `src/ui/anatomy.js` | Motion graphic "Anatomía de una estafa": secuencia controlada por el scroll (tipografía cinética, SMS anotado, robo de datos y defensa). |
| `src/ui/interactions.js` | Cursor, texto que se descifra, botones magnéticos y animaciones de entrada. |
| `src/main.js` | Lo une todo: scroll suave, secciones, preloader e intro. |

## La idea visual

El cristal central representa **tu identidad digital**. En los bloques de estafas se rompe en pedazos y se tiñe de rojo.
En "Consejos generales" se vuelve a unir: protegerse es recomponerlo. Al hacer scroll rápido o abrir un dossier aparece
una interferencia de señal, como si alguien estuviera interceptando la conexión.

## Cómo cubre la rúbrica

- **Estructura y navegación (2 p):** portada → bloque 1 (7 delitos) → bloque 2 (8 fraudes) → juego → 10 consejos → fuentes y créditos. Cada estafa tiene su propia página con URL propia.
- **Contenido (3 p):** cada estafa incluye qué es, cómo funciona, señales de alarma y cómo evitarla.
- **Ejemplos reales (2 p):** casos de España y Europa (DGT, "Hola mamá", Hospital Clínic, Almendralejo, CNMV...).
- **Diseño (2 p) y ortografía (1 p).**

## Publicar

Con GitHub Pages: *Settings → Pages → Source: GitHub Actions*. Cada push a `main` publica la web.
