import { dbConnection} from "./dbConnection";
import { transactionSchema } from "../schema/transactionSchema";

export async function createTransactionsTable(){
    let connection = await dbConnection();
    const [rows, fields] = await connection.query(transactionSchema);
    
}


