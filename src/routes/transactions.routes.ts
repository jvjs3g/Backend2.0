import { Router } from 'express';
import Category from '../models/Category'
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import { getCustomRepository, Repository, Transaction } from 'typeorm';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const userTransaction = new CreateTransactionService();
const deleteTransaction  = new DeleteTransactionService();

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionRepository = getCustomRepository(TransactionsRepository);

  const categpry = new Category();
  const transaction = await transactionRepository.find();
  const balance = await transactionRepository.getBalance()
  return response.json({
    transaction,
    balance
  });
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const { title,value,type,category } = request.body;


  const  { id} = await userTransaction.execute({
    title,
    value,
    type,
    category
  });


  response.json({
    id,
    title,
    value,
    type,
    category
  });
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
