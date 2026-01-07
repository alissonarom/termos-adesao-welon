require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./functions/db')

const app = express()
connectDB()

app.use(cors())
app.use(express.json())

app.use('/api/lead', require('./routes/leads'))

app.listen(process.env.PORT, () =>
  console.log(`API rodando na porta ${process.env.PORT}`)
)
