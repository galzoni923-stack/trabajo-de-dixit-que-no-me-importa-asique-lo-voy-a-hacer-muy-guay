import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

const CHARS = '01<>/\\#*+=_[]{}ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// Cursor personalizado
export function initCursor() {
  const el = document.querySelector('.cursor')
  if (!el || matchMedia('(pointer: coarse)').matches) return
  const ring = el.querySelector('.cursor__ring')
  const dot = el.querySelector('.cursor__dot')
  const label = el.querySelector('.cursor__label')
  const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' })
  const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' })
  const dx = gsap.quickTo(dot, 'x', { duration: 0.1 })
  const dy = gsap.quickTo(dot, 'y', { duration: 0.1 })
  window.addEventListener('pointermove', (e) => {
    rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY)
  })
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-hover]')
    el.classList.toggle('is-hover', !!t)
    const text = t?.dataset.cursor
    el.classList.toggle('is-label', !!text)
    if (text) label.textContent = text
  })
}

// Texto que se "descifra" al pasar el ratón
export function initScramble() {
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    const text = el.textContent
    el.addEventListener('mouseenter', () => {
      gsap.to(el, { duration: 0.6, scrambleText: { text, chars: CHARS, speed: 0.9, revealDelay: 0.1 }, overwrite: true })
    })
  })
}

export function scrambleTo(el, text, duration = 0.8) {
  gsap.to(el, { duration, scrambleText: { text, chars: CHARS, speed: 0.8 }, overwrite: true })
}

// Botones que se pegan al cursor
export function initMagnetic() {
  if (matchMedia('(pointer: coarse)').matches) return
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    const y = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - r.left - r.width / 2) * 0.35)
      y((e.clientY - r.top - r.height / 2) * 0.35)
    })
    el.addEventListener('pointerleave', () => { x(0); y(0) })
  })
}

// Tarjetas: brillo que sigue al ratón, inclinación 3D y color en la escena WebGL
export function initCards(scams, scene) {
  document.querySelectorAll('.card').forEach((card) => {
    const scam = scams.find((s) => s.id === card.dataset.id)
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' })
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' })
    gsap.set(card, { transformPerspective: 900 })
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      card.style.setProperty('--mx', `${px * 100}%`)
      card.style.setProperty('--my', `${py * 100}%`)
      rx((0.5 - py) * 8)
      ry((px - 0.5) * 8)
    })
    card.addEventListener('pointerenter', () => {
      scene?.setHover(scam.hue)
      const title = card.querySelector('.card__title')
      gsap.to(title, { duration: 0.7, scrambleText: { text: scam.title, chars: CHARS, speed: 1 }, overwrite: true })
    })
    card.addEventListener('pointerleave', () => {
      rx(0); ry(0)
      scene?.setHover(null)
    })
  })
}

// Revelado de textos línea a línea con máscara
export function initReveals() {
  document.querySelectorAll('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110,
          rotate: 2,
          duration: 1.4,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      },
    })
  })

  // Manifiesto: palabra a palabra con el scroll
  const m = document.querySelector('[data-words]')
  if (m) {
    const split = SplitText.create(m, { type: 'words', wordsClass: 'word' })
    gsap.fromTo(
      split.words,
      { opacity: 0.1, filter: 'blur(6px)' },
      {
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: m, start: 'top 75%', end: 'bottom 45%', scrub: 1 },
      }
    )
  }

  // Contadores
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = +el.dataset.count
    const pre = el.dataset.prefix || ''
    const suf = el.dataset.suffix || ''
    const o = { v: 0 }
    el.textContent = `${pre}0${suf}`
    gsap.to(o, {
      v: end,
      duration: 2,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = `${pre}${Math.round(o.v)}${suf}`),
    })
  })

  // Entradas en cascada
  const staggered = '.cards--grid .card, .tip, .source, .stat, .help, .credits > div'
  gsap.set(staggered, { opacity: 0, y: 70 })
  ScrollTrigger.batch(staggered, {
    start: 'top 92%',
    once: true,
    onEnter: (els) =>
      gsap.fromTo(els, { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out', overwrite: true }),
  })
}
