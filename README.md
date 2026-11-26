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
| `src/data/content.js` | **Todo el texto**: las 15 estafas, los 10 consejos, las 3 historias del simulador y las fuentes. Es lo que hay que revisar y reescribir con vuestras palabras. |
| `src/webgl/Scene.js` | La escena 3D: el orbe, las partículas, el texto 3D y el post-procesado. |
| `src/webgl/Orb.js` | Pinta en Three.js los puntos que calcula el motor de thinking-orbs. |
| `src/webgl/shaders.js` | Los shaders GLSL: los puntos del orbe, las partículas y el efecto de "señal interceptada". |
| `src/ui/dossier.js` | La página de cada estafa (se abre con `#/phishing`, `#/bizum`, etc.), con el diagrama animado "Ruta del ataque". |
| `src/ui/simulator.js` | El simulador "¿Qué harías tú?": conversaciones con un estafador en las que eliges qué responder. |
| `src/ui/anatomy.js` | Motion graphic "Anatomía de una estafa": secuencia controlada por el scroll (tipografía cinética, SMS anotado, robo de datos y defensa). |
| `src/ui/interactions.js` | Cursor, texto que se descifra, botones magnéticos y animaciones de entrada. |
| `src/main.js` | Lo une todo: scroll suave, secciones, preloader e intro. |

## La idea visual

El elemento central es un orbe de puntos: el anillo `breathing` de [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) (MIT © Jakub Antalik). Su geometría sale del motor de la librería y se pinta en Three.js con bloom y profundidad real. Es el mismo en toda la web; lo que cambia entre secciones es su posición, su tamaño y su color (rojo en Delitos informáticos, por ejemplo). Al hacer scroll rápido va más deprisa, y el ratón lo inclina para que se note que es 3D.

- **Intro:** al cargar, los puntos llegan en espiral desde fuera y se ensamblan en el anillo mientras entra el título.
- **Cursor:** los puntos se apartan del ratón y, al hacer clic en un hueco, una onda recorre el anillo.
- **Recorrido continuo:** el orbe no salta de una sección a otra; viaja, crece y cambia de color atado al scroll.
- **Tarjetas conectadas:** al pasar por una tarjeta, las demás se atenúan y su nombre gira en el anillo de texto 3D hasta quedar delante, iluminado.
- **Cortina entre dossiers:** al pasar de una estafa a otra, el anillo crece hasta barrer la pantalla y aparece la siguiente.

## Simulador "¿Qué harías tú?"

Tres conversaciones con un estafador, cada una en un canal: un amigo que pide un código por WhatsApp, un comprador de Wallapop y una oferta de trabajo por Telegram. En cada paso eliges qué responder; un medidor de riesgo sube o baja con cada decisión y la historia acaba con un final protegido o estafado. Al terminar, la conversación se rebobina con las señales marcadas y se repasan tus decisiones. Se juega con el ratón, con el dedo o con las teclas 1, 2 y 3.

## Pulido con la skill unslop

El diseño se ha repasado con la skill [unslop](https://github.com/heydamir/unslop) de Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), CC BY 4.0, instalada en `.claude/skills/unslop`. Se aplicó en modo pulido: se mantuvo el 3D y el movimiento que pide el encargo y se quitaron las señales de "diseño hecho por IA" (etiquetas en mayúsculas, HUD decorativo, brillos, 15 colores de acento, píldoras, bucles y rebotes).

- **Mundo:** la pantalla del móvil por la noche. Neutros de la rampa "ink" y un único acento azul cielo
- **Firma:** la marca roja numerada sobre el texto sospechoso, la misma en la anatomía, el simulador y los dossiers

## Cómo cubre la rúbrica

- **Estructura y navegación (2 p):** portada → bloque 1 (7 delitos) → bloque 2 (8 fraudes) → simulador "¿Qué harías tú?" → 10 consejos → fuentes y créditos. Cada estafa tiene su propia página con URL propia.
- **Contenido (3 p):** cada estafa incluye qué es, cómo funciona, señales de alarma y cómo evitarla.
- **Ejemplos reales (2 p):** casos de España y Europa (DGT, "Hola mamá", Hospital Clínic, Almendralejo, CNMV...).
- **Diseño (2 p) y ortografía (1 p).**

## Publicar en Netlify

La web está preparada para publicarse en **https://ciberestafas.castedolabs.com**. La configuración está en `netlify.toml` (compilación, versión de Node y cabeceras).

1. En Netlify: **Add new site → Import an existing project → GitHub** y elige este repositorio. Como rama de producción, la que vayas a publicar (por ejemplo `main`). Netlify lee `netlify.toml`, así que no hay que tocar nada más.
2. En el sitio: **Domain management → Add a domain** → `ciberestafas.castedolabs.com`.
3. En el proveedor DNS de `castedolabs.com`, crea un registro **CNAME**: nombre `ciberestafas`, valor `<nombre-del-sitio>.netlify.app`.
4. Cuando el DNS se propague, Netlify activa HTTPS solo (Let's Encrypt). Marca el dominio como principal para que `*.netlify.app` redirija a él.

Cada push a la rama de producción vuelve a publicar la web.
