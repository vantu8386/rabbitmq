// index.js
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const publishMessage = require("./publisher");
const { SendMailClient } = require("zeptomail");
var nodemailer = require("nodemailer");

const { json, urlencoded } = express;
const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

const url = "api.zeptomail.com/";
const token = process.env.TOKEN_ZEPTOPMAIL;
let client = new SendMailClient({ url, token });

var transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "nguyenvantu131197@gmail.com",
    // pass: "fjyjxuvtfghsmqbw",
    pass: "quiofyoolewttfgh",
  },
});

app.post("/api/v1/email", (req, res) => {
  const { email, subject } = req.body;

  var emailPayload = {
    email,
    subject,
  };

  publishMessage(emailPayload)
    .then(() => {
      console.log("Yêu cầu gửi email đã được đưa vào hàng đợi thành công");
      res.status(200).json({
        message: "Yêu cầu gửi email đã được đưa vào hàng đợi thành công",
      });
    })
    .catch((error) => {
      console.error("Lỗi khi đưa yêu cầu gửi email vào hàng đợi:", error);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    });
});

// app.listen
app.listen(3000, () => {
  console.log(`app running on port: 3000`);
});
