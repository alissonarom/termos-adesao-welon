const connect = require('./db')
const Lead = require('./models/Lead')

exports.handler = async event => {
  await connect()
  const { name, cpfCnpj, email } = JSON.parse(event.body)

  let lead = await Lead.findOne({ cpfCnpj })

  if (!lead) {
    lead = await Lead.create({
      name,
      cpfCnpj,
      email,
      registeredAt: new Date()
    })
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      acceptedTerms: lead.acceptedTerms,
      isPaid: lead.isPaid
    })
  }
}
