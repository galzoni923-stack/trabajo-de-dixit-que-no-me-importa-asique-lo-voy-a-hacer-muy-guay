import gsap from 'gsap'
import { pad } from './render.js'
import { icon } from './icons.js'
import { scams } from '../data/content.js'

// ─────────────────────────────────────────────────────────────
//  Simulador "¿Qué harías tú?": hablas con un estafador y eliges
//  qué responder. Al final se rebobina la conversación con las
//  señales marcadas y se repasan tus decisiones.
// ─────────────────────────────────────────────────────────────

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ESC[c])
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const CHANNELS = { whatsapp: 'WhatsApp', wallapop: 'Wallapop', telegram: 'Telegram' }
const now = () => new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' }).format(new Date())
const initial = (name) => (name.replace(/[^A-Za-zÁÉÍÓÚÑ]/g, '').charAt(0) || '?').toUpperCase()

// Envuelve las señales del mensaje en marcas numeradas (se encienden en el repaso)
function mark(text, flags = [], found) {
  let html = esc(text)
  flags.forEach((f) => {
    const t = esc(f.t)
    const at = html.indexOf(t)
    if (at === -1) return
    found.push(f)
    html = `${html.slice(0, at)}<span class="qf" data-n="${found.length}">${t}</span>${html.slice(at + t.length)}`
  })
  return html
}

const wait = (s) => new Promise((resolve) => gsap.delayedCall(reduced ? Math.min(s, 0.05) : s, resolve))

export function initSimulator(stories, scene) {
  const root = document.getElementById('detecta')
  const $ = (s) => root.querySelector(s)
  const chat = $('.chat')
  const log = $('.chat__log')
  const choicesEl = $('.chat__choices')
  const riskBar = $('.chat__bar i')
  const riskNum = $('.chat__risk b')
  const list = $('.sim__stories')
  const scoreEl = $('.sim__score b')

  const results = {} // id → 'safe' | 'scammed'
  let story = null
  let risk = 0
  let found = []
  let decisions = []
  let token = 0 // invalida colas de mensajes antiguas al cambiar de historia
  let ending = null

  // ───────── Selector de historias ─────────
  list.replaceChildren(
    ...stories.map((s, i) => {
      const li = document.createElement('li')
      li.innerHTML = `<button class="story" data-id="${s.id}" data-hover>
        <span class="story__n mono">${pad(i + 1)}</span>
        <span class="story__t"><b>${esc(s.title)}</b><small class="mono">${CHANNELS[s.channel]}</small></span>
        <span class="story__s mono">Sin jugar</span></button>`
      li.querySelector('button').addEventListener('click', () => start(s.id))
      return li
    })
  )

  const updateList = () => {
    list.querySelectorAll('.story').forEach((b) => {
      const r = results[b.dataset.id]
      b.toggleAttribute('aria-current', b.dataset.id === story?.id)
      b.classList.toggle('is-safe', r === 'safe')
      b.classList.toggle('is-scammed', r === 'scammed')
      b.querySelector('.story__s').textContent = r === 'safe' ? 'Protegido' : r === 'scammed' ? 'Estafado' : 'Sin jugar'
    })
    scoreEl.textContent = Object.values(results).filter((r) => r === 'safe').length
  }

  const setRisk = (value) => {
    risk = Math.max(0, Math.min(100, value))
    gsap.to(riskBar, { scaleX: risk / 100, duration: 0.5, ease: 'expo.out' })
    riskNum.textContent = `${risk} %`
    chat.classList.toggle('is-risky', risk >= 60)
    scene?.setRisk?.(risk / 100)
  }

  const setChannel = (channel) => {
    chat.dataset.channel = channel
    $('.chat__chip').textContent = CHANNELS[channel]
  }

  const scrollDown = () => gsap.to(log, { scrollTop: log.scrollHeight, duration: reduced ? 0 : 0.5, ease: 'expo.out' })

  const add = (html, cls) => {
    const el = document.createElement('div')
    el.className = `msg ${cls}`
    el.innerHTML = html
    log.appendChild(el)
    gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' })
    scrollDown()
    return el
  }

  // ───────── Empezar una historia ─────────
  function start(id) {
    story = stories.find((s) => s.id === id)
    token++
    found = []
    decisions = []
    ending = null
    log.replaceChildren()
    choicesEl.replaceChildren()
    chat.classList.remove('is-ended')
    setChannel(story.channel)
    $('.chat__name').textContent = story.contact.name
    $('.chat__sub').textContent = story.contact.sub
    $('.chat__avatar').textContent = initial(story.contact.name)
    setRisk(10)
    updateList()
    add(`<span>Hoy · ${now()}</span>`, 'msg--date')
    play(story.start)
  }

  // ───────── Reproducir un nodo: mensajes con "escribiendo…" y respuestas ─────────
  async function play(nodeId) {
    const my = token
    const node = story.nodes[nodeId]
    if (node.end) return showEnding(node)
    if (node.channel) setChannel(node.channel)

    for (const m of node.msgs) {
      if (m.from === 'system') {
        await wait(0.4)
        if (my !== token) return
        add(`<p>${mark(m.text, m.flags, found)}</p>`, 'msg--sys')
        continue
      }
      const typing = add('<i></i><i></i><i></i>', 'msg--typing')
      await wait(Math.min(0.5 + m.text.length * 0.012, 1.5))
      if (my !== token) return
      typing.remove()
      add(`<p>${mark(m.text, m.flags, found)}</p><time>${now()}</time>`, 'msg--in')
      await wait(0.25)
      if (my !== token) return
    }
    showChoices(node)
  }

  function showChoices(node) {
    choicesEl.replaceChildren(
      ...node.choices.map((c, i) => {
        const b = document.createElement('button')
        b.className = 'reply'
        b.dataset.hover = ''
        b.innerHTML = `<kbd class="mono">${i + 1}</kbd><span>${esc(c.text)}</span>`
        b.addEventListener('click', () => choose(c))
        return b
      })
    )
    gsap.fromTo(choicesEl.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.4, ease: 'expo.out' })
  }

  function choose(c) {
    if (!choicesEl.children.length) return
    choicesEl.replaceChildren()
    decisions.push(c)
    add(`<p>${esc(c.text)}</p><time>${now()} ✓✓</time>`, 'msg--out')
    setRisk(risk + c.risk)
    if (c.verdict === 'bad') {
      scene?.pulse(0.7)
      gsap.fromTo($('.chat__risk'), { x: -6 }, { keyframes: { x: [-6, 5, -3, 0] }, duration: 0.35, ease: 'power2.out' })
    }
    play(c.next)
  }

  // ───────── Final: resultado, señales marcadas y repaso de decisiones ─────────
  async function showEnding(node) {
    const my = token
    ending = node
    // Se guarda el mejor resultado: explorar el camino malo no debe restar
    if (results[story.id] !== 'safe') results[story.id] = node.end
    updateList()
    chat.classList.add('is-ended')
    await wait(0.6)
    if (my !== token) return

    // Rebobina: sube al principio y enciende las marcas una a una
    const marks = log.querySelectorAll('.qf')
    await new Promise((resolve) => gsap.to(log, { scrollTop: 0, duration: reduced ? 0 : 0.8, ease: 'expo.inOut', onComplete: resolve }))
    if (my !== token) return
    gsap.to(marks, { '--on': 1, duration: 0.4, stagger: 0.2, ease: 'power2.out' })
    await wait(marks.length * 0.2 + 0.6)
    if (my !== token) return

    const safe = node.end === 'safe'
    const dossier = scams.find((s) => s.id === story.related)
    const card = add(
      `<span class="ending__tag mono">${icon(safe ? 'check' : 'alert')}${safe ? 'Protegido' : 'Estafado'}</span>
       <h3 class="ending__title">${esc(node.title)}</h3>
       ${node.loss ? `<p class="ending__loss">${esc(node.loss)}</p>` : ''}
       <p class="ending__text">${esc(node.text)}</p>
       ${found.length ? `<p class="ending__lbl mono">Señales que había</p>
       <ol class="ending__flags">${found.map((f, i) => `<li><span>${i + 1}</span>${esc(f.n)}</li>`).join('')}</ol>` : ''}
       <p class="ending__lbl mono">Tus decisiones</p>
       <ol class="ending__choices">${decisions
         .map((d) => `<li class="${d.verdict === 'good' ? 'is-good' : 'is-bad'}">${icon(d.verdict === 'good' ? 'check' : 'x')}<div><b>«${esc(d.text)}»</b><span>${esc(d.why)}</span></div></li>`)
         .join('')}</ol>`,
      `msg--ending ${safe ? 'is-safe' : 'is-scammed'}`
    )
    gsap.to(log, { scrollTop: card.offsetTop - 16, duration: reduced ? 0 : 0.8, ease: 'expo.inOut' })

    const nextStory = stories[(stories.indexOf(story) + 1) % stories.length]
    choicesEl.innerHTML = `
      <div class="chat__actions">
        <button class="act act--ghost" data-act="retry" data-hover>${icon('rotateCcw')}Probar otras decisiones</button>
        <button class="act" data-act="next" data-hover>Siguiente historia${icon('arrowRight')}</button>
        ${dossier ? `<a class="act act--link" href="#/${dossier.id}" data-hover>Ver dossier: ${esc(dossier.title)}${icon('arrowUpRight')}</a>` : ''}
      </div>`
    choicesEl.querySelector('[data-act="retry"]').addEventListener('click', () => start(story.id))
    choicesEl.querySelector('[data-act="next"]').addEventListener('click', () => start(nextStory.id))
    gsap.fromTo(choicesEl.querySelectorAll('.act'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.4, ease: 'expo.out' })
  }

  // Teclado: 1-3 para responder, Enter para la siguiente historia (solo con el simulador en pantalla)
  window.addEventListener('keydown', (e) => {
    const r = root.getBoundingClientRect()
    const inView = r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.5
    if (!inView || document.documentElement.classList.contains('has-dossier')) return
    if (e.target.closest('input, textarea')) return
    if (e.key === 'Enter' && e.target.closest('button, a')) return // Enter ya pulsa el botón con foco
    const n = Number(e.key)
    const replies = choicesEl.querySelectorAll('.reply')
    if (n >= 1 && n <= replies.length) {
      replies[n - 1].click()
      e.preventDefault()
    } else if (e.key === 'Enter' && ending) {
      choicesEl.querySelector('[data-act="next"]')?.click()
      e.preventDefault()
    }
  })

  // Empieza la primera historia cuando la sección entra en pantalla
  updateList()
  setRisk(0)
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !story) {
        start(stories[0].id)
        io.disconnect()
      }
    },
    { threshold: 0.35 }
  )
  io.observe(chat)
}
