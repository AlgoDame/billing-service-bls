import { Request, Response, Router } from "express";
import { TransactionsService } from "../services/transactionService";
import { authorize } from "../middleware/authVerifier";




export class BaseController {

    /**
     * Create the routes.
     *
     * @method loadRoutes
     */
    public loadRoutes(prefix: string, router: Router) {
        this.execFundAccount(prefix, router);


    }

    private execFundAccount(prefix: string, router: Router): any {
        router.post(prefix + "/transactions", authorize, async (req: Request, res: Response) => {
            new TransactionsService().fundAccount(req, res);
        });
    }



}
