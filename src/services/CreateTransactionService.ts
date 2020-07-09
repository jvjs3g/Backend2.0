import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';


interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {

  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
      const transactionsRepository = getCustomRepository(TransactionsRepository);
      
      if (type === 'outcome') {
        const balance = await transactionsRepository.getBalance();

        if (balance.total < value) {
          throw new AppError('Insuficient balance');
        }
      }
    
      const createCategory = new CreateCategoryService();
      
      const { id: category_id } = await createCategory.execute(category);

      const transaction = transactionsRepository.create({
        title, 
        value,
        type,
        category_id
      });

      await transactionsRepository.save(transaction);

      return transaction;
  }

}

export default CreateTransactionService;
