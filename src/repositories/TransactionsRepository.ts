import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';
import { Request } from 'express-serve-static-core';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO

    const transactions = await this.find();

    const income = transactions.reduce((previous, current) => {
      if(current.type == 'income'){
        return previous + current.value;
      }
      return previous;
    },0);

    const outcome = transactions.reduce((previous, current) => {
      if(current.type == 'outcome'){
        return previous + current.value;
      }

      return previous;
    },0);

    const total = income - outcome;

    return {
      total,
      income,
      outcome
    }
  }
}

export default TransactionsRepository;
