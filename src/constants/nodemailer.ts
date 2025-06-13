import nodemailer from "nodemailer";

const sendMailNodemailer = async (from: string, to: string, subject: string, html: string) => {
    console.log("sendMailNodemailer")
  try {

    let transporter = await nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: "sarabhaiit2@gmail.com",
        pass: 'vbuqpzyimsexevtm',
      },
    });

    let info = await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: html,
    });

    console.log("Message sent: %s", info.messageId);
    return info.messageId;
  } catch (error:any) {
    console.log("Mail Status :", error.message);
    return false;
  }
}

export default sendMailNodemailer;
