const API = {
  createLead: '/.netlify/functions/create-lead',
  acceptTerms: '/.netlify/functions/accept-terms',
  checkout: '/.netlify/functions/checkout-click'
}
let cpfGlobal = ''

const acceptCheckbox = document.getElementById('acceptTerms')
const acceptBtn = document.getElementById('acceptBtn')
const welcomeName = document.getElementById('welcomeName')

acceptCheckbox.addEventListener('change', e => {
  acceptBtn.disabled = !e.target.checked
})

function setLoading(button, isLoading, text = 'Carregando...') {
  if (isLoading) {
    button.dataset.originalText = button.innerHTML
    button.classList.add('loading')
    button.innerHTML = `<span class="spinner"></span>${text}`
    button.disabled = true
  } else {
    button.classList.remove('loading')
    button.innerHTML = button.dataset.originalText
    button.disabled = false
  }
}

function setStep(step) {
  // Mostra apenas a section atual
  document.querySelectorAll('section').forEach(s => (s.hidden = true))
  document.getElementById(`step-${step}`).hidden = false

  // Progress bar
  const progressBar = document.getElementById('progressBar')
  const progressText = document.getElementById('progressText')

  const totalSteps = 3

  const progressMap = {
    1: 33,
    2: 66,
    3: 100
  }

  progressBar.style.width = `${progressMap[step]}%`
  progressText.innerText = `Etapa ${step} de ${totalSteps}`

  // Pulse animation
  progressBar.classList.remove('pulse')
  void progressBar.offsetWidth // força reflow
  progressBar.classList.add('pulse')

  // Scroll suave para o topo ao trocar de etapa (mobile-friendly)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function register() {
  const btn = document.getElementById('registerBtn')
  setLoading(btn, true, 'Cadastrando...')

  try {
    const nameValue = document.getElementById('name').value
    const emailValue = document.getElementById('email').value
    cpfGlobal = document.getElementById('cpfCnpj').value

    const res = await fetch(API.createLead, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameValue,
        cpfCnpj: cpfGlobal,
        email: emailValue
      })
    })

    const data = await res.json()

    if (data.name) {
      document.getElementById('welcomeName').innerText =
        `Olá, ${data.name}`
    }

    data.acceptedTerms ? setStep(3) : setStep(2)

  } catch (err) {
    alert('Erro ao cadastrar. Tente novamente.')
  } finally {
    setLoading(btn, false)
  }
}

async function acceptTerms() {
  const btn = document.getElementById('acceptBtn')
  setLoading(btn, true, 'Salvando aceite...')

  try {
    await fetch(API.acceptTerms, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpfCnpj: cpfGlobal })
    })

    setStep(3)

  } catch (err) {
    alert('Erro ao salvar aceite.')
  } finally {
    setLoading(btn, false)
  }
}

async function goToCheckout() {
  const btn = document.getElementById('checkoutBtn')
  setLoading(btn, true, 'Redirecionando...')

  try {
    const res = await fetch(API.checkout, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpfCnpj: cpfGlobal })
    })

    const data = await res.json()
    console.log('Checkout click response:', data)

    if (!res.ok) {
      throw new Error('Erro no endpoint de checkout')
    }

    // 🔴 PAUSA INTENCIONAL PARA DEBUG
    setTimeout(() => {
      window.location.href =
        'https://invoice.infinitepay.io/plans/wb-welon/lSh1kjPZb'
    }, 1500)

  } catch (err) {
    console.error(err)
    alert('Erro ao registrar clique.')
    setLoading(btn, false)
  }
}

