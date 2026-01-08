const connect = require('./db')
const Lead = require('./models/Lead')

exports.handler = async event => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405 }
  }

  await connect()

  const { name, cpfCnpj, email } = JSON.parse(event.body)

  if (!cpfCnpj || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'cpfCnpj e email são obrigatórios' })
    }
  }

  let lead = await Lead.findOne({ cpfCnpj })

  if (!lead) {
    lead = await Lead.create({
      name,
      cpfCnpj,
      email,
      registeredAt: new Date()
    })
  }

  document.getElementById('welcomeName').innerText =
    `Olá, ${lead.name}`

  return {
    statusCode: 200,
    body: JSON.stringify({
      name: lead.name,
      cpfCnpj: lead.cpfCnpj,
      email: lead.email,
      acceptedTerms: lead.acceptedTerms,
      isPaid: lead.isPaid
    })
  }
}
