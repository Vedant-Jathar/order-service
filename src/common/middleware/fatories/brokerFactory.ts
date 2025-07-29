import { KafkaMessageBroker } from "../../../config/kafka";
import { MessageBroker } from "../../../types/broker";
import config from "config"

export function createMessageBroker() {
    let messageBroker: MessageBroker = null

    if (!messageBroker) {
        messageBroker = new KafkaMessageBroker("order-service", [config.get("kafka.broker")])
    }

    return messageBroker
}