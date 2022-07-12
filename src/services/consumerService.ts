import amqp from "amqplib";
import dotenv from "dotenv";
dotenv.config();

export class ConsumerService {


    public static async receiveCompletedTransaction() {
        try {
            const queueName = process.env.COMPLETED_TRANSACTION_QUEUE;
            const connection = await amqp.connect(process.env.QUEUE_URL);
            const channel = await connection.createChannel();
            await channel.assertQueue(queueName, { durable: true });

            channel.consume(queueName, async (message: any) => {
                channel.ack(message);
                const transactionData = JSON.parse(message.content.toString());
                console.log('Billing consumer serice receieved::: ', transactionData);
                // await TransactionService.updateTransactionStatus(messageData);

            })

        } catch (error) {
            console.error(error);
        }
    }


}

