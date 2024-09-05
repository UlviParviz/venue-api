import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  var transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 2525,
    auth: {
      user: "fisfusfoz@gmail.com",
      pass: "rsbw tjxx nqat epiy",
    },
  });

  const message = {
    from: `${"noreply"} <${"noreply@gmail.com"}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transport.sendMail(message);
};

export default sendEmail;
