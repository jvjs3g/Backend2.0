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
  public async getBalance({income, outcome, total}:Balance): Promise<Balance> {
    // TODO

  return {
    income,
    outcome,
    total:income-outcome,
  }

  }
}

export default TransactionsRepository;
