const connect = require('./db')
const Lead = require('./models/Lead')

exports.handler = async event => {
  await connect()
  const { cpfCnpj } = JSON.parse(event.body)

  await Lead.updateOne(
    { cpfCnpj },
    { checkoutClickedAt: new Date() }
  )

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  }
}
