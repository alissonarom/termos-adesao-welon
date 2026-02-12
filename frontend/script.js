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
  const name = document.getElementById('name').value.trim()
  const email = document.getElementById('email').value.trim()
  const instagram = document.getElementById('instagram').value.trim()
  const whatsapp = document.getElementById('whatsapp').value.trim()
  const cpfCnpjRaw = document.getElementById('cpfCnpj').value
  const cpfCnpj = cpfCnpjRaw.replace(/\D/g, '')
  let userName = ''

  // VALIDAÇÕES
  if (!isValidName(name)) {
    alert('Informe um nome válido.')
    return
  }

  if (!isValidEmail(email)) {
    alert('Informe um e-mail válido.')
    return
  }

  if (whatsapp.length <= 1) {
    alert('Informe um whatsapp')
    return
  }

  if (instagram.length <= 1) {
    alert('Informe um instagram')
    return
  }

  if (cpfCnpj.length <= 11) {
    if (!isValidCPF(cpfCnpj)) {
      alert('CPF inválido.')
      return
    }
  } else {
    if (!isValidCNPJ(cpfCnpj)) {
      alert('CNPJ inválido.')
      return
    }
  }

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
      userName = data.name
    }

    data.acceptedTerms ? showSuccess() : setStep(2)

  } catch (err) {
    alert('Erro ao cadastrar. Tente novamente.')
  } finally {
    setLoading(btn, false)
  }
}

function showSuccess(name) {
  document.getElementById('successTitle').innerText =
    `Bem-vindo(a), ${name}`

  setStep(3)
}

async function acceptTerms() {
  const btn = document.getElementById('acceptBtn')
  setLoading(btn, true, 'Registrando aceite...')

  try {
    const res = await fetch(API.acceptTerms, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpfCnpj: cpfGlobal })
    })

    if (!res.ok) {
      throw new Error('Erro na API')
    }

    const data = await res.json()

    showSuccess(data.name)

  } catch (err) {
    console.error(err)
    alert('Erro ao salvar aceite.')
  } finally {
    setLoading(btn, false)
  }
}

const cpfCnpjInput = document.getElementById('cpfCnpj')

cpfCnpjInput.addEventListener('input', e => {
  let value = e.target.value.replace(/\D/g, '')

  // Limite duro de caracteres
  if (value.length > 14) {
    value = value.slice(0, 14)
  }

  if (value.length <= 11) {
    // CPF
    value = value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  } else {
    // CNPJ
    value = value
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  e.target.value = value
})

function isValidCPF(cpf) {
  cpf = cpf.replace(/\D/g, '')
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += cpf[i] * (10 - i)
  let d1 = (sum * 10) % 11
  if (d1 === 10) d1 = 0
  if (d1 != cpf[9]) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += cpf[i] * (11 - i)
  let d2 = (sum * 10) % 11
  if (d2 === 10) d2 = 0

  return d2 == cpf[10]
}

function isValidCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, '')
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false

  let length = cnpj.length - 2
  let numbers = cnpj.substring(0, length)
  let digits = cnpj.substring(length)
  let sum = 0
  let pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += numbers[length - i] * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result != digits[0]) return false

  length++
  numbers = cnpj.substring(0, length)
  sum = 0
  pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += numbers[length - i] * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  return result == digits[1]
}

function isValidName(name) {
  if (!name) return false
  name = name.trim()
  if (name.length < 3) return false
  if (!/[a-zA-ZÀ-ÿ]{2,}/.test(name)) return false
  return true
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

