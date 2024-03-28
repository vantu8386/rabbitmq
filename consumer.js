// // consumer.js

// const amqplib = require("amqplib");
// const EmailService = require("./email.service"); // Import EmailService từ email.service.js
// const amqp_url =
//   "amqps://opglhnfw:pWyCayaOw4AZxqTLTsaE1zoWtpcelFxn@armadillo.rmq.cloudamqp.com/opglhnfw";

// const receiveQueue = async () => {
//   try {
//     const conn = await amqplib.connect(amqp_url);
//     const channel = await conn.createChannel();
//     const nameQueue = "emailOTP";
//     await channel.assertQueue(nameQueue, {
//       durable: true,
//     });
//     await channel.consume(
//       nameQueue,
//       async (msg) => { 
//         console.log(`msg::`, msg.content.toString());
//         const { email, subject } = JSON.parse(msg.content.toString());
//         try {
//           await EmailService.sendMail(email, subject);
//           channel.ack(msg);
//         } catch (error) {
//           console.error("Lỗi khi gửi email:", error);
         
//         }
//       },
//       {
//         noAck: true, 
//       }
//     );
//   } catch (error) {
//     console.log("Lỗi khi thiết lập kết nối:", error);
//   }
// };

// receiveQueue();

const amqplib = require("amqplib");
const EmailService = require("./email.service"); // Import EmailService từ email.service.js
const amqp_url = "amqps://opglhnfw:pWyCayaOw4AZxqTLTsaE1zoWtpcelFxn@armadillo.rmq.cloudamqp.com/opglhnfw";

const receiveQueue = async () => {
  try {
    const conn = await amqplib.connect(amqp_url);
    const channel = await conn.createChannel();
    const nameQueue = "emailOTP";
    await channel.assertQueue(nameQueue, {
      durable: true,
    });
    await channel.consume(
      nameQueue,
      async (msg) => { 
        console.log(`msg::`, msg.content.toString());
        const { email, subject } = JSON.parse(msg.content.toString());
        try {
          await EmailService.sendMail(email, subject);
          // Xác nhận xử lý tin nhắn thành công trước khi gỡ bỏ khỏi hàng đợi
          channel.ack(msg);
        } catch (error) {
          console.error("Lỗi khi gửi email:", error);
          // Nếu có lỗi xảy ra trong quá trình gửi email, bạn có thể không gỡ bỏ tin nhắn khỏi hàng đợi
          // Hoặc xử lý lỗi một cách phù hợp tại đây trước khi gỡ bỏ tin nhắn
        }
      },
      {
        noAck: false, // Đảm bảo rằng mã sẽ tự động gỡ bỏ tin nhắn sau khi xử lý xong hoặc gặp lỗi
      }
    );
  } catch (error) {
    console.log("Lỗi khi thiết lập kết nối:", error);
  }
};

receiveQueue();
