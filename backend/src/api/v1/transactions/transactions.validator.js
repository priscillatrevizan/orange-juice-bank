const Joi = require('joi');

const transactionSchema = Joi.object({
  stockId: Joi.number().integer().positive(),
  fixedIncomeId: Joi.string(),
  amount: Joi.number().integer().min(1).required(),
  type: Joi.string().valid('buy').required(),
}).xor('stockId', 'fixedIncomeId'); // só um pode estar presente

function validateTransaction(data) {
  return transactionSchema.validate(data);
}

module.exports = { validateTransaction };
