// email.service.js
const fs = require("fs");
const nodemailer = require("nodemailer");
module.exports = {
  async sendMail(to, subject, message) {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "nguyenvantu131197@gmail.com",
        pass: "fjyjxuvtfghsmqbw",
      },
    });
    let mailOptions = {
      from: "nguyenvantu131197@gmail.com",
      to: to,
      subject: subject || "test",
      html: htmlContent,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(info);
          console.log("info:", info);
        }
      });
    });
  },
};
