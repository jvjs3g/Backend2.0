import { Router } from 'express';

 import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import { getCustomRepository, Repository } from 'typeorm';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const userTransaction = new CreateTransactionService();
const deleteTransaction  = new DeleteTransactionService();

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transaction = await transactionRepository.find();

  return response.json(transaction);
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const { title,value,type,category_id } = request.body;

  const transaction = await userTransaction.execute({
    title,
    value,
    type,
    category_id
  });

  response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const { id } = request.params;
 const deleted = await deleteTransaction.execute({
  id,
 });
 response.status(200);
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
