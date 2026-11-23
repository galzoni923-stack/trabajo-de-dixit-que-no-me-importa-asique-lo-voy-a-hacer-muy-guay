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
varying float vInk;
varying float vAlpha;

void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(1.5, 2.0 * aSize * uModelScale * uPxScale / -mv.z);
  vInk = aInk;
  vAlpha = aAlpha * uOpacity;
}
`

export const orbFragment = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uFar;
uniform float uGlow;
varying float vInk;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = 1.0 - smoothstep(0.42, 0.5, d);
  if (a <= 0.0) discard;
  vec3 col = mix(uFar, uColor, vInk) * (0.7 + vInk * vInk * 1.3 * uGlow);
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
