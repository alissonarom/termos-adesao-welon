const connect = require('./db')
const Lead = require('./models/Lead')

exports.handler = async event => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405 }
  }

  await connect()

  const { cpfCnpj } = JSON.parse(event.body || '{}')

  if (!cpfCnpj) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'cpfCnpj é obrigatório' })
    }
  }

  const result = await Lead.findOneAndUpdate(
    { cpfCnpj },
    { checkoutClickedAt: new Date(), isPaid: true },
    { new: true }
  )

  if (!result) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Lead não encontrado' })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      checkoutClickedAt: result.checkoutClickedAt
    })
  }
}
