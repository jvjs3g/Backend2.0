import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  
  public async getBalance(): Promise<Balance> {
    
    const income  = await this.getValue('income');
    const outcome = await this.getValue('outcome');

    const total = income - outcome;

    return { income, outcome, total };    
  }


  private async getValue(type: string): Promise<number> {
    const { result } = await this.createQueryBuilder("transaction")
        .select('SUM(transaction.value)', 'result')
        .where('type = :type', { type })
        .getRawOne(); 

    return Number(result);
  }

}

export default TransactionsRepository;
