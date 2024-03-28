const fs = require("fs");
const nodemailer = require("nodemailer");

module.exports = {
  async sendMail(to, subject) {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "nguyenvantu131197@gmail.com",
        pass: "fjyjxuvtfghsmqbw",
      },
    });

    // Sử dụng đường dẫn tuyệt đối đến file HTML
    const htmlFilePath = "../templateEmail/index.html"; // Thay thế bằng đường dẫn thực tế của bạn

    let mailOptions = {
      from: "nguyenvantu131197@gmail.com",
      to: to,
      subject: subject || "test1",
      html: fs.readFileSync(htmlFilePath, "utf-8"),
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
