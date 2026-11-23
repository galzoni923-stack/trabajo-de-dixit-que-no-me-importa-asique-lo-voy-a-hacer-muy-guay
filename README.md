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
| `src/webgl/Scene.js` | La escena 3D: el orbe, las partículas, el texto 3D y el post-procesado. |
| `src/webgl/Orb.js` | Pinta en Three.js los puntos que calcula el motor de thinking-orbs. |
| `src/webgl/shaders.js` | Los shaders GLSL: los puntos del orbe, las partículas y el efecto de "señal interceptada". |
| `src/ui/dossier.js` | La página de cada estafa (se abre con `#/phishing`, `#/bizum`, etc.), con el diagrama animado "Ruta del ataque". |
| `src/ui/quiz.js` | El minijuego "¿Estafa o legítimo?". |
| `src/ui/anatomy.js` | Motion graphic "Anatomía de una estafa": secuencia controlada por el scroll (tipografía cinética, SMS anotado, robo de datos y defensa). |
| `src/ui/interactions.js` | Cursor, texto que se descifra, botones magnéticos y animaciones de entrada. |
| `src/main.js` | Lo une todo: scroll suave, secciones, preloader e intro. |

## La idea visual

El elemento central es un orbe de puntos: el anillo `breathing` de [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) (MIT © Jakub Antalik). Su geometría sale del motor de la librería y se pinta en Three.js con bloom y profundidad real. Es el mismo en toda la web; lo que cambia entre secciones es su posición, su tamaño y su color (rojo en Delitos informáticos, por ejemplo). Al hacer scroll rápido va más deprisa, y el ratón lo inclina para que se note que es 3D.

## Pulido con la skill unslop

El diseño se ha repasado con la skill [unslop](https://github.com/heydamir/unslop) de Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), CC BY 4.0, instalada en `.claude/skills/unslop`. Se aplicó en modo pulido: se mantuvo el 3D y el movimiento que pide el encargo y se quitaron las señales de "diseño hecho por IA" (etiquetas en mayúsculas, HUD decorativo, brillos, 15 colores de acento, píldoras, bucles y rebotes).

- **Mundo:** la pantalla del móvil por la noche. Neutros de la rampa "ink" y un único acento azul cielo
- **Firma:** la marca roja numerada sobre el texto sospechoso, la misma en la anatomía, el juego y los dossiers

## Cómo cubre la rúbrica

- **Estructura y navegación (2 p):** portada → bloque 1 (7 delitos) → bloque 2 (8 fraudes) → juego → 10 consejos → fuentes y créditos. Cada estafa tiene su propia página con URL propia.
- **Contenido (3 p):** cada estafa incluye qué es, cómo funciona, señales de alarma y cómo evitarla.
- **Ejemplos reales (2 p):** casos de España y Europa (DGT, "Hola mamá", Hospital Clínic, Almendralejo, CNMV...).
- **Diseño (2 p) y ortografía (1 p).**

## Publicar

Con GitHub Pages: *Settings → Pages → Source: GitHub Actions*. Cada push a `main` publica la web.
