import amqp from "amqplib";
import dotenv from "dotenv";
dotenv.config();

export class PublisherService {


    public static async publishPendingTransaction(message: any, queueName: string) {
        try {
            const connection = await amqp.connect(process.env.QUEUE_URL);
            const channel = await connection.createChannel();
            await channel.assertQueue(queueName);
            channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
            console.log(`Pending transaction successfully pushed to queue ${queueName} :: ${JSON.stringify(message)}`);

        } catch (error) {
            console.error(error);
        }
    }

    
}