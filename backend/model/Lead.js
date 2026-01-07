const mongoose = require('mongoose')

const LeadSchema = new mongoose.Schema({
  name: String,
  cpfCnpj: { type: String, unique: true },
  email: String,

  acceptedTerms: { type: Boolean, default: false },
  acceptedAt: Date,

  checkoutClicked: { type: Boolean, default: false },
  checkoutClickedAt: Date,

  paid: { type: Boolean, default: false },

  source: String, // cadastro | cadastro-pago
  termsVersion: { type: String, default: 'v1.0' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
})

module.exports = mongoose.model('Lead', LeadSchema)
