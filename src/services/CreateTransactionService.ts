import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';


interface Request{
  title:string;
  value:number;
  type:'income'|'outcome';
  category_id:string;
}
class CreateTransactionService {
  public async execute({title, value,type, category_id} :Request): Promise<Transaction> {
    // TODO

    const transactionRepository = getRepository(Transaction);

     const transaction = await transactionRepository.create({
       title,
       value,
       type,
       category_id
     });

     return transaction;
  }
}

export default CreateTransactionService;
