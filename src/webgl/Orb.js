import * as THREE from 'three'
import gsap from 'gsap'
// Geometría de los orbes de thinking-orbs (MIT © Jakub Antalik): solo el motor,
// sin React ni su canvas 2D. Nos da, para cada instante, una lista de puntos en 3D
// ya ordenados por profundidad, y aquí los pintamos con Three.js.
import { MODE_FRAMES, resolvePreset } from 'thinking-orbs/engine'
import { orbVertex, orbFragment } from './shaders.js'

const FRAME = 300 // tamaño de referencia: los radios del motor están afinados para 300 px
const HALF = FRAME / 2
const MAX_DOTS = 1600
const MAX_LINES = 400

// Una capa = un estado del orbe. Hay dos para poder fundir un estado con el siguiente.
class OrbLayer {
  constructor(uniforms) {
    this.mode = null
    this.t = 0
    this.speed = 1
    this.opacity = 0

    const geo = new THREE.BufferGeometry()
    const attr = (n, size) => new THREE.BufferAttribute(new Float32Array(n * size), size).setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('position', attr(MAX_DOTS, 3))
    geo.setAttribute('aSize', attr(MAX_DOTS, 1))
    geo.setAttribute('aInk', attr(MAX_DOTS, 1))
    geo.setAttribute('aAlpha', attr(MAX_DOTS, 1))
    geo.setDrawRange(0, 0)
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 2)

    this.uOpacity = { value: 0 }
    this.points = new THREE.Points(
      geo,
      new THREE.ShaderMaterial({
        vertexShader: orbVertex,
        fragmentShader: orbFragment,
        uniforms: { ...uniforms, uOpacity: this.uOpacity },
        transparent: true,
        depthWrite: false,
      })
    )

    // Aristas del estado "connecting" (la constelación)
    const lgeo = new THREE.BufferGeometry()
    lgeo.setAttribute('position', attr(MAX_LINES * 2, 3))
    lgeo.setAttribute('color', attr(MAX_LINES * 2, 3))
    lgeo.setDrawRange(0, 0)
    lgeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 2)
    this.lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    })
    this.lines = new THREE.LineSegments(lgeo, this.lineMat)

    this.group = new THREE.Group()
    this.group.add(this.lines, this.points)
  }

  setState(state) {
    const { mode, speed, opts } = resolvePreset(state, 64)
    this.state = state
    this.mode = mode
    this.speed = speed
    this.opts = opts
  }

  update(dt, speedMul, tint) {
    this.group.visible = this.opacity > 0.005 && !!this.mode
    if (!this.group.visible) return
    this.t += dt * this.speed * speedMul
    const { dots, lines } = MODE_FRAMES[this.mode](FRAME, this.t, this.opts)

    const g = this.points.geometry
    const pos = g.attributes.position.array
    const size = g.attributes.aSize.array
    const ink = g.attributes.aInk.array
    const alpha = g.attributes.aAlpha.array
    const n = Math.min(dots.length, MAX_DOTS)
    for (let i = 0; i < n; i++) {
      const d = dots[i]
      // De píxeles del marco de 300 a unidades del mundo (radio ~1), conservando la profundidad real
      pos[i * 3] = (d.x - HALF) / HALF
      pos[i * 3 + 1] = -(d.y - HALF) / HALF
      pos[i * 3 + 2] = d.z / HALF
      size[i] = d.r / HALF
      // El motor usa tinta sobre papel (0 = oscuro); sobre fondo oscuro se invierte: lo cercano brilla
      ink[i] = 1 - Math.min(1, Math.max(0, d.white))
      alpha[i] = d.a ?? 1
    }
    g.setDrawRange(0, n)
    g.attributes.position.needsUpdate = true
    g.attributes.aSize.needsUpdate = true
    g.attributes.aInk.needsUpdate = true
    g.attributes.aAlpha.needsUpdate = true
    this.uOpacity.value = this.opacity

    const lg = this.lines.geometry
    const lp = lg.attributes.position.array
    const lc = lg.attributes.color.array
    const m = Math.min(lines.length, MAX_LINES)
    for (let i = 0; i < m; i++) {
      const l = lines[i]
      const k = i * 6
      lp[k] = (l.x1 - HALF) / HALF
      lp[k + 1] = -(l.y1 - HALF) / HALF
      lp[k + 2] = 0
      lp[k + 3] = (l.x2 - HALF) / HALF
      lp[k + 4] = -(l.y2 - HALF) / HALF
      lp[k + 5] = 0
      const v = (1 - Math.min(1, Math.max(0, l.white))) * (l.a ?? 1)
      for (let j = 0; j < 2; j++) {
        lc[k + j * 3] = tint.r * v
        lc[k + j * 3 + 1] = tint.g * v
        lc[k + j * 3 + 2] = tint.b * v
      }
    }
    lg.setDrawRange(0, m * 2)
    lg.attributes.position.needsUpdate = true
    lg.attributes.color.needsUpdate = true
    this.lineMat.opacity = this.opacity
  }
}

export class Orb {
  constructor({ radius = 1.35 } = {}) {
    this.uniforms = {
      uColor: { value: new THREE.Color('#ffffff') },
      uFar: { value: new THREE.Color('#3a4252') },
      uGlow: { value: 1 },
      uPxScale: { value: 1 },
      uModelScale: { value: radius },
    }
    this.front = new OrbLayer(this.uniforms)
    this.back = new OrbLayer(this.uniforms)
    this.radius = radius
    this.group = new THREE.Group()
    this.group.scale.setScalar(radius)
    this.group.add(this.back.group, this.front.group)
    this.mix = { v: 1 }
  }

  get state() {
    return this.front.state
  }

  // Funde el estado actual con el nuevo: uno se encoge y se apaga mientras el otro crece
  setState(state, immediate = false) {
    if (state === this.front.state) return
    ;[this.front, this.back] = [this.back, this.front]
    this.front.setState(state)
    this.front.t = Math.random() * 20
    gsap.killTweensOf(this.mix)
    if (immediate) {
      this.mix.v = 1
      return
    }
    this.mix.v = 0
    gsap.to(this.mix, { v: 1, duration: 1.4, ease: 'expo.inOut' })
  }

  update(dt, speedMul, tint, pxScale, worldScale) {
    const m = this.mix.v
    this.front.opacity = m
    this.back.opacity = 1 - m
    this.front.group.scale.setScalar(0.7 + 0.3 * m)
    this.back.group.scale.setScalar(1 + 0.35 * m)
    this.uniforms.uPxScale.value = pxScale
    this.uniforms.uModelScale.value = this.radius * worldScale
    this.front.update(dt, speedMul, tint)
    this.back.update(dt, speedMul, tint)
  }
}
