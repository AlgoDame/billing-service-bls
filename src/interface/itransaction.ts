export interface ITransaction {
    transaction_id: string,
    account_id: string,
    customer_id: number,
    amount: string,
    status: string,
    created_at: string,
    updated_at: string
}