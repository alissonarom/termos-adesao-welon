const express = require('express')
const Lead = require('../models/Lead')
const router = express.Router()

// CADASTRO
router.post('/', async (req, res) => {
  const { name, cpfCnpj, email } = req.body
  const source = req.headers['x-source'] || 'cadastro'

  let lead = await Lead.findOne({ cpfCnpj })

  if (!lead) {
    lead = await Lead.create({
      name,
      cpfCnpj,
      email,
      source,
      paid: source === 'paid'
    })
  }

  lead.updatedAt = new Date()
  await lead.save()

  res.json({
    exists: true,
    acceptedTerms: lead.acceptedTerms,
    checkoutClicked: lead.checkoutClicked,
    paid: lead.paid
  })
})

// ACEITE DO TERMO
router.post('/accept', async (req, res) => {
  const { cpfCnpj } = req.body

  await Lead.updateOne(
    { cpfCnpj },
    {
      acceptedTerms: true,
      acceptedAt: new Date(),
      updatedAt: new Date()
    }
  )

  res.json({ success: true })
})

// CLIQUE NO CHECKOUT
router.post('/checkout-click', async (req, res) => {
  const { cpfCnpj } = req.body

  await Lead.updateOne(
    { cpfCnpj },
    {
      checkoutClicked: true,
      checkoutClickedAt: new Date(),
      updatedAt: new Date()
    }
  )

  res.json({ success: true })
})

module.exports = router
