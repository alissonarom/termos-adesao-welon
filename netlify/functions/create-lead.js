const connect = require('./db')
const Lead = require('./models/Lead')

exports.handler = async event => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405 }
  }

  await connect()

  const { name, cpfCnpj, email, instagram, whatsapp } = JSON.parse(event.body)

  if (!cpfCnpj || !email || !instagram || !whatsapp) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'cpfCnpj, email, instagram e whatsapp são obrigatórios' })
    }
  }

  let lead = await Lead.findOne({ cpfCnpj })

  if (!lead) {
    lead = await Lead.create({
      name,
      cpfCnpj,
      email,
      instagram,
      whatsapp,
      acceptedTerms: false,
      isPaid: false,
      registeredAt: new Date()
    })
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      name: lead.name,
      cpfCnpj: lead.cpfCnpj,
      email: lead.email,
      acceptedTerms: lead.acceptedTerms,
      isPaid: lead.isPaid,
      instagram: lead.instagram,
      whatsapp: lead.whatsapp
    })
  }
}
