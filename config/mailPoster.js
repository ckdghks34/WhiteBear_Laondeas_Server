import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const mailPoster = nodeMailer.createTransport({
  service: process.env.mail_service,
  host: process.env.mail_host,
  port: process.env.mail_port,
  auth: {
    user: process.env.mail_auth_user,
    pass: process.env.mail_auth_password,
  },
});

async function sendMail(email, title, content) {
  let mailOption = {
    from: process.env.mail_auth_user,
    to: email,
    subject: title,
    text: content,
  };

  mailPoster.sendMail(mailOption, (err, info) => {
    if (err) {
      console.log(err);
      return false;
    }

    console.log(info);
    return true;
  });
}

export { mailPoster, sendMail };
