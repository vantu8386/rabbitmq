// publisher.js
const dotenv = require("dotenv");

dotenv.config();

const open = require("amqplib").connect(process.env.AMQP_SERVER);

const queue = "emailOTP";

// Publisher
// const publishMessage = (payload) =>
//   open
//     .then((connection) => connection.createChannel())
//     .then((channel) =>
//       channel
//         .assertQueue(queue)
//         .then(() =>
//           channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)))
//         )
//     )
//     .catch((error) => console.warn(error));

// module.exports = publishMessage;
const publishMessage = (payload) =>
  open
    .then((connection) => connection.createChannel())
    .then((channel) =>
      channel.assertQueue(queue).then(() => {
        return new Promise((resolve, reject) => {
          channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
            persistent: true, // Đảm bảo tin nhắn có thể được gửi lại sau khi máy chủ RabbitMQ khởi động lại
            contentType: "application/json", // Xác định kiểu dữ liệu của tin nhắn
          }, (error, ok) => {
            if (error !== null) reject(error);
            else resolve();
          });
        });
      })
    )
    .catch((error) => console.warn(error));

module.exports = publishMessage;
