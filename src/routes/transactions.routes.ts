import { Router } from 'express';
import multer from 'multer';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import { getCustomRepository } from 'typeorm';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';
const upload = multer(uploadConfig);
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

  await deleteTransaction.execute(id);


 response.status(200).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute(request.file.path);

    return response.json(transactions);
  },
);


export default transactionsRouter;
