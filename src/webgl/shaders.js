// Shaders GLSL de la escena.
// El "núcleo" es un cristal facetado que representa tu identidad digital:
// con cada estafa se rompe en pedazos, y con los consejos se vuelve a unir.

const rotate = /* glsl */ `
mat3 rotAxis(vec3 axis, float a) {
  axis = normalize(axis);
  float s = sin(a), c = cos(a), oc = 1.0 - c;
  return mat3(
    oc * axis.x * axis.x + c,          oc * axis.x * axis.y + axis.z * s, oc * axis.z * axis.x - axis.y * s,
    oc * axis.x * axis.y - axis.z * s, oc * axis.y * axis.y + c,          oc * axis.y * axis.z + axis.x * s,
    oc * axis.z * axis.x + axis.y * s, oc * axis.y * axis.z - axis.x * s, oc * axis.z * axis.z + c
  );
}
`

export const crystalVertex = /* glsl */ `
uniform float uTime;
uniform float uFracture;
#ifdef FRACTURE
attribute vec3 aCenter;
attribute float aRand;
#endif
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vLocal;
varying float vRand;

${rotate}

void main() {
  vec3 p = position;
  vec3 n = normal;
  vRand = 0.5;

  #ifdef FRACTURE
    // Cada cara del cristal se separa desde su centro y gira sobre sí misma
    vec3 dir = normalize(aCenter);
    float push = uFracture * (0.25 + aRand * 1.6);
    vec3 local = position - aCenter;
    vec3 axis = vec3(aRand - 0.5, 0.8, 0.3 + aRand);
    float ang = uFracture * (aRand * 5.0 - 2.5) + sin(uTime * 0.7 + aRand * 20.0) * 0.25 * uFracture;
    mat3 R = rotAxis(axis, ang);
    local = R * local * (1.0 - uFracture * 0.3);
    p = aCenter + dir * push + local;
    p += dir * sin(uTime * 1.3 + aRand * 6.2831) * 0.012;
    n = R * normal;
    vRand = aRand;
  #endif

  vec4 pos = vec4(p, 1.0);
  #ifdef USE_INSTANCING
    pos = instanceMatrix * pos;
    n = mat3(instanceMatrix) * n;
  #endif

  vec4 world = modelMatrix * pos;
  vNormal = normalize(mat3(modelMatrix) * n);
  vViewDir = normalize(cameraPosition - world.xyz);
  vLocal = p;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

export const crystalFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColorA;   // cuerpo (oscuro)
uniform vec3 uColorB;   // brillo / borde
uniform vec3 uColorC;   // especular
uniform float uGlow;
uniform float uFracture;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vLocal;
varying float vRand;

void main() {
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(vViewDir);
  float ndv = clamp(dot(n, v), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 2.6);

  vec3 L = normalize(vec3(0.4, 0.9, 0.6));
  float spec = pow(max(dot(reflect(-L, n), v), 0.0), 28.0);
  vec3 L2 = normalize(vec3(-0.8, -0.3, 0.4));
  float spec2 = pow(max(dot(reflect(-L2, n), v), 0.0), 12.0);

  // Iridiscencia tipo película fina
  float t = ndv * 1.4 + uTime * 0.06 + dot(n, vec3(0.2, 0.5, 0.3)) + vRand * 0.4;
  vec3 irid = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + t));

  // Líneas de escaneo que recorren el cristal
  float scan = smoothstep(0.988, 1.0, sin(vLocal.y * 34.0 - uTime * 2.2) * 0.5 + 0.5);

  vec3 col = uColorA;
  col += mix(uColorB, irid, 0.22) * fres * 1.7 * uGlow;
  col += uColorC * spec * 1.3;
  col += uColorB * spec2 * 0.18;
  col += uColorB * scan * 0.45 * uGlow;
  col += uColorB * uFracture * vRand * 0.12;

  gl_FragColor = vec4(col, 1.0);
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
