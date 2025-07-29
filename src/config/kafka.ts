import { Consumer, EachMessagePayload, Kafka } from "kafkajs";
import { MessageBroker } from "../types/broker";
import { handleProductCreateUpdate } from "../productCache/handleProductCreateUpdate";
import { handleToppingCreateUpdate } from "../toppingCache/handleToppingCreateUpdate";

export class KafkaMessageBroker implements MessageBroker {

    private consumer: Consumer

    constructor(clientId: string, brokers: string[]) {
        const kafka = new Kafka({ clientId, brokers })
        this.consumer = kafka.consumer({ groupId: clientId })
    }

    connectConsumer = async () => {
        await this.consumer.connect()
    }

    disconnectConsumer = async () => {
        await this.consumer.disconnect()
    }

    consumeMessage = async (topics: string[], fromBeginning: boolean = false) => {
        await this.consumer.subscribe({ topics, fromBeginning })
        await this.consumer.run({
            eachMessage: async ({ topic, message, partition }: EachMessagePayload) => {
                switch (topic) {
                    case "product": {
                        handleProductCreateUpdate(message.value.toString())
                        break
                    };
                    case "topping": {
                        handleToppingCreateUpdate(message.value.toString())
                        break
                    }
                }
                console.log({
                    topic,
                    message: message.value.toString(),
                    partition
                });
            }
        })
    }
}