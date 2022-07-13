import amqp from "amqplib";
import dotenv from "dotenv";
import { TransactionHandler } from "./transactionsHandler";
dotenv.config();

export class ConsumerService {


    public static async receiveCompletedTransaction() {
        try {
            const queueName = process.env.COMPLETED_TRANSACTION_QUEUE;
            const connection = await amqp.connect(process.env.QUEUE_URL);
            const channel = await connection.createChannel();
            await channel.assertQueue(queueName, { durable: true });

            channel.consume(queueName, async (message: any) => {
                const transactionData = JSON.parse(message.content.toString());
                console.log('Billing consumer service receieved Completed Txn::: ', transactionData);
                await TransactionHandler.updateCompletedTransaction(transactionData);
                // channel.ack(message);

            }, { noAck: true }
            )

        } catch (error) {
            console.error("Error in billing service consumer class:: ", error);
        }
    }


}

