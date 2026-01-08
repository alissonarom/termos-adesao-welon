const connect = require('./db')
const Lead = require('./models/Lead')
const sendWelcomeMail = require('./services/sendWelcomeMail')

exports.handler = async event => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405 }
  }

  await connect()

  const { cpfCnpj } = JSON.parse(event.body)

  const lead = await Lead.findOne({ cpfCnpj })

  if (!lead) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Lead não encontrado' })
    }
  }

  // Atualiza aceite
  lead.acceptedTerms = true
  lead.acceptedAt = new Date()

  // Envia email apenas uma vez
  if (!lead.isSendMail) {
    await sendWelcomeMail({
      name: lead.name,
      email: lead.email
    })

    lead.isSendMail = true
    lead.sendMailAt = new Date()
  }

  await lead.save()

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      isSendMail: lead.isSendMail
    })
  }
}
