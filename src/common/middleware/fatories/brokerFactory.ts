import { KafkaMessageBroker } from "../../../config/kafka";
import { MessageBroker } from "../../../types/broker";
import config from "config"

let messageBroker: MessageBroker = null

export function createMessageBroker() {
    if (!messageBroker) {
        messageBroker = new KafkaMessageBroker("order-service", [config.get("kafka.broker")])
    }
    return messageBroker
}
