const API = '/.netlify/functions/create-lead'
let cpfGlobal = ''

document.getElementById('acceptTerms').addEventListener('change', e => {
  document.getElementById('acceptBtn').disabled = !e.target.checked
})

function setStep(n) {
  document.querySelectorAll('.step').forEach((s, i) =>
    s.classList.toggle('active', i === n - 1)
  )
  document.querySelectorAll('section').forEach(s => (s.hidden = true))
  document.getElementById(`step-${n}`).hidden = false
}

async function register() {
  cpfGlobal = document.getElementById('cpfCnpj').value

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name.value,
      cpfCnpj: cpfGlobal,
      email: email.value
    })
  })

  const data = await res.json()

  if (data.acceptedTerms) {
    setStep(3)
  } else {
    setStep(2)
  }
}

async function accept() {
  await fetch(`${API}/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cpfCnpj: cpfGlobal })
  })
  setStep(3)
}

await fetch('/.netlify/functions/checkout-click', {
  method: 'POST',
  body: JSON.stringify({ cpfCnpj })
})

  window.location.href =
    'https://invoice.infinitepay.io/plans/wb-welon/lSh1kjPZb'
    
document.getElementById('welcomeName').innerText =
  `Olá, ${response.name}`