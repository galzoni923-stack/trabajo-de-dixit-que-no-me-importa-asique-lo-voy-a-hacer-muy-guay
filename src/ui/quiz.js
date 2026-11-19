import gsap from 'gsap'
import { pad } from './render.js'
import { scams } from '../data/content.js'
import { icon } from './icons.js'

// ─────────────────────────────────────────────────────────────
//  Mini-juego "¿Estafa o legítimo?" dentro de un móvil realista.
//  Desliza la tarjeta (izquierda = estafa, derecha = legítimo),
//  usa los botones o las flechas del teclado.
// ─────────────────────────────────────────────────────────────

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ESC[c])
const clamp = gsap.utils.clamp(0, 1)
const SWIPE = 95

// Envuelve los fragmentos sospechosos (o de confianza) para marcarlos al corregir
function mark(text, flags) {
  let html = esc(text)
  flags.forEach((f, i) => {
    const t = esc(f.t)
    const at = html.indexOf(t)
    if (at === -1) return
    html = `${html.slice(0, at)}<span class="qf" data-n="${i + 1}">${t}</span>${html.slice(at + t.length)}`
  })
  return html
}

const initial = (name) => (name.replace(/[^A-Za-zÁÉÍÓÚÑ]/g, '').charAt(0) || '?').toUpperCase()
const now = () => new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' }).format(new Date())
const today = () => new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

// ───────── Una interfaz distinta para cada canal ─────────
function render(q) {
  const m = (t) => mark(t, q.flags)
  const ctx = q.context ? `<div class="pctx"><b>Contexto</b>${esc(q.context)}</div>` : ''
  const t = now()
  const head = (extra = '') => `
    <header class="phead ${extra}">
      <span class="pback">‹</span>
      <span class="pav pav--${q.kind}">${q.kind === 'whatsapp' ? '' : esc(initial(q.name))}</span>
      <div class="phead__id"><b>${m(q.name)}</b><small>${m(q.sub)}</small></div>
    </header>`

  switch (q.kind) {
    case 'sms':
      return `${head()}
        <div class="pthread">${ctx}
          <span class="pdate">Hoy · ${t}</span>
          <div class="ptyping"><i></i><i></i><i></i></div>
          <div class="pbubble">${m(q.body)}</div>
        </div>`
    case 'whatsapp':
      return `${head('phead--wa')}
        <div class="pthread pthread--wa">${ctx}
          <span class="pdate">HOY</span>
          <div class="pwarn">Este número no está en tus contactos<span><b>Bloquear</b><b>Añadir</b></span></div>
          <div class="ptyping"><i></i><i></i><i></i></div>
          <div class="pbubble pbubble--wa">${m(q.body)}<small class="pbubble__t">${t}</small></div>
        </div>`
    case 'instagram':
      return `${head('phead--ig')}
        <div class="pthread">${ctx}
          <span class="pdate">${t}</span>
          <div class="ptyping"><i></i><i></i><i></i></div>
          <div class="pbubble pbubble--ig">${m(q.body)}</div>
        </div>`
    case 'push':
      return `
        <div class="plock">
          <span class="plock__date">${esc(today())}</span>
          <span class="plock__time">${t}</span>
        </div>${ctx}
        <div class="pnotif pbubble">
          <div class="pnotif__head"><span class="pnotif__icon">€</span><b>${m(q.name)}</b><small>ahora</small></div>
          <p>${m(q.body)}</p>
          <small class="pnotif__sub">${m(q.sub)}</small>
        </div>`
    case 'call':
      return `
        <div class="pcall">${ctx}
          <span class="pcall__label">${m(q.sub)}</span>
          <div class="pcall__av"><i></i><i></i><span>${esc(initial(q.name))}</span></div>
          <b class="pcall__name">${m(q.name)}</b>
          <div class="pcall__live pbubble"><span class="pcall__tag">● Transcripción en directo</span><p>${m(q.body)}</p></div>
          <div class="pcall__btns"><span class="pcall__btn pcall__btn--no">${icon('x')}</span><span class="pcall__btn pcall__btn--yes">${icon('phone')}</span></div>
        </div>`
    case 'email':
      return `
        <header class="phead phead--mail"><span class="pback">‹ Recibidos</span></header>
        <div class="pmail">${ctx}
          <h4>${m(q.subject)}</h4>
          <div class="pmail__from">
            <span class="pav pav--email">${esc(initial(q.name))}</span>
            <div><b>${m(q.name)}</b><small>${m(q.from)}</small><small>${m(q.sub)} · ${t}</small></div>
          </div>
          <div class="pbubble pmail__body"><p>${m(q.body)}</p>${q.cta ? `<span class="pmail__cta">${esc(q.cta)}</span>` : ''}</div>
        </div>`
  }
  return ''
}

const preview = (q) =>
  q.kind === 'call' ? 'Llamada entrante…' : q.kind === 'email' ? q.subject : q.body.length > 52 ? `${q.body.slice(0, 52)}…` : q.body
const appName = { sms: 'Mensajes', whatsapp: 'WhatsApp', instagram: 'Instagram', call: 'Teléfono', email: 'Gmail', push: '' }

export function initQuiz(items, scene) {
  const root = document.querySelector('.quiz')
  const $ = (s) => root.querySelector(s)
  const phone = $('.phone')
  const slot = $('.pslot')
  const banner = $('.pbanner')
  const sheet = $('.psheet')
  const result = $('.presult')
  const stamps = { scam: $('.pstamp--scam'), legit: $('.pstamp--legit') }
  const btns = [...root.querySelectorAll('[data-answer]')]
  const actions = $('.pactions')
  const segWrap = $('.psegs')
  segWrap.replaceChildren(...items.map(() => document.createElement('i')))
  const segs = [...segWrap.children]

  let i = 0
  let score = 0
  let answers = []
  let card = null
  let locked = true
  let sheetOpen = false

  const setButtons = (on) => btns.forEach((b) => (b.disabled = !on))

  const hud = () => {
    $('.quiz__step').textContent = `${pad(Math.min(i + 1, items.length))} / ${pad(items.length)}`
    $('.quiz__points').textContent = `Aciertos ${score}`
    segs.forEach((s, k) => {
      s.className = answers[k] === undefined ? (k === i ? 'is-cur' : '') : answers[k] ? 'is-ok' : 'is-ko'
    })
    $('.pstatus__time').textContent = now()
  }

  // ───────── Llega un mensaje nuevo ─────────
  function load() {
    locked = true
    setButtons(false)
    const q = items[i]
    card = document.createElement('div')
    card.className = `pcard pcard--${q.kind}`
    card.innerHTML = render(q)
    slot.replaceChildren(card)
    gsap.to(actions, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' })
    bindDrag(card)
    hud()

    const tl = gsap.timeline({
      onComplete: () => {
        locked = false
        setButtons(true)
      },
    })

    if (q.kind !== 'push') {
      banner.className = `pbanner pbanner--${q.kind}`
      banner.innerHTML = `<span class="pav pav--${q.kind}">${q.kind === 'whatsapp' ? '' : esc(initial(q.name))}</span>
        <div><small>${esc(appName[q.kind])} · ahora</small><b>${esc(q.name)}</b><span>${esc(preview(q))}</span></div>`
      tl.fromTo(banner, { yPercent: -140, opacity: 0, scale: 0.94 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' })
        .to(banner, { yPercent: -140, opacity: 0, duration: 0.4, ease: 'power3.in' }, '+=0.75')
    }

    tl.fromTo(card, { opacity: 0, scale: 0.94, y: 24, x: 0, rotation: 0 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'expo.out' }, q.kind === 'push' ? 0 : '-=0.2')

    const typing = card.querySelector('.ptyping')
    const bubble = card.querySelector('.pbubble')
    if (typing) {
      tl.fromTo(typing, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'expo.out' })
        .to(typing, { opacity: 0, scale: 0.5, duration: 0.2 }, '+=0.75')
        .set(typing, { display: 'none' })
    }
    if (q.kind === 'push') tl.fromTo(card.querySelector('.plock'), { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0)
    if (bubble) {
      tl.fromTo(
        bubble,
        { opacity: 0, y: 18, scale: 0.9, transformOrigin: '0% 100%' },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'expo.out' },
        typing ? '>' : '-=0.2'
      )
    }
  }

  // ───────── Responder ─────────
  function answer(choice) {
    if (locked || !card) return
    locked = true
    setButtons(false)
    const q = items[i]
    const ok = (choice === 'scam') === q.scam
    answers[i] = ok
    if (ok) score++
    hud()

    const dir = choice === 'scam' ? -1 : 1
    const other = stamps[choice === 'scam' ? 'legit' : 'scam']
    const tl = gsap.timeline()
    tl.to(other, { opacity: 0, duration: 0.15 })
      .to(card, { x: dir * 48, rotation: dir * 5, duration: 0.22, ease: 'power2.out' }, 0)
      .to(stamps[choice], { opacity: 1, scale: 1, duration: 0.25, ease: 'expo.out' }, 0)
      .to(card, { x: 0, rotation: 0, duration: 0.45, ease: 'expo.out' })

    if (!ok) {
      tl.to(phone, { keyframes: { x: [0, -6, 5, -3, 0] }, duration: 0.35, ease: 'power2.out' }, 0.3)
      navigator.vibrate?.([50, 40, 50])
    }

    tl.to(stamps[choice], { opacity: 0, scale: 1.35, duration: 0.35 }, '+=0.15')
      .add(() => card.classList.add(q.scam ? 'is-scam' : 'is-legit'))
      .fromTo(card.querySelectorAll('.qf'), { '--on': 0 }, { '--on': 1, duration: 0.4, stagger: 0.16, ease: 'power2.out' })
      .add(() => openSheet(q, ok), '-=0.1')

    scene?.pulse(ok ? 0.35 : 1.1)
  }

  function openSheet(q, ok) {
    const last = i === items.length - 1
    sheet.className = `psheet ${q.scam ? 'is-scam' : 'is-legit'}`
    sheet.innerHTML = `
      <div class="psheet__handle"></div>
      <div class="psheet__in">
        <span class="psheet__tag mono ${ok ? 'is-ok' : 'is-ko'}">${ok ? `${icon('check')}Correcto` : `${icon('x')}Fallo`}</span>
        <h4>${q.scam ? 'Es una estafa' : 'Es legítimo'}</h4>
        <p class="psheet__lbl mono">${q.scam ? 'Señales de alarma' : 'Señales de confianza'}</p>
        <ol class="psheet__flags">${q.flags.map((f, k) => `<li><span>${k + 1}</span>${esc(f.n)}</li>`).join('')}</ol>
        <p class="psheet__why">${esc(q.why)}</p>
        <button class="psheet__next mono" data-hover>${last ? 'Ver resultado' : 'Siguiente mensaje'}${icon('arrowRight')}</button>
      </div>`
    sheet.querySelector('.psheet__next').addEventListener('click', next)
    sheet.scrollTop = 0
    sheetOpen = true

    // Sube la tarjeta lo justo para que las marcas queden visibles encima de la hoja
    const scr = phone.querySelector('.phone__screen').getBoundingClientRect()
    const sheetTop = scr.bottom - sheet.offsetHeight
    const marks = [...card.querySelectorAll('.qf')].map((el) => el.getBoundingClientRect())
    let shift = 0
    if (marks.length) {
      const top = Math.min(...marks.map((r) => r.top))
      const bottom = Math.max(...marks.map((r) => r.bottom))
      shift = Math.min(0, sheetTop - 14 - bottom)
      shift = Math.max(shift, scr.top + 64 - top)
    }

    gsap.timeline()
      .to(actions, { autoAlpha: 0, y: 20, duration: 0.3 }, 0)
      .to(card, { y: shift, duration: 0.8, ease: 'expo.out' }, 0)
      .fromTo(sheet, { yPercent: 105 }, { yPercent: 0, duration: 0.75, ease: 'expo.out' }, 0)
      .fromTo(sheet.querySelectorAll('.psheet__in > *, .psheet__flags li'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'expo.out' }, 0.12)
  }

  function next() {
    if (!sheetOpen) return
    sheetOpen = false
    const q = items[i]
    const dir = q.scam ? -1 : 1
    gsap.timeline({
      onComplete: () => {
        i++
        if (i >= items.length) showResult()
        else load()
      },
    })
      .to(sheet, { yPercent: 105, duration: 0.45, ease: 'power3.in' })
      .to(card, { x: dir * 460, rotation: dir * 20, opacity: 0, duration: 0.6, ease: 'power3.in' }, 0.1)
  }

  // ───────── Resultado final ─────────
  function showResult() {
    hud()
    const n = items.length
    const ratio = score / n
    const C = 2 * Math.PI * 52
    const msg =
      ratio === 1
        ? 'Impecable. Tienes el radar afinado: ahora enséñaselo a tu familia.'
        : ratio >= 0.75
          ? 'Muy bien. Repasa las señales de los que has fallado y serás imbatible.'
          : 'Los estafadores cuentan con que no nos fijemos. Repasa estos dossiers y vuelve a intentarlo.'
    const failed = [...new Set(items.filter((_, k) => !answers[k]).map((q) => q.related))]
      .map((id) => scams.find((s) => s.id === id))
      .filter(Boolean)

    result.innerHTML = `
      <span class="presult__k mono">Resultado</span>
      <div class="presult__ring">
        <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="presult__track" /><circle cx="60" cy="60" r="52" class="presult__bar" style="stroke-dasharray:${C};stroke-dashoffset:${C}" /></svg>
        <div class="presult__num"><b>0</b><span>/ ${n}</span></div>
      </div>
      <p class="presult__msg">${msg}</p>
      ${failed.length ? `<p class="presult__lbl mono">Repasa</p><div class="presult__links">${failed.map((s) => `<a href="#/${s.id}" data-hover>${esc(s.title)}${icon('arrowRight')}</a>`).join('')}</div>` : ''}
      <button class="presult__again mono" data-hover>${icon('rotateCcw')}Repetir</button>`
    result.classList.toggle('is-perfect', ratio === 1)
    result.querySelector('.presult__again').addEventListener('click', restart)
    slot.replaceChildren()
    setButtons(false)
    gsap.set(actions, { autoAlpha: 0 })

    const num = result.querySelector('.presult__num b')
    const o = { v: 0 }
    gsap.timeline()
      .set(result, { display: 'flex' })
      .fromTo(result, { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .fromTo(result.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'expo.out' }, 0.1)
      .to(result.querySelector('.presult__bar'), { strokeDashoffset: C * (1 - ratio), duration: 1.6, ease: 'expo.inOut' }, 0.3)
      .to(o, { v: score, duration: 1.6, ease: 'expo.inOut', onUpdate: () => (num.textContent = Math.round(o.v)) }, 0.3)
    scene?.pulse(ratio === 1 ? 0.5 : 0.8)
  }

  function restart() {
    gsap.to(result, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        gsap.set(result, { display: 'none' })
        i = 0
        score = 0
        answers = []
        load()
      },
    })
  }

  // ───────── Deslizar la tarjeta ─────────
  function bindDrag(el) {
    let sx = 0
    let dx = 0
    let dragging = false
    el.addEventListener('pointerdown', (e) => {
      if (locked || e.button > 0) return
      dragging = true
      sx = e.clientX
      dx = 0
      el.setPointerCapture(e.pointerId)
      gsap.killTweensOf(el)
      el.classList.add('is-drag')
    })
    el.addEventListener('pointermove', (e) => {
      if (!dragging) return
      dx = e.clientX - sx
      gsap.set(el, { x: dx, rotation: dx * 0.05 })
      gsap.set(stamps.scam, { opacity: clamp(-dx / SWIPE), scale: 1.25 - clamp(-dx / SWIPE) * 0.25 })
      gsap.set(stamps.legit, { opacity: clamp(dx / SWIPE), scale: 1.25 - clamp(dx / SWIPE) * 0.25 })
      phone.style.setProperty('--tint', String(gsap.utils.clamp(-1, 1, dx / SWIPE)))
    })
    const end = () => {
      if (!dragging) return
      dragging = false
      el.classList.remove('is-drag')
      gsap.to(phone, { '--tint': 0, duration: 0.5 })
      if (Math.abs(dx) > SWIPE) answer(dx < 0 ? 'scam' : 'legit')
      else {
        gsap.to(el, { x: 0, rotation: 0, duration: 0.4, ease: 'expo.out' })
        gsap.to([stamps.scam, stamps.legit], { opacity: 0, duration: 0.3 })
      }
    }
    el.addEventListener('pointerup', end)
    el.addEventListener('pointercancel', end)
  }

  btns.forEach((b) => b.addEventListener('click', () => answer(b.dataset.answer)))

  // Teclado: solo cuando el juego está en pantalla y no hay un dossier abierto
  window.addEventListener('keydown', (e) => {
    const r = root.getBoundingClientRect()
    const inView = r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.5
    if (!inView || document.documentElement.classList.contains('has-dossier')) return
    if (e.key === 'ArrowLeft') answer('scam')
    else if (e.key === 'ArrowRight') answer('legit')
    else if (e.key === 'Enter' && sheetOpen) next()
    else return
    e.preventDefault()
  })

  // Empieza cuando el juego entra en pantalla, para que se vea llegar el primer mensaje
  gsap.set(result, { display: 'none' })
  gsap.set(sheet, { yPercent: 105 })
  hud()
  let started = false
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true
        load()
        io.disconnect()
      }
    },
    { threshold: 0.35 }
  )
  io.observe(phone)
}
