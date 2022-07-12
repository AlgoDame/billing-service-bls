import { Request } from "express";
import { transactionsSchema } from "../validation/transactionsPayloadSchema";
import { dbConnection } from "../db/dbConnection";
import ShortUniqueId from "short-unique-id";
import { PublisherService } from "./publisherService";



export class TransactionHandler {

    public static validatePayload(req: Request) {
        const validation = transactionsSchema.validate(req.body);
        const { error } = validation;
        let failedValidation = error ? error.message : null;
        return failedValidation;
    }

    public static async processFunding(req: Request) {
        console.log("Account Id::: ", req.body.account_id)
        console.log("Amount::: ", req.body.amount)
        console.log("Customer Id::: ", req.body.customer_id)

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




}
