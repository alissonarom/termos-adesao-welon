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

    const lead = await Lead.findOneAndUpdate(
      { cpfCnpj },
      {
        acceptedTerms: true,
        acceptedAt: new Date(),
        isSendMail: true
      },
      { new: true }
    )

    if (!lead) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Lead não encontrado' })
      }
    }

    // 🔥 RESPONDE PRIMEIRO
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        name: lead.name,
        email: lead.email
      })
    }

    // ✉️ EMAIL EM SEGUNDO PLANO (não quebra UX)
    sendWelcomeEmail(lead).catch(err => {
      console.error('Erro ao enviar email:', err)
    })

    return response

  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno ao salvar aceite' })
    }
  }
}
