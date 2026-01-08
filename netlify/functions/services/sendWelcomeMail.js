const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

module.exports = async ({ name, email }) => {
  return transporter.sendMail({
    from: '"Ecossistema Welon" <contato@welon.com.br>',
    to: email,
    subject: 'Bem-vindo(a) ao Ecossistema Welon',
    html: `
      <div style="font-family: Arial, sans-serif; color:#062a5e; line-height:1.6">
        <h2>✨ Seja bem-vindo(a) ao <strong>Ecossistema Welon</strong> ✨</h2>

        <p>Olá, <strong>${name}</strong>,</p>

        <p>
          É um prazer ter você aqui.
        </p>

        <p>
          Ao garantir seu acesso, você não está apenas entrando em um grupo —
          você passa a fazer parte de um <strong>ecossistema estratégico de networking,
          visão e crescimento</strong>, criado para pessoas que entendem que
          <strong>conexões certas aceleram resultados</strong>.
        </p>

        <p>
          O <strong>Ecossistema Welon</strong> nasce com um propósito claro:
          reunir mentes inquietas, decisores, empresários e profissionais que
          jogam o jogo no longo prazo.
        </p>

        <p>
          📅 <strong>Dia 21 de fevereiro</strong> será o marco oficial desse movimento,
          com um <strong>jantar exclusivo no Pobre Ruan – Goiânia</strong>,
          pensado nos mínimos detalhes para proporcionar:
        </p>

        <ul>
          <li>Conexões de alto nível</li>
          <li>Conversas que abrem portas</li>
          <li>Experiências que posicionam</li>
        </ul>

        <p>
          Durante <strong>1 ano inteiro</strong>, você terá acesso a:
        </p>

        <ul>
          <li>Networking qualificado</li>
          <li>Trocas estratégicas</li>
          <li>Conteúdos, encontros e oportunidades fora do mercado comum</li>
        </ul>

        <p>
          Aqui, cada presença importa.<br>
          Cada conversa tem valor.<br>
          Cada conexão pode mudar o jogo.
        </p>

        <p>
          Sinta-se em casa — e, principalmente, <strong>no lugar certo</strong>.
        </p>

        <p style="margin-top:32px">
          Bem-vindo(a) ao <strong>Ecossistema Welon</strong>.<br>
          <strong>O próximo nível começa agora.</strong> 🥂✨
        </p>
      </div>
    `
  })
}
