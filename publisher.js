// publisher.js
const dotenv = require("dotenv");

dotenv.config();

const open = require("amqplib").connect(process.env.AMQP_SERVER);

const queue = "emailOTP";

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

module.exports = publishMessage;
