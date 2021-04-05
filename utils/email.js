const nodemailer = require('nodemailer')
const MyError = require('../utils/myError')

const sendEmail = async (options) => {

    const config = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        tls: { secureProtocol: "TLSv1_method" },
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    }

    // console.log(config)

    var transporter = await nodemailer.createTransport(config)

    let info = await transporter.sendMail({
        from: `${options.from} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.html  
    })
    .then((resp) => {
        console.log(resp)
    })
    .catch(err => {
        console.log("ERRRRR", err)
        throw new MyError("Мэйл илгээхэд алдаа гарлаа", 404)
    })

    // console.log("Message sent: ", info.messageId)
}

module.exports = sendEmail