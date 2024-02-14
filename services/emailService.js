
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ariryrazafimahandr@gmail.com',
        pass: 'Playhard@23'
    }
});

// Define a route to send emails
app.post('/send-email', (req, res) => {
    const { to, subject, text } = req.body;

    const mailOptions = {
        from: 'ariryrazafimahandr@gmail.com',
        to: 'ariryrazafimahandry@gmail.com',
        subject: "testing email",
        text: "testing email if working"
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully');
        }
    });
});

