const dotenv = require("dotenv");
const EmailService = require("./email.service");

dotenv.config();

const queue = "emailOTP";

const open = require("amqplib").connect(process.env.AMQP_SERVER);

// Publisher
const publishMessage = (payload) =>
  open
    .then((connection) => connection.createChannel())
    .then((channel) =>
      channel
        .assertQueue(queue)
        .then(() =>
          channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)))
        )
    )
    .catch((error) => console.warn(error));

// Consumer
const consumeMessage = () => {
  open
    .then((connection) => connection.createChannel())
    .then((channel) =>
      channel.assertQueue(queue).then(() => {
        console.log(
          " [*] Waiting for messages in %s. To exit press CTRL+C",
          queue
        );
        return channel.consume(
          queue,
          (msg) => {
            if (msg !== null) {
              const { mail, subject, template } = JSON.parse(
                msg.content.toString()
              );
              console.log(" [x] Received %s", mail);
              
              EmailService.sendMail(mail, subject, template)
                .then(() => {
                  console.log(" [x] Email sent successfully");
                  channel.ack(msg); // Xác nhận tin nhắn sau khi gửi email thành công
                })
                .catch((error) => {
                  console.error(" [!] Error sending email:", error);
               
                  channel.ack(msg);
                });
            }
          },
          {
            noAck: true, // Chỉ đặt noAck là false nếu bạn muốn xử lý tin nhắn một cách chính xác
          }
        );
      })
    )
    .catch((error) => console.error(" [!] Error consuming message:", error));
};


module.exports = {
  publishMessage,
  consumeMessage,
};
require("make-runnable");
