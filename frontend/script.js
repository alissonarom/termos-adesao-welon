const API = '/.netlify/functions/create-lead'
let cpfGlobal = ''

const acceptCheckbox = document.getElementById('acceptTerms')
const acceptBtn = document.getElementById('acceptBtn')
const welcomeName = document.getElementById('welcomeName')

acceptCheckbox.addEventListener('change', e => {
  acceptBtn.disabled = !e.target.checked
})

function setStep(n) {
  document.querySelectorAll('.step').forEach((s, i) =>
    s.classList.toggle('active', i === n - 1)
  )

  document.querySelectorAll('section').forEach(s => (s.hidden = true))
  document.getElementById(`step-${n}`).hidden = false
}

async function register() {
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
    welcomeName.innerText = `Olá, ${data.name}`
  }

  if (data.acceptedTerms) {
    setStep(3)
  } else {
    setStep(2)
  }
}

async function acceptTerms() {
  await fetch(`${API}/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cpfCnpj: cpfGlobal })
  })

  setStep(3)
}

async function goToCheckout() {
  await fetch('/.netlify/functions/checkout-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cpfCnpj: cpfGlobal })
  })

  window.location.href =
    'https://invoice.infinitepay.io/plans/wb-welon/lSh1kjPZb'
}
