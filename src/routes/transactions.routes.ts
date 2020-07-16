import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/fileUploadConfig';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';


const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();

  const balance = await transactionsRepository.getBalance();

  const transactionsList = {
    transactions,
    balance
  }

  return response.json(transactionsList);
});


transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const newTransaction = await createTransaction.execute({ title, value, type, category });

  response.status(200).json(newTransaction);
});


transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id)

  response.status(201).send();
});


transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const { filename } = request.file;
  const importTransactions = new ImportTransactionsService();

  const transactions = await importTransactions.execute(filename);

  return response.status(200).json(transactions);
});

export default transactionsRouter;
