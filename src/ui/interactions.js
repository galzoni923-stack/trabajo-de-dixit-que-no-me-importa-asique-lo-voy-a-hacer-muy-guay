import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Minúsculas y símbolos estrechos: ocupan lo mismo que el texto real y no lo hacen saltar de línea
const CHARS = 'abcdefghijklmnopqrstuvwxyz01<>/*+=_'
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

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

// Tarjetas: al pasar por encima, la escena 3D toma el color de esa estafa
export function initCards(scams, scene) {
  document.querySelectorAll('.card').forEach((card) => {
    const scam = scams.find((s) => s.id === card.dataset.id)
    const title = card.querySelector('.card__title')
    // Al pasar por encima, el título se reescribe carácter a carácter
    const scramble = () => {
      if (reduced) return
      // Fija la altura mientras dura el efecto para que la tarjeta no salte si el texto cambia de línea
      title.style.height = `${title.offsetHeight}px`
      gsap.to(title, {
        duration: 0.7,
        scrambleText: { text: scam.title, chars: CHARS, speed: 1 },
        overwrite: true,
        onComplete: () => (title.style.height = ''),
      })
    }
    // El color de la estafa vive solo en la escena 3D (el "momento"), no en la interfaz
    card.addEventListener('pointerenter', () => {
      scene?.setHover(scam.hue)
      scramble()
    })
    card.addEventListener('focus', scramble)
    card.addEventListener('pointerleave', () => scene?.setHover(null))
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
  gsap.set(staggered, { opacity: 0, y: 12 })
  ScrollTrigger.batch(staggered, {
    start: 'top 92%',
    once: true,
    onEnter: (els) =>
      gsap.fromTo(els, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'expo.out', overwrite: true }),
  })
}
