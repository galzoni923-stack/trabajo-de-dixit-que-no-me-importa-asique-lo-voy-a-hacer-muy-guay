import * as THREE from 'three'
import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
  ChromaticAberrationEffect,
  VignetteEffect,
  ToneMappingEffect,
  ToneMappingMode,
} from 'postprocessing'
import { Text } from 'troika-three-text'
export { preloadFont } from 'troika-three-text'
import gsap from 'gsap'
import { SignalEffect } from './SignalEffect.js'
import { crystalVertex, crystalFragment, particlesVertex, particlesFragment } from './shaders.js'

const BASE = import.meta.env.BASE_URL
const FONT = `${BASE}fonts/space-grotesk-latin-500-normal.woff`
const FONT_BOLD = `${BASE}fonts/space-grotesk-latin-700-normal.woff`

// Estado visual de cada sección. GSAP interpola entre ellos.
const PRESETS = {
  inicio:     { coreX: 0,    coreY: 0,    coreScale: 0.78,  fracture: 0,    camZ: 6.2, hue: 0.54, danger: 0,    ring: 0, words: 0, shell: 0.5, glow: 1,   spin: 1 },
  manifiesto: { coreX: 0,    coreY: 0,    coreScale: 0.75, fracture: 0.28, camZ: 7.4, hue: 0.56, danger: 0,    ring: 0, words: 1, shell: 0.3, glow: 1.1, spin: 0.6 },
  anatomia:   { coreX: 0,    coreY: 0,    coreScale: 0.55, fracture: 0.5,  camZ: 8.5, hue: 0.54, danger: 0.5,  ring: 0, words: 0, shell: 0.2, glow: 1.1, spin: 1.2 },
  delitos:    { coreX: 2.3,  coreY: 0,    coreScale: 0.8,  fracture: 0.8,  camZ: 7.0, hue: 0.54, danger: 0.9,  ring: 1, words: 0, shell: 0.15, glow: 1.3, spin: 1.6 },
  fraudes:    { coreX: 3.0,  coreY: 1.25, coreScale: 0.55, fracture: 0.85, camZ: 7.6, hue: 0.07, danger: 0.55, ring: 0, words: 0, shell: 0.1, glow: 1.3, spin: 2 },
  detecta:    { coreX: 3.0,  coreY: -0.4, coreScale: 0.62, fracture: 0.45, camZ: 7.0, hue: 0.72, danger: 0.2,  ring: 0, words: 0, shell: 0.3, glow: 1,   spin: 1 },
  consejos:   { coreX: 2.55, coreY: 0,    coreScale: 0.78, fracture: 0,    camZ: 6.8, hue: 0.5,  danger: 0,    ring: 0, words: 0, shell: 0.9, glow: 1.6, spin: 0.5 },
  fuentes:    { coreX: 3.1,  coreY: 1.5,  coreScale: 0.45, fracture: 0.12, camZ: 10,  hue: 0.55, danger: 0,    ring: 0, words: 0, shell: 0.4, glow: 1.2, spin: 0.4 },
}

const RED = new THREE.Color('#ff2d4b')
const WHITE = new THREE.Color('#ffffff')

export class Scene {
  constructor(canvas, { scams, lowPower = false, reducedMotion = false }) {
    this.canvas = canvas
    this.scams = scams
    this.lowPower = lowPower
    this.reducedMotion = reducedMotion
    this.section = 'inicio'
    this.state = { ...PRESETS.inicio, camX: 0, intro: 0, burst: 0, focus: 0 }
    this.pointer = new THREE.Vector2()
    this.pointerSmooth = new THREE.Vector2()
    this.velocity = 0
    this.hoverHue = null
    this.hoverMix = { v: 0 }
    this.colA = new THREE.Color()
    this.colB = new THREE.Color()
    this.tmpColor = new THREE.Color()

    this.initRenderer()
    this.initScene()
    this.initCore()
    this.initDebris()
    this.initParticles()
    this.initOrbits()
    this.initText()
    this.initPost()
    this.onResize()

    window.addEventListener('resize', () => this.onResize())
    window.addEventListener('pointermove', (e) => {
      this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
    })
  }

  // ───────────────────────── Setup ─────────────────────────
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      powerPreference: 'high-performance',
      antialias: false,
      stencil: false,
      depth: false,
    })
    this.dpr = Math.min(window.devicePixelRatio, this.lowPower ? 1.25 : 1.75)
    this.renderer.setPixelRatio(this.dpr)
    this.renderer.setClearColor(0x07080d, 1)
  }

  initScene() {
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x07080d, 0.06)
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    this.camera.position.set(0, 0, PRESETS.inicio.camZ)
    this.world = new THREE.Group()
    this.scene.add(this.world)
  }

  initCore() {
    this.coreGroup = new THREE.Group()
    this.world.add(this.coreGroup)

    // Cristal: icosaedro facetado. Cada triángulo guarda su centro para poder "romperse".
    const geo = new THREE.IcosahedronGeometry(1.05, 1)
    geo.computeVertexNormals()
    const pos = geo.attributes.position
    const count = pos.count
    const centers = new Float32Array(count * 3)
    const rands = new Float32Array(count)
    for (let i = 0; i < count; i += 3) {
      const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3
      const cy = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3
      const cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3
      const r = Math.random()
      for (let k = 0; k < 3; k++) {
        centers.set([cx, cy, cz], (i + k) * 3)
        rands[i + k] = r
      }
    }
    geo.setAttribute('aCenter', new THREE.BufferAttribute(centers, 3))
    geo.setAttribute('aRand', new THREE.BufferAttribute(rands, 1))

    this.crystalUniforms = {
      uTime: { value: 0 },
      uFracture: { value: 0 },
      uColorA: { value: new THREE.Color('#050a12') },
      uColorB: { value: new THREE.Color('#7fdcff') },
      uColorC: { value: new THREE.Color('#ffffff') },
      uGlow: { value: 1 },
    }
    this.coreMat = new THREE.ShaderMaterial({
      vertexShader: crystalVertex,
      fragmentShader: crystalFragment,
      uniforms: this.crystalUniforms,
      defines: { FRACTURE: '' },
      side: THREE.DoubleSide,
    })
    this.core = new THREE.Mesh(geo, this.coreMat)
    this.coreGroup.add(this.core)

    // Núcleo de energía que aparece al romperse el cristal
    this.heartMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, fog: false })
    this.heart = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 3), this.heartMat)
    this.coreGroup.add(this.heart)

    // Carcasa de alambre exterior
    this.shellMat = new THREE.LineBasicMaterial({
      color: 0x9fe8ff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.shell = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.75, 1)), this.shellMat)
    this.coreGroup.add(this.shell)
  }

  initDebris() {
    // Fragmentos que orbitan como un cinturón de asteroides
    const N = this.lowPower ? 90 : 180
    const geo = new THREE.TetrahedronGeometry(1, 0)
    geo.computeVertexNormals()
    const mat = new THREE.ShaderMaterial({
      vertexShader: crystalVertex,
      fragmentShader: crystalFragment,
      uniforms: this.crystalUniforms,
      side: THREE.DoubleSide,
    })
    this.debris = new THREE.InstancedMesh(geo, mat, N)
    this.debris.frustumCulled = false
    this.debrisData = Array.from({ length: N }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 1.9 + Math.random() * 1.1,
      height: (Math.random() - 0.5) * 0.5,
      speed: (0.04 + Math.random() * 0.12) * (Math.random() < 0.15 ? -1 : 1),
      scale: 0.025 + Math.pow(Math.random(), 2.2) * 0.13,
      spread: 0.6 + Math.random() * 3.4,
      rot: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
      rotSpeed: 0.2 + Math.random() * 1.5,
    }))
    this.dummy = new THREE.Object3D()
    this.debrisGroup = new THREE.Group()
    this.debrisGroup.rotation.set(0.35, 0, -0.18)
    this.debrisGroup.add(this.debris)
    this.coreGroup.add(this.debrisGroup)
  }

  initParticles() {
    const N = this.lowPower ? 1400 : 3200
    const positions = new Float32Array(N * 3)
    const sizes = new Float32Array(N)
    const rands = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const r = 4 + Math.pow(Math.random(), 0.7) * 30
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(ph) * Math.cos(th)
      positions[i * 3 + 1] = r * Math.cos(ph) * 0.6
      positions[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 6
      sizes[i] = 0.4 + Math.pow(Math.random(), 3) * 2.6
      rands[i] = Math.random()
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aRand', new THREE.BufferAttribute(rands, 1))
    this.particleUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: this.dpr },
      uVel: { value: 0 },
      uColor: { value: new THREE.Color('#bfeaff') },
    }
    this.particles = new THREE.Points(
      geo,
      new THREE.ShaderMaterial({
        vertexShader: particlesVertex,
        fragmentShader: particlesFragment,
        uniforms: this.particleUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
    this.scene.add(this.particles)
  }

  initOrbits() {
    this.orbits = new THREE.Group()
    const mk = (r, tilt, op) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.0035, 6, 320),
        new THREE.MeshBasicMaterial({ color: 0x9fe8ff, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })
      )
      m.rotation.set(Math.PI / 2 + tilt[0], tilt[1], tilt[2])
      m.userData.baseOpacity = op
      this.orbits.add(m)
      return m
    }
    mk(2.45, [0.35, 0, -0.18], 0.35)
    mk(3.1, [-0.2, 0.3, 0.1], 0.18)
    mk(3.9, [0.1, -0.25, 0.3], 0.1)
    this.coreGroup.add(this.orbits)
  }

  initText() {
    // ── Anillo con los nombres de las 15 estafas (troika-three-text) ──
    this.ring = new THREE.Group()
    this.ring.rotation.x = 0.16
    this.ringTexts = []
    const R = 2.7
    this.scams.forEach((s, i) => {
      const a = (i / this.scams.length) * Math.PI * 2
      const t = new Text()
      t.text = s.title
      t.font = FONT
      t.fontSize = 0.14
      t.letterSpacing = 0
      t.anchorX = 'center'
      t.anchorY = 'middle'
      t.color = 0xcfefff
      t.material = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, side: THREE.FrontSide })
      t.position.set(Math.sin(a) * R, (i % 2 ? 0.1 : -0.1), Math.cos(a) * R)
      t.rotation.y = a
      t.userData.id = s.id
      t.sync()
      this.ring.add(t)
      this.ringTexts.push(t)
    })
    this.world.add(this.ring)

    // ── Palabras gigantes huecas para el manifiesto ──
    this.words = new THREE.Group()
    const mkWord = (txt, x, y, z, size) => {
      const t = new Text()
      t.text = txt
      t.font = FONT_BOLD
      t.fontSize = size
      t.letterSpacing = -0.02
      t.anchorX = 'center'
      t.anchorY = 'middle'
      t.color = 0x9fe8ff
      t.fillOpacity = 0
      t.strokeWidth = '1.2%'
      t.strokeColor = 0x9fe8ff
      t.strokeOpacity = 1
      t.material = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false })
      t.position.set(x, y, z)
      t.userData.base = new THREE.Vector3(x, y, z)
      t.sync()
      this.words.add(t)
      return t
    }
    mkWord('DETECTA', -1.2, 1.35, -2.5, 1.25)
    mkWord('ENTIENDE', 1.4, 0.0, -4.5, 1.25)
    mkWord('PROTEGE', -0.6, -1.4, -6.5, 1.25)
    this.world.add(this.words)
  }

  initPost() {
    this.composer = new EffectComposer(this.renderer, { frameBufferType: THREE.HalfFloatType })
    this.composer.addPass(new RenderPass(this.scene, this.camera))

    this.bloom = new BloomEffect({
      intensity: 1.35,
      luminanceThreshold: 0.12,
      luminanceSmoothing: 0.35,
      mipmapBlur: true,
      radius: 0.72,
    })
    const tone = new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC })
    const vignette = new VignetteEffect({ darkness: 0.62, offset: 0.28 })
    this.composer.addPass(new EffectPass(this.camera, this.bloom, tone, vignette))

    if (!this.reducedMotion) {
      this.signal = new SignalEffect()
      this.composer.addPass(new EffectPass(this.camera, this.signal))
    }

    this.ca = new ChromaticAberrationEffect({
      offset: new THREE.Vector2(0.0006, 0.0004),
      radialModulation: true,
      modulationOffset: 0.18,
    })
    this.composer.addPass(new EffectPass(this.camera, this.ca))
  }

  // ───────────────────────── API ─────────────────────────
  get isMobile() {
    return window.innerWidth < 820
  }

  setSection(name, immediate = false) {
    if (!PRESETS[name]) return
    this.section = name
    if (this.state.focus > 0.01) return // un dossier abierto manda
    this.tweenTo(PRESETS[name], immediate ? 0 : 2.2)
  }

  tweenTo(preset, duration = 2) {
    gsap.to(this.state, {
      ...preset,
      duration,
      ease: 'expo.inOut',
      overwrite: 'auto',
    })
  }

  // Al abrir el dossier de una estafa: el cristal estalla y se tiñe de su color
  focus(scam) {
    this.state.focus = 1
    this.pulse(1)
    this.tweenTo(
      { coreX: this.isMobile ? 0 : -2.35, coreY: 0, coreScale: 1.05, fracture: 1.15, camZ: 6.6, hue: scam.hue, danger: 0.25, ring: 0, words: 0, shell: 0.15, glow: 1.6, spin: 2.4 },
      1.6
    )
    this.ringTexts.forEach((t) => (t.color = t.userData.id === scam.id ? 0xffffff : 0xcfefff))
  }

  unfocus() {
    this.state.focus = 0
    this.pulse(0.6)
    this.tweenTo(PRESETS[this.section], 1.8)
  }

  setHover(hue) {
    this.hoverHue = hue
    gsap.to(this.hoverMix, { v: hue === null ? 0 : 1, duration: 0.8, ease: 'power3.out', overwrite: true })
  }

  // Ráfaga de interferencia (glitch) en el post-procesado
  pulse(amount = 1) {
    gsap.fromTo(this.state, { burst: amount }, { burst: 0, duration: 1.1, ease: 'power3.out', overwrite: false })
  }

  intro() {
    this.state.intro = 0
    this.state.fracture = 1.6
    return gsap
      .timeline()
      .to(this.state, { intro: 1, duration: 2.6, ease: 'expo.out' }, 0)
      .to(this.state, { fracture: 0, duration: 3, ease: 'expo.inOut' }, 0)
  }

  // ───────────────────────── Bucle ─────────────────────────
  onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.camera.aspect = w / h
    this.camera.fov = w < h ? 48 : 35
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h, false)
    this.composer.setSize(w, h)
  }

  update(time, delta, velocity = 0) {
    const s = this.state
    const mobile = this.isMobile
    this.velocity += (Math.min(Math.abs(velocity) / 45, 1) - this.velocity) * 0.1
    this.pointerSmooth.lerp(this.pointer, 0.05)

    // Colores: tono base + rojo de "peligro" + tono del elemento con hover
    let hue = s.hue
    if (this.hoverHue !== null || this.hoverMix.v > 0) {
      const target = this.hoverHue ?? hue
      hue = THREE.MathUtils.lerp(hue, target, this.hoverMix.v)
    }
    this.colB.setHSL(hue, 0.85, 0.62).lerp(RED, s.danger * (1 - this.hoverMix.v * 0.7))
    this.colA.setHSL(hue, 0.6, 0.035)
    this.crystalUniforms.uColorB.value.copy(this.colB)
    this.crystalUniforms.uColorA.value.copy(this.colA)
    this.crystalUniforms.uGlow.value = s.glow
    this.crystalUniforms.uTime.value = time
    this.crystalUniforms.uFracture.value = s.fracture + this.velocity * 0.25
    this.heartMat.color.copy(this.colB).multiplyScalar(2.2 + Math.sin(time * 2.2) * 0.4 + s.fracture * 2)
    this.shellMat.color.copy(this.colB)
    this.shellMat.opacity = s.shell * 0.22 * s.intro
    this.orbits.children.forEach((o) => {
      o.material.color.copy(this.colB)
      o.material.opacity = o.userData.baseOpacity * s.intro * (0.6 + s.shell * 0.6)
    })
    this.tmpColor.copy(this.colB).lerp(WHITE, 0.55)
    this.particleUniforms.uColor.value.copy(this.tmpColor)
    this.particleUniforms.uTime.value = time
    this.particleUniforms.uVel.value = this.velocity

    // Núcleo
    const xFactor = mobile ? 0 : 1
    this.coreGroup.position.set(s.coreX * xFactor, s.coreY + (mobile && s.coreX !== 0 ? 0.9 : 0), 0)
    const sc = s.coreScale * s.intro * (mobile ? 0.82 : 1)
    this.coreGroup.scale.setScalar(Math.max(sc, 0.0001))
    const spin = this.reducedMotion ? 0.2 : s.spin
    this.core.rotation.y += delta * 0.18 * spin + this.velocity * 0.02
    this.core.rotation.x = Math.sin(time * 0.2) * 0.25 + this.pointerSmooth.y * 0.3
    this.core.rotation.z = this.pointerSmooth.x * -0.2
    this.shell.rotation.y -= delta * 0.06 * spin
    this.shell.rotation.x += delta * 0.03 * spin
    this.shell.scale.setScalar(1 + s.fracture * 0.35)
    this.heart.scale.setScalar(0.75 + s.fracture * 0.4 + Math.sin(time * 2.2) * 0.04)
    this.orbits.rotation.y += delta * 0.05 * spin
    this.orbits.scale.setScalar(1 + s.fracture * 0.25)

    // Fragmentos
    const d = this.dummy
    for (let i = 0; i < this.debrisData.length; i++) {
      const p = this.debrisData[i]
      p.angle += delta * p.speed * spin
      const r = p.radius + s.fracture * p.spread
      d.position.set(Math.cos(p.angle) * r, p.height * (1 + s.fracture * 3), Math.sin(p.angle) * r)
      d.rotation.set(p.rot.x + time * p.rotSpeed * 0.3, p.rot.y + time * p.rotSpeed * 0.2, p.rot.z)
      d.scale.setScalar(p.scale * (0.55 + s.fracture * 0.6))
      d.updateMatrix()
      this.debris.setMatrixAt(i, d.matrix)
    }
    this.debris.instanceMatrix.needsUpdate = true

    // Anillo de texto
    this.ring.position.set(this.coreGroup.position.x, this.coreGroup.position.y, 0)
    this.ring.rotation.y += delta * 0.07 + this.velocity * 0.012
    const ringOp = s.ring * s.intro * (mobile ? 0 : 1)
    this.ring.visible = ringOp > 0.01
    this.ringTexts.forEach((t) => {
      t.fillOpacity = ringOp * 0.5
      t.material.opacity = ringOp * 0.5
    })
    this.ring.scale.setScalar(0.85 + s.ring * 0.15)

    // Palabras del manifiesto
    this.words.visible = s.words > 0.01
    this.words.children.forEach((w, i) => {
      w.strokeOpacity = s.words * 0.85
      w.material.opacity = s.words
      w.position.x = w.userData.base.x + Math.sin(time * 0.3 + i * 2) * 0.12 + this.pointerSmooth.x * (0.3 + i * 0.25)
      w.position.y = w.userData.base.y + Math.cos(time * 0.25 + i) * 0.08 + this.pointerSmooth.y * (0.2 + i * 0.15)
      w.position.z = w.userData.base.z + (1 - s.words) * -4
    })

    // Cámara con parallax del ratón
    const cx = this.pointerSmooth.x * 0.45 + s.camX
    const cy = this.pointerSmooth.y * 0.3
    this.camera.position.x += (cx - this.camera.position.x) * 0.06
    this.camera.position.y += (cy - this.camera.position.y) * 0.06
    this.camera.position.z = s.camZ * (mobile ? 1.15 : 1) + this.velocity * 0.6
    this.camera.lookAt(0, 0, 0)

    this.particles.rotation.y = time * 0.01
    this.particles.position.y = -window.scrollY * 0.0012

    // Post-procesado reactivo al scroll
    const glitch = Math.min(this.velocity * 0.7 + s.burst, 1.4)
    if (this.signal) this.signal.intensity = glitch
    const ca = 0.0005 + glitch * 0.004
    this.ca.offset.set(ca, ca * 0.6)
    this.bloom.intensity = 1.2 + s.burst * 1.2 + s.fracture * 0.25

    this.composer.render(delta)
  }
}

export const sectionPresets = Object.keys(PRESETS)
