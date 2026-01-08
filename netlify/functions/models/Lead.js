const mongoose = require('mongoose')

const LeadSchema = new mongoose.Schema({
  name: String,
  cpfCnpj: { type: String, unique: true },
  email: String,

  registeredAt: Date,
  acceptedTerms: { type: Boolean, default: false },
  acceptedAt: Date,

  checkoutClickedAt: Date,
  isPaid: { type: Boolean, default: false },

  isSendMail: { type: Boolean, default: false },
  sendMailAt: Date
})

  module.exports =
  mongoose.models.Cliente ||
  mongoose.model('Cliente', LeadSchema, 'clientes')