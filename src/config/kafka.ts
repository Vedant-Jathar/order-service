import { Consumer, EachMessagePayload, Kafka, KafkaConfig, Producer } from "kafkajs";
import { MessageBroker } from "../types/broker";
import { handleProductCreateUpdate } from "../productCache/handleProductCreateUpdate";
import { handleToppingCreateUpdate } from "../toppingCache/handleToppingCreateUpdate";
import config from "config"

export class KafkaMessageBroker implements MessageBroker {

    private consumer: Consumer
    private producer: Producer

    constructor(clientId: string, brokers: string[]) {
        let kafkaConfig: KafkaConfig = {
            clientId,
            brokers
        }

        if (process.env.NODE_ENV === "production") {
            kafkaConfig = {
                ...kafkaConfig,
                ssl: true,
                connectionTimeout: 45000,
                sasl: {
                    mechanism: "plain",
                    username: config.get("kafka.sasl.username"),
                    password: config.get("kafka.sasl.password")
                }
            }
        }
        const kafka = new Kafka(kafkaConfig)
        this.producer = kafka.producer()
        this.consumer = kafka.consumer({ groupId: clientId })
    }

    connectProducer = async () => {
        await this.producer.connect()
    }

    connectConsumer = async () => {
        await this.consumer.connect()
    }

    disconnectProducer = async () => {
        await this.producer.disconnect()
    }

    disconnectConsumer = async () => {
        await this.consumer.disconnect()
    }

    sendMessage = async (topic: string, message: string, key?: string) => {
        const data: { value: string, key?: string } = {
            value: message
        }

        if (key) {
            data.key = key
        }

        await this.producer.send({
            topic,
            messages: [data]
        })
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