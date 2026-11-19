import { blocks, scams, tips, sources, credits } from '../data/content.js'
import { icon } from './icons.js'

export const pad = (n) => String(n).padStart(2, '0')

// Construye en el DOM todo el contenido a partir de data/content.js
export function renderContent() {
  blocks.forEach((b) => {
    const sec = document.getElementById(b.id)
    sec.querySelector('.block__kicker').textContent = b.kicker
    sec.querySelector('.block__title').textContent = b.title
    sec.querySelector('.block__intro').textContent = b.intro
    const wrap = sec.querySelector(`[data-cards="${b.id}"]`)
    scams.forEach((s, i) => {
      if (s.block === b.id) wrap.appendChild(card(s, i))
    })
  })

  const list = document.querySelector('.tips__list')
  tips.forEach((t, i) => {
    const li = document.createElement('li')
    li.className = 'tip'
    li.innerHTML = `<span class="tip__n mono">${pad(i + 1)}</span><h3 class="tip__t">${t.t}</h3><p class="tip__d">${t.d}</p>`
    list.appendChild(li)
  })

  const src = document.querySelector('.sources__list')
  sources.forEach((s) => {
    const li = document.createElement('li')
    li.className = 'source'
    li.innerHTML = `<a href="${s.url}" target="_blank" rel="noopener noreferrer" data-hover data-cursor="Visitar">
      <span class="source__name">${s.name}</span>
      <span class="source__note">${s.note}</span>
      <span class="source__go mono">${new URL(s.url).hostname.replace('www.', '')}${icon('arrowUpRight')}</span></a>`
    src.appendChild(li)
  })

  document.querySelector('.credits__names').textContent = credits.authors.join(' · ')
  document.querySelector('.credits__course').textContent = credits.course
  document.querySelector('.hud__total').textContent = pad(document.querySelectorAll('[data-section]').length)
}

function card(s, i) {
  const a = document.createElement('a')
  a.className = 'card'
  a.href = `#/${s.id}`
  a.dataset.id = s.id
  a.dataset.hover = ''
  a.dataset.cursor = 'Abrir'
  a.innerHTML = `
    <div class="card__top mono"><span class="card__num">${pad(i + 1)}</span><span>${s.tag}</span></div>
    <h3 class="card__title">${s.title}</h3>
    <p class="card__short">${s.short}</p>
    <div class="card__foot mono"><span>Abrir dossier</span>${icon('arrowRight')}</div>`
  return a
}
