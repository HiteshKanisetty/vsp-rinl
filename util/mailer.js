const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail", // or your SMTP provider
  secure: true,
  port: 465,
  auth: {
    user: "hiteshkanisetty5@gmail.com",
    pass: "zmkt lfeb hufw dmxi",
  },
});

exports.sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: "hiteshkanisetty5@gmail.com", // sender address
    to,
    subject, // use the subject passed to the function
    html, // html body
  });
};
