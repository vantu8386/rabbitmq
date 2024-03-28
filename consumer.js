// consumer.js

const amqplib = require("amqplib");
const EmailService = require("./email.service"); // Import EmailService từ email.service.js
const amqp_url =
  "amqps://opglhnfw:pWyCayaOw4AZxqTLTsaE1zoWtpcelFxn@armadillo.rmq.cloudamqp.com/opglhnfw";

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
      async (msg) => { // Chúng ta cần thêm từ khóa "async" ở đây để có thể sử dụng await trong phần xử lý tin nhắn
        console.log(`msg::`, msg.content.toString());
        const { email, subject, message } = JSON.parse(msg.content.toString()); // Lấy dữ liệu từ tin nhắn
        try {
          await EmailService.sendMail(email, subject, message); // Gọi hàm sendMail từ EmailService và sử dụng await để chờ kết quả
          channel.ack(msg);
        } catch (error) {
          console.error("Lỗi khi gửi email:", error);
          // Không xác nhận tin nhắn nếu có lỗi xảy ra, để tin nhắn được xử lý lại sau này
        }
      },
      {
        noAck: false, // Đặt noAck thành false để yêu cầu xác nhận khi xử lý tin nhắn
      }
    );
  } catch (error) {
    console.log("Lỗi khi thiết lập kết nối:", error);
  }
};

receiveQueue();