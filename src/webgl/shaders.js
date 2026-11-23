// Shaders GLSL de la escena.

// Orbe de puntos (geometría de thinking-orbs). Cada punto es un disco mate;
// la profundidad se lee en el tamaño y en la "tinta": lo cercano es claro y brilla.
export const orbVertex = /* glsl */ `
attribute float aSize;
attribute float aInk;
attribute float aAlpha;
uniform float uPxScale;     // píxeles por unidad de mundo a distancia 1
uniform float uModelScale;  // escala del orbe en el mundo
uniform float uOpacity;
uniform float uAssemble;    // intro: 0 = puntos dispersos, 1 = anillo formado
uniform float uAspect;
uniform vec2 uMouse;        // cursor en coordenadas de pantalla (-1..1)
uniform float uRepel;       // 0..1: fuerza con la que el cursor aparta los puntos
uniform vec2 uWaveOrigin;   // onda del clic
uniform float uWaveT;       // segundos desde el clic
varying float vInk;
varying float vAlpha;
varying float vBoost;

mat2 rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec3 p = position;

  // Intro: cada punto llega en espiral desde fuera. El retardo depende de su ángulo
  // (no de su índice, porque el motor reordena los puntos cada frame)
  float ang = atan(p.y, p.x);
  float delay = 0.35 * (0.5 + 0.5 * sin(ang * 3.0));
  float e = smoothstep(delay, delay + 0.65, uAssemble);
  float away = 1.0 - e;
  p.xy = rot(away * 2.6) * p.xy;
  p *= 1.0 + away * (2.5 + 1.5 * (0.5 + 0.5 * sin(ang * 5.0)));
  p.z += away * 2.0 * sin(ang * 2.0);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec4 clip = projectionMatrix * mv;

  // Interacción en pantalla: el cursor aparta los puntos y el clic lanza una onda
  vec2 ndc = clip.xy / clip.w;
  vec2 d = (ndc - uMouse) * vec2(uAspect, 1.0);
  float dist = length(d);
  vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0);
  float push = uRepel * exp(-dist * dist / 0.03) * 0.09;

  vec2 dw = (ndc - uWaveOrigin) * vec2(uAspect, 1.0);
  float dwl = length(dw);
  vec2 dirw = dwl > 0.0001 ? dw / dwl : vec2(0.0);
  float radius = uWaveT * 1.6;
  float band = exp(-pow((dwl - radius) / 0.08, 2.0)) * (1.0 - smoothstep(0.2, 1.6, uWaveT));

  vec2 offs = dir * push + dirw * band * 0.06;
  offs.x /= uAspect;
  clip.xy += offs * clip.w;
  gl_Position = clip;

  gl_PointSize = max(1.5, 2.0 * aSize * uModelScale * uPxScale / -mv.z) * (1.0 + away * 1.5);
  vBoost = push * 8.0 + band;
  vInk = aInk;
  vAlpha = aAlpha * uOpacity * e;
}
`

export const orbFragment = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uFar;
uniform float uGlow;
varying float vInk;
varying float vAlpha;
varying float vBoost;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = 1.0 - smoothstep(0.42, 0.5, d);
  if (a <= 0.0) discard;
  vec3 col = mix(uFar, uColor, vInk) * (0.7 + vInk * vInk * 1.3 * uGlow);
  col += uColor * vBoost * 1.4;
  gl_FragColor = vec4(col, a * vAlpha);
}
`

export const particlesVertex = /* glsl */ `
attribute float aSize;
attribute float aRand;
uniform float uTime;
uniform float uPixelRatio;
uniform float uVel;
varying float vAlpha;

void main() {
  vec3 p = position;
  p.y += sin(uTime * 0.18 + aRand * 30.0) * 0.35;
  p.x += cos(uTime * 0.14 + aRand * 20.0) * 0.35;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.5 + 0.5 * sin(uTime * (0.8 + aRand * 2.4) + aRand * 40.0);
  gl_PointSize = aSize * uPixelRatio * (30.0 / -mv.z) * (1.0 + uVel * 0.8);
  vAlpha = tw * smoothstep(48.0, 5.0, -mv.z) * smoothstep(0.6, 2.5, -mv.z);
}
`

export const particlesFragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, d), 2.2);
  gl_FragColor = vec4(uColor * 1.1, a * vAlpha * 0.85);
}
`

// Efecto de post-procesado propio: "señal interceptada".
// Desplaza bandas horizontales de la imagen al hacer scroll rápido o al abrir un dossier.
export const signalFragment = /* glsl */ `
uniform float intensity;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void mainUv(inout vec2 uv) {
  float t = floor(time * 18.0);
  float band = floor(uv.y * mix(18.0, 46.0, hash12(vec2(t, 3.1))));
  float r = hash12(vec2(band, t));
  float glitchOn = step(1.0 - intensity * 0.32, r);
  uv.x += glitchOn * (hash12(vec2(t, band)) - 0.5) * 0.09 * intensity;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  float scan = 0.5 + 0.5 * sin(uv.y * resolution.y * 0.7 - time * 6.0);
  vec3 c = inputColor.rgb * (1.0 - scan * 0.06 * (0.25 + intensity));
  outputColor = vec4(c, inputColor.a);
}
`
