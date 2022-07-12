import { Request, Response } from "express";
import { BaseService } from "./baseService";
import { TransactionHandler } from "./transactionsHandler";

export class TransactionsService extends BaseService {

    public async fundAccount(req: Request, res: Response) {
        try {
            let failedValidation = TransactionHandler.validatePayload(req);

            if (failedValidation) return this.sendError(req, res, 400, failedValidation);

            let response = await TransactionHandler.processFunding(req);
            


            return this.sendResponse(req, res, 200, response);

        } catch (error:any) {
            console.error(`Error occurred in transactionsService::: ${error}`);
            return this.sendError(req, res, 500, error.message);
        }
    }


}
