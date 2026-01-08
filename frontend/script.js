const API = '/.netlify/functions/create-lead'
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

function setStep(n) {
  document.querySelectorAll('.step').forEach((s, i) =>
    s.classList.toggle('active', i === n - 1)
  )

  document.querySelectorAll('section').forEach(s => (s.hidden = true))
  document.getElementById(`step-${n}`).hidden = false
}

async function register() {
  const btn = document.getElementById('registerBtn')
  setLoading(btn, true, 'Cadastrando...')

  try {
    const nameValue = document.getElementById('name').value
    const emailValue = document.getElementById('email').value
    cpfGlobal = document.getElementById('cpfCnpj').value

    const res = await fetch(API, {
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
    await fetch(`${API}/accept`, {
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
    await fetch('/.netlify/functions/checkout-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpfCnpj: cpfGlobal })
    })

    window.location.href =
      'https://invoice.infinitepay.io/plans/wb-welon/lSh1kjPZb'

  } catch (err) {
    alert('Erro ao registrar clique.')
    setLoading(btn, false)
  }
}
