import { getCustomRepository, getRepository } from 'typeorm';

import TransactionsRepository from "../repositories/TransactionsRepository";
import Transaction from '../models/Transaction';

class DeleteTransactionService {

  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);
    await transactionsRepository.delete(id);
    return;
  }

}

export default DeleteTransactionService;
