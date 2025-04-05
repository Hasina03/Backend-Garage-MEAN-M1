const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.HOST_MAIL_TRAP,
    port: process.env.PORT_MAIL_TRAP,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

const sendResetPasswordEmail = (email, resetLink) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Réinitialisation de votre mot de passe",
        text: `Cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetLink}`,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendResetPasswordEmail;
