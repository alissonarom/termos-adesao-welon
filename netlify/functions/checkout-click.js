const result = await Lead.findOneAndUpdate(
  { cpfCnpj },
  { checkoutClickedAt: new Date() },
  { new: true }
)

return {
  statusCode: 200,
  body: JSON.stringify({
    success: true,
    checkoutClickedAt: result.checkoutClickedAt
  })
}
