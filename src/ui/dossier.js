import gsap from 'gsap'
import { accent, pad } from './render.js'

// Panel a pantalla completa con la "página" de cada estafa. URL: #/id-de-la-estafa
export class Dossier {
  constructor({ scams, scene, lenis }) {
    this.scams = scams
    this.scene = scene
    this.lenis = lenis
    this.el = document.querySelector('.dossier')
    this.panel = this.el.querySelector('.dossier__panel')
    this.veil = this.el.querySelector('.dossier__veil')
    this.current = null
    this.lastFocus = null
    this.navigatedInApp = false

    this.el.querySelector('.dossier__close').addEventListener('click', () => this.requestClose())
    this.veil.addEventListener('click', () => this.requestClose())
    this.el.querySelector('.dossier__side').addEventListener('click', () => this.requestClose())
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.current) this.requestClose()
    })
  }

  get isOpen() {
    return !!this.current
  }

  fill(scam) {
    const i = this.scams.indexOf(scam)
    const prev = this.scams[(i - 1 + this.scams.length) % this.scams.length]
    const next = this.scams[(i + 1) % this.scams.length]
    const block = scam.block === 'delitos' ? 'Delitos informáticos' : 'Fraudes cotidianos'
    const q = (s) => this.el.querySelector(s)

    this.el.style.setProperty('--accent', accent(scam.hue))
    q('.dossier__crumb').textContent = `${block} / ${pad(i + 1)}`
    q('.dossier__bignum').textContent = pad(i + 1)
    q('.dossier__tag').textContent = scam.tag
    q('.dossier__title').textContent = scam.title
    q('.dossier__short').textContent = scam.short
    q('[data-field="que"]').textContent = scam.que
    q('[data-field="ejemplo"]').textContent = scam.ejemplo
    const list = (sel, items) => {
      const el = q(sel)
      el.replaceChildren(...items.map((t) => Object.assign(document.createElement('li'), { textContent: t })))
    }
    list('[data-field="como"]', scam.como)
    list('[data-field="senales"]', scam.senales)
    list('[data-field="consejos"]', scam.consejos)
    const p = q('.dossier__prev')
    const n = q('.dossier__next')
    p.href = `#/${prev.id}`
    p.querySelector('strong').textContent = prev.title
    n.href = `#/${next.id}`
    n.querySelector('strong').textContent = next.title
    document.title = `${scam.title} · CIBERESTAFAS`
  }

  open(id) {
    const scam = this.scams.find((s) => s.id === id)
    if (!scam) return
    const switching = this.isOpen
    this.current = scam
    this.scene?.focus(scam)

    const items = this.panel.querySelectorAll('.dossier__tag, .dossier__title, .dossier__short, .dsec, .dossier__nav')

    if (switching) {
      gsap.timeline()
        .to(items, { opacity: 0, y: -20, duration: 0.3, stagger: 0.02, ease: 'power2.in' })
        .add(() => {
          this.fill(scam)
          this.panel.scrollTop = 0
        })
        .fromTo(items, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' })
      gsap.fromTo('.dossier__bignum', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 1, ease: 'expo.out', delay: 0.3 })
      return
    }

    this.fill(scam)
    this.lastFocus = document.activeElement
    this.lenis?.stop()
    this.el.classList.add('is-open')
    document.documentElement.classList.add('has-dossier')
    this.el.setAttribute('aria-hidden', 'false')
    this.panel.scrollTop = 0

    gsap.killTweensOf([this.panel, this.veil, items])
    gsap.timeline()
      .to(this.veil, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0)
      .fromTo(this.panel, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.1, ease: 'expo.inOut' }, 0)
      .fromTo(items, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, stagger: 0.06, ease: 'expo.out' }, 0.55)
      .fromTo('.dossier__bignum', { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, 0.5)
    this.el.querySelector('.dossier__close').focus({ preventScroll: true })
  }

  // Si abrimos el dossier navegando dentro de la web, "cerrar" = volver atrás en el historial
  requestClose() {
    if (this.navigatedInApp) history.back()
    else {
      history.replaceState(null, '', location.pathname + location.search)
      this.close()
    }
  }

  close() {
    if (!this.current) return
    this.current = null
    this.navigatedInApp = false
    this.scene?.unfocus()
    document.documentElement.classList.remove('has-dossier')
    document.title = 'CIBERESTAFAS · Detecta, entiende y protege'
    gsap.timeline({
      onComplete: () => {
        this.el.classList.remove('is-open')
        this.el.setAttribute('aria-hidden', 'true')
      },
    })
      .to(this.panel, { clipPath: 'inset(0 0 0 100%)', duration: 0.9, ease: 'expo.inOut' }, 0)
      .to(this.veil, { opacity: 0, duration: 0.7 }, 0.2)
      .to('.dossier__bignum', { opacity: 0, duration: 0.4 }, 0)
    this.lenis?.start()
    this.lastFocus?.focus?.({ preventScroll: true })
  }
}
