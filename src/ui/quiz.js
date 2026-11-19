import gsap from 'gsap'
import { pad } from './render.js'

// Mini-juego: "¿Estafa o legítimo?"
export function initQuiz(items, scene) {
  const root = document.querySelector('.quiz')
  const $ = (s) => root.querySelector(s)
  const msg = $('.msg')
  const verdict = $('.verdict')
  const answerBtns = root.querySelectorAll('[data-answer]')
  const nextBtn = $('[data-next]')
  let i = 0
  let score = 0
  let answered = false

  const show = () => {
    const q = items[i]
    answered = false
    $('.msg__channel').textContent = q.channel
    $('.msg__from').textContent = q.from
    $('.msg__body').textContent = q.body
    $('.quiz__step').textContent = `${pad(i + 1)} / ${pad(items.length)}`
    verdict.className = 'verdict'
    gsap.set(verdict, { opacity: 0, y: 20 })
    answerBtns.forEach((b) => (b.disabled = false))
    nextBtn.hidden = true
    gsap.fromTo(msg, { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'expo.out' })
  }

  const finish = () => {
    $('.msg__channel').textContent = 'Resultado'
    $('.msg__from').textContent = `${score} de ${items.length} aciertos`
    $('.msg__body').textContent =
      score === items.length
        ? 'Impecable. Tienes el radar afinado: ahora enséñaselo a tu familia.'
        : score >= items.length - 2
          ? 'Muy bien. Repasa las señales de alarma de los dossiers y serás imbatible.'
          : 'Ojo: los estafadores cuentan con que no nos fijemos. Repasa los dossiers y vuelve a intentarlo.'
    verdict.className = 'verdict'
    gsap.set(verdict, { opacity: 0 })
    answerBtns.forEach((b) => (b.disabled = true))
    nextBtn.hidden = false
    nextBtn.textContent = 'Repetir ↺'
    gsap.fromTo(msg, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' })
  }

  answerBtns.forEach((btn) =>
    btn.addEventListener('click', () => {
      if (answered) return
      answered = true
      const q = items[i]
      const saysScam = btn.dataset.answer === 'scam'
      const ok = saysScam === q.scam
      if (ok) score++
      $('.quiz__points').textContent = `ACIERTOS ${score}`
      verdict.classList.add(ok ? 'is-ok' : 'is-ko')
      $('.verdict__tag').textContent = `${ok ? '✓ Correcto' : '✕ Fallo'} · ${q.scam ? 'Es una estafa' : 'Es legítimo'}`
      $('.verdict__why').textContent = q.why
      answerBtns.forEach((b) => (b.disabled = true))
      nextBtn.hidden = false
      nextBtn.textContent = i === items.length - 1 ? 'Ver resultado →' : 'Siguiente →'
      gsap.to(verdict, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' })
      if (!ok) gsap.fromTo('.phone', { x: -10 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.25)' })
      scene?.pulse(ok ? 0.35 : 1)
    })
  )

  nextBtn.addEventListener('click', () => {
    if (i >= items.length - 1 && answered) {
      if (nextBtn.textContent.startsWith('Repetir')) {
        i = 0
        score = 0
        $('.quiz__points').textContent = 'ACIERTOS 0'
        show()
      } else finish()
      return
    }
    i++
    show()
  })

  show()
}
