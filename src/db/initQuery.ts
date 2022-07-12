import { createTransactionsTable } from "./createTransactionsTable";

export async function initSchemas() {
    await createTransactionsTable();

}