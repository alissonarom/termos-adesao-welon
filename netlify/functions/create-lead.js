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
} else {
  // 🔥 Atualiza os novos campos se estiverem vazios
  if (!lead.instagram) lead.instagram = instagram
  if (!lead.whatsapp) lead.whatsapp = whatsapp
  if (!lead.email) lead.email = email
  if (!lead.name) lead.name = name

  await lead.save()
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
