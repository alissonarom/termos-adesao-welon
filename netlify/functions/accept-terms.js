const connect = require('./db')
const Lead = require('./models/Lead')
const sendWelcomeEmail = require('./services/sendWelcomeMail')

exports.handler = async event => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405 }
  }

  try {
    await connect()

    const { cpfCnpj } = JSON.parse(event.body)

    if (!cpfCnpj) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'cpfCnpj é obrigatório' })
      }
    }

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
    await lead.save()

    // 🔥 RESPONDE IMEDIATAMENTE (UX)
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        name: lead.name,
        email: lead.email
      })
    }

    // ✉️ EMAIL CONTROLADO
    if (!lead.isSendMail) {
      sendWelcomeEmail(lead)
        .then(async () => {
          lead.isSendMail = true
          lead.mailSentAt = new Date()
          lead.mailError = null
          await lead.save()
        })
        .catch(async err => {
          console.error('Erro ao enviar email:', err.message)
          lead.mailError = err.message
          await lead.save()
        })
    }

    return response

  } catch (err) {
    console.error('Erro interno:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno ao salvar aceite' })
    }
  }
}
