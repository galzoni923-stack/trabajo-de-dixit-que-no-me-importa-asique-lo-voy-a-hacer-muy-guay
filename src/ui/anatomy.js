import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// "Anatomía de una estafa": motion graphic controlado por el scroll.
// A · tipografía cinética → B · SMS que se escribe y se anota → C · robo de datos → D · la defensa
export function createAnatomy({ scene, desktop }) {
  const root = document.getElementById('anatomia')
  if (!root) return () => {}
  const q = (s) => root.querySelector(s)
  const qa = (s) => [...root.querySelectorAll(s)]

  const stage = q('.anatomy__stage')
  const sms = q('.sms')
  const tap = q('.tap')
  const paths = qa('.anatomy__lines path')
  const callouts = qa('.callout')
  const hls = qa('.hl')
  const phases = qa('[data-phase]')
  const bar = q('.anatomy__bar i')
  const split = SplitText.create(q('.sms__body'), { type: 'words,chars', charsClass: 'tch' })

  // Posición de un elemento respecto al escenario, ignorando transformaciones
  const rel = (el) => {
    let x = 0
    let y = 0
    let n = el
    while (n && n !== stage) {
      x += n.offsetLeft
      y += n.offsetTop
      n = n.offsetParent
    }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight }
  }

  // Dibuja las líneas que unen cada explicación con su señal de alarma
  const layout = () => {
    callouts.forEach((c, i) => {
      const a = rel(c)
      const b = rel(hls[i])
      const right = c.classList.contains('callout--r1')
      const sx = right ? a.x - 14 : a.x + a.w + 14
      const sy = a.y + 18
      const ex = b.x + b.w / 2
      const ey = i === 1 ? b.y + b.h + 3 : b.y - 3
      const k = Math.abs(ex - sx) * 0.55
      paths[i].setAttribute('d', `M ${sx} ${sy} C ${sx + (right ? -k : k)} ${sy}, ${ex} ${ey + (i === 1 ? 60 : -60)}, ${ex} ${ey}`)
    })
    const link = rel(hls[2])
    gsap.set(tap, { left: link.x + link.w * 0.6, top: link.y + link.h / 2 })
  }
  layout()
  ScrollTrigger.addEventListener('refreshInit', layout)

  const words = qa('.kt--a .kt__w')
  const cWords = qa('.kt--c .kt__w')
  const chars = split.chars

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: () => `+=${innerHeight * (desktop ? 6 : 5)}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
    // Se actualiza con la propia línea de tiempo (incluido el suavizado del scrub)
    onUpdate: () => {
      gsap.set(bar, { scaleX: tl.progress() })
      const t = tl.time()
      const p = t < 2.7 ? 0 : t < 4.6 ? 1 : t < 6.3 ? 2 : t < 8.8 ? 3 : 4
      phases.forEach((el, i) => el.classList.toggle('is-on', i === p))
    },
  })

  // A · Tipografía cinética
  words.forEach((w, i) => {
    tl.fromTo(
      w,
      { opacity: 0, scale: 1.9, filter: 'blur(18px)', yPercent: 30 },
      { opacity: 1, scale: 1, filter: 'blur(0px)', yPercent: 0, duration: 0.45, ease: 'expo.out' },
      i * 0.38
    )
  })
  tl.fromTo('.kt__w--strike', { '--s': 0 }, { '--s': 1, duration: 0.3, ease: 'power2.inOut' }, 0.95)
    .to('.kt__w--strike', { opacity: 0.5, duration: 0.3 }, 1.1)
    .fromTo('.kt__w--danger', { x: -18 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.2)' }, 2.0)
    .to('.kt--a .kt__row', { yPercent: -40, opacity: 0, filter: 'blur(12px)', stagger: 0.05, duration: 0.5, ease: 'power2.in' }, 2.35)

  // B · El mensaje se escribe solo
  tl.fromTo(sms, { opacity: 0, y: 60, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out' }, 2.8)
    .fromTo(chars, { opacity: 0 }, { opacity: 1, duration: 0.02, stagger: 1.4 / chars.length }, 3.1)

  // Las señales de alarma se iluminan y se anotan
  hls.forEach((hl, i) => {
    const at = 4.7 + i * 0.5
    tl.fromTo(hl, { '--on': 0 }, { '--on': 1, duration: 0.25, ease: 'power2.out' }, at)
      .fromTo(paths[i], { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4, ease: 'power2.inOut' }, at + 0.05)
      .fromTo(
        callouts[i],
        { opacity: 0, x: i < 2 ? -30 : 30, filter: 'blur(8px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.4, ease: 'expo.out' },
        at + 0.2
      )
  })

  // C · El clic y el robo
  tl.fromTo(tap, { opacity: 0, scale: 2.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, 6.3)
    .to(tap, { scale: 0.7, duration: 0.12, yoyo: true, repeat: 1 }, 6.65)
    .call(() => scene?.pulse(1.2), null, 6.8)
    .to(
      stage,
      {
        keyframes: [
          { x: -16, skewX: 9, filter: 'hue-rotate(80deg) saturate(2.2)' },
          { x: 12, skewX: -6, filter: 'hue-rotate(-40deg) saturate(1.6)' },
          { x: -5, skewX: 2, filter: 'hue-rotate(20deg) saturate(1.2)' },
          { x: 0, skewX: 0, filter: 'hue-rotate(0deg) saturate(1)' },
        ],
        duration: 0.5,
      },
      6.8
    )
    .to([...callouts, q('.anatomy__lines'), tap], { opacity: 0, duration: 0.3 }, 6.9)
    .to(sms, { opacity: 0.12, scale: 0.92, filter: 'blur(5px)', duration: 0.4 }, 7.0)
    .fromTo('.leak', { opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.4, ease: 'expo.out' }, 7.1)
  qa('.leak__val').forEach((v, i) => {
    tl.to(v, { scrambleText: { text: v.dataset.final, chars: '0123456789', speed: 1 }, duration: 0.5 }, 7.35 + i * 0.18)
  })
  tl.to(stage, { opacity: 0, y: -60, filter: 'blur(12px)', duration: 0.5, ease: 'power2.in' }, 8.4)

  // D · La defensa
  cWords.forEach((w, i) => {
    tl.fromTo(
      w,
      { opacity: 0, yPercent: 110, rotateX: -80 },
      { opacity: 1, yPercent: 0, rotateX: 0, duration: 0.45, ease: 'expo.out' },
      8.95 + i * 0.45
    )
  })
  tl.fromTo('.kt__foot', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' }, 10.4).to({}, { duration: 0.8 })

  return () => {
    ScrollTrigger.removeEventListener('refreshInit', layout)
    split.revert()
  }
}
