import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/jetbrains-mono/400.css'
import './styles/main.css'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import Lenis from 'lenis'

import { scams, simulations } from './data/content.js'
import { renderContent, pad } from './ui/render.js'
import { Dossier } from './ui/dossier.js'
import { initSimulator } from './ui/simulator.js'
import { createAnatomy } from './ui/anatomy.js'
import { initCursor, initCards, initReveals } from './ui/interactions.js'

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin)

const html = document.documentElement
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const coarse = matchMedia('(pointer: coarse)').matches
const lowPower = coarse || (navigator.hardwareConcurrency || 8) <= 4

if (history.scrollRestoration) history.scrollRestoration = 'manual'
renderContent()

// ───────── WebGL (carga diferida para no bloquear el contenido) ─────────
let scene = null
function webglOK() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
const sceneReady = (async () => {
  if (!webglOK()) {
    html.classList.add('no-webgl')
    return
  }
  try {
    const { Scene, preloadFont } = await import('./webgl/Scene.js')
    scene = new Scene(document.getElementById('webgl'), { scams, lowPower, reducedMotion: reduced })
    const base = import.meta.env.BASE_URL
    await Promise.all(
      ['500', '700'].map(
        (w) => new Promise((res) => preloadFont({ font: `${base}fonts/space-grotesk-latin-${w}-normal.woff`, characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑ /' }, res))
      )
    )
  } catch (err) {
    console.warn('WebGL desactivado:', err)
    html.classList.add('no-webgl')
    scene = null
  }
})()

// ───────── Scroll suave (Lenis) sincronizado con GSAP ─────────
const lenis = new Lenis({ lerp: reduced ? 1 : 0.085, wheelMultiplier: 0.9, smoothWheel: !reduced })
lenis.stop()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.lagSmoothing(0)
gsap.ticker.add((time, deltaMS) => {
  lenis.raf(time * 1000)
  scene?.update(time, Math.min(deltaMS / 1000, 0.05), lenis.velocity)
})

// ───────── Dossiers + enrutado por hash ─────────
const dossier = new Dossier({ scams, scene: null, lenis })
sceneReady.then(() => (dossier.scene = scene))

function route() {
  const m = location.hash.match(/^#\/([\w-]+)/)
  if (m && scams.some((s) => s.id === m[1])) dossier.open(m[1])
  else if (dossier.isOpen) dossier.close()
}
window.addEventListener('hashchange', route)
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#/"]')
  if (a) dossier.navigatedInApp = true
})

// Enlaces internos con scroll suave
document.querySelectorAll('[data-scroll-to]').forEach((a) =>
  a.addEventListener('click', (e) => {
    e.preventDefault()
    const target = a.getAttribute('href')
    closeMenu()
    lenis.scrollTo(target, { duration: 2, easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)) })
  })
)

// Menú móvil
const menuBtn = document.querySelector('.menu-btn')
const menu = document.querySelector('.mobile-menu')
function closeMenu() {
  menu.classList.remove('is-open')
  menuBtn.setAttribute('aria-expanded', 'false')
  menuBtn.textContent = 'Menú'
}
menuBtn.addEventListener('click', () => {
  const open = !menu.classList.contains('is-open')
  menu.classList.toggle('is-open', open)
  menuBtn.setAttribute('aria-expanded', String(open))
  menuBtn.textContent = open ? 'Cerrar' : 'Menú'
  if (open) gsap.from('.mobile-menu a', { yPercent: 100, opacity: 0, stagger: 0.06, duration: 0.9, ease: 'expo.out' })
})

// ───────── HUD ─────────
const hudIndex = document.querySelector('.hud__index')
const hudTrack = document.querySelector('.hud__track i')
const hudSection = document.querySelector('.hud__section')
const sections = [...document.querySelectorAll('[data-section]')]
lenis.on('scroll', ({ progress }) => {
  gsap.set(hudTrack, { scaleY: progress })
})

let activeSection = null
function activate(sec) {
  if (activeSection === sec) return
  activeSection = sec
  const name = sec.dataset.section
  scene?.setSection(name)
  html.classList.toggle('dim-gl', name !== 'inicio' && name !== 'fuentes')
  hudIndex.textContent = pad(sections.indexOf(sec) + 1)
  hudSection.textContent = sec.dataset.label
  document.querySelectorAll('.nav a').forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${name}`))
}

// ───────── Scroll: secciones + scroll horizontal ─────────
function initScroll() {
  const mm = gsap.matchMedia()
  mm.add({ desktop: '(min-width: 821px)', mobile: '(max-width: 820px)' }, (ctx) => {
    const { desktop } = ctx.conditions
    const fraudes = document.getElementById('fraudes')
    const cleanups = []

    // Motion graphic "Anatomía de una estafa" (va primero: está antes en la página)
    cleanups.push(createAnatomy({ scene, desktop }))

    if (desktop) {
      const track = fraudes.querySelector('.cards--track')
      const bar = fraudes.querySelector('.hscroll__progress i')
      const dist = () => Math.max(track.scrollWidth - innerWidth, 0)
      gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: fraudes,
          start: 'top top',
          end: () => `+=${dist() * 1.1}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
        },
      })
    }

    sections.forEach((sec) => {
      const trigger = sec.parentElement.classList.contains('pin-spacer') ? sec.parentElement : sec
      ScrollTrigger.create({
        trigger,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && activate(sec),
      })
    })

    return () => cleanups.forEach((fn) => fn())
  })
}

// ───────── Preloader + intro ─────────
async function boot() {
  const num = document.querySelector('.preloader__num')
  const bar = document.querySelector('.preloader__bar i')
  const status = document.querySelector('.preloader__status')
  const progress = { v: 0 }
  const counter = gsap.to(progress, {
    v: 92,
    duration: reduced ? 0.2 : 2.2,
    ease: 'power2.inOut',
    onUpdate: () => {
      num.textContent = String(Math.round(progress.v)).padStart(3, '0')
      gsap.set(bar, { scaleX: progress.v / 100 })
    },
  })

  await Promise.all([document.fonts.ready, sceneReady, counter.then()])
  await gsap.to(progress, {
    v: 100,
    duration: 0.4,
    onUpdate: () => {
      num.textContent = String(Math.round(progress.v)).padStart(3, '0')
      gsap.set(bar, { scaleX: progress.v / 100 })
    },
  })
  status.textContent = 'Lista'

  initReveals()
  initCursor()
  initCards(scams, scene)
  initSimulator(simulations, scene)
  initScroll()

  // Texto del título partido en letras
  const lines = SplitText.create('.hero__line', { type: 'chars', charsClass: 'char' })

  const tl = gsap.timeline({ delay: 0.5 })
  tl.to('.preloader__count, .preloader__top, .preloader__bottom', { yPercent: -60, opacity: 0, duration: 0.9, ease: 'expo.in', stagger: 0.05 })
    .to('.preloader', { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'expo.inOut' }, '-=0.3')
    .add(() => {
      document.body.classList.remove('is-loading')
      document.querySelector('.preloader').remove()
      if (scene) scene.intro()
    }, '-=0.6')
    .from(lines.chars, { yPercent: 115, rotate: 10, duration: 1.6, stagger: 0.035, ease: 'expo.out' }, '-=0.5')
    .from('.hero__kicker span', { opacity: 0, y: 14, stagger: 0.08, duration: 1, ease: 'expo.out' }, '<0.3')
    .from('.hud--top > *, .hud--side, .hud--bottom', { opacity: 0, y: -10, stagger: 0.06, duration: 1, ease: 'expo.out' }, '<')
    .from('.hero__foot .btn', { opacity: 0, y: 30, duration: 1.2, ease: 'expo.out' }, '<0.2')
    .add(() => {
      lenis.start()
      ScrollTrigger.refresh()
      route()
    })

  if (reduced) tl.progress(1)
}

boot()
