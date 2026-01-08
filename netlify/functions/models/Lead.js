const mongoose = require('mongoose')

const LeadSchema = new mongoose.Schema({
  name: String,
  cpfCnpj: { type: String, unique: true },
  email: String,

  registeredAt: Date,
  acceptedTerms: { type: Boolean, default: false },
  acceptedAt: Date,

  isSendMail: { type: Boolean, default: false },
  mailSentAt: Date,
  mailError: String
})

  module.exports =
  mongoose.models.Cliente ||
  mongoose.model('Cliente', LeadSchema, 'clientes')