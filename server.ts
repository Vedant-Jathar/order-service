import app from "./src/app";
import config from "config";
import logger from "./src/config/logger";
import connectDB from "./src/config/db";
import { MessageBroker } from "./src/types/broker";
import { createMessageBroker } from "./src/common/middleware/fatories/brokerFactory";

const startServer = async () => {
  const PORT = config.get("server.port") || 5503;

  let messagebroker: MessageBroker = null

  try {
    await connectDB();

    // Creating the consumer and reading the messages from the broker:
    messagebroker = createMessageBroker()
    await messagebroker.connectConsumer()
    await messagebroker.consumeMessage(["product", "topping"], true)

    app
      .listen(PORT, () => console.log(`Listening on port ${PORT}`))
      .on("error", (err) => {
        console.log("err", err.message);
        process.exit(1);
      });
  } catch (err) {
    if (messagebroker) {
      await messagebroker.disconnectConsumer()
    }
    logger.error("Error happened: ", err.message);
    process.exit(1);
  }
};

void startServer();
