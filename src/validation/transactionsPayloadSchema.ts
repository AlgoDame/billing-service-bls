import Joi from "joi";

export const transactionsSchema = Joi.object().keys({
    account_id: Joi.string().required(),
    amount: Joi.number().required(),
    customer_id: Joi.number().required()

});

