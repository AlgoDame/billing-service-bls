import { Request } from "express";
import { transactionsSchema } from "../validation/transactionsPayloadSchema";
import { dbConnection } from "../db/dbConnection";
import ShortUniqueId from "short-unique-id";
import { PublisherService } from "./publisherService";
import { ITransaction } from "../interface/itransaction";
import axios from "axios";



export class TransactionHandler {

    public static validatePayload(req: Request) {
        const validation = transactionsSchema.validate(req.body);
        const { error } = validation;
        let failedValidation = error ? error.message : null;
        return failedValidation;
    }

    public static async processFunding(req: Request) {
        console.log("Transaction request received: ", req.body)

        const { account_id, amount, customer_id } = req.body;
        const uid = new ShortUniqueId({ length: 10 });
        let transaction_id = uid();

        let createTransactionQuery = `INSERT INTO transactions (transaction_id, account_id, customer_id, amount)
        VALUES (?, ?, ?, ?)`;

        let connection = await dbConnection();
        await connection.query(createTransactionQuery, [transaction_id, account_id, customer_id, amount]);

        let selectTransactionQuery = `SELECT * FROM transactions WHERE transaction_id = ?`;
        let [transactionResult] = await connection.query<any[]>(selectTransactionQuery, [transaction_id]);

        let transaction = transactionResult[0];
        let pendingTransactionQueue = process.env.PENDING_TRANSACTION_QUEUE!;

        await PublisherService.publishPendingTransaction(transaction, pendingTransactionQueue)

        return transaction;

    }

    public static async updateCompletedTransaction(transactionData: ITransaction) {
        let connection = await dbConnection();
        let receivedTxnId = transactionData.transaction_id;
        let selectTransactionQuery = `SELECT * FROM transactions WHERE transaction_id = ?`;
        let [queryResult] = await connection.query<any[]>(selectTransactionQuery, [receivedTxnId]);
        if (!queryResult.length) {
            console.log("Received transaction does not exist in database");
            return null;
        }

        let transaction = queryResult[0];
        let updateQuery = `UPDATE transactions SET status = ? WHERE transaction_id = ?`;
        let receievedStatus = transactionData.status;
        await connection.query<any[]>(updateQuery, [receievedStatus, receivedTxnId]);

        let requestBody = {
            transaction_id: transaction.transaction_id,
            account_id: transaction.account_id,
            customer_id: transaction.customer_id,
            amount: transaction.amount
        }

        let accountWebhookUrl = process.env.FUNDING_CALLBACK_URL!;
        let webhookResponse = await axios.post(accountWebhookUrl, requestBody);
        console.log("webhookResponse::: ", webhookResponse.data);

        return transaction;

    }



}
