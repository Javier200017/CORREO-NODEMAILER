const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const { EMAIL, PASSWORD } = require('../env.js')
const signup = async (req, res) => {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user, 
            pass: testAccount.pass,
        },
    });
    let message = {
        from: '"Fred Foo 👻" <foo@example.com>', 
        to: "bar@example.com, baz@example.com",
        subject: "Hello ✔", 
        text: "Successfully Register with us.", 
        html: "<b>Successfully Register with us.</b>",
      }
    transporter.sendMail(message).then((info) => {
        return res.status(201)
        .json({ 
            msg: "Has recibido un email...",
            info : info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })
}
const getbill = (req, res) => {
    const { userEmail } = req.body;
    let config = {
        service : 'gmail',
        auth : {
            user: EMAIL,
            pass: PASSWORD
        }
    }
    let transporter = nodemailer.createTransport(config);
    let MailGenerator = new Mailgen({
        theme: "default",
        product : {
            name: "Mailgen",
            link : 'https://mailgen.js/'
        }
    })
    let response = {
        body: {
            name : "Javier Mañez Fideli",
            intro: "Email de prueba",
            table : {
                data : [
                    {
                        item : "Scott Spark 970 2022",
                        description: "Bicicleta de Montaña",
                        price : "2600€",
                    }
                ]
            },
            outro: "Tienda de bicicletas de alto rendimiento"
        }
    }
    let mail = MailGenerator.generate(response)
    let message = {
        from : EMAIL,
        to : userEmail,
        subject: "Place Order",
        html: mail
    }
    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "Deberias recibir un email..."
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })
}

module.exports = {
    signup,
    getbill
}