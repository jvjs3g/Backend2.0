
import fs from 'fs';
import path from 'path';
import parse from 'csv-parse';

import Transaction from '../models/Transaction';
import fileUploadConfig from '../config/fileUploadConfig';
import { getCustomRepository, getRepository, In } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';


interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {


  public async execute(filename: string): Promise<Transaction[]> {
      const transactionsRepository = getCustomRepository(TransactionsRepository);
      const categoryRepository = getRepository(Category);
      const filePath = path.join(fileUploadConfig.directory, filename);

      const readCSVStream = fs.createReadStream(filePath);

      const parseStream = parse({
        from_line: 2,
        ltrim: true,
        rtrim: true,
      });

      const parseCSV = readCSVStream.pipe(parseStream);

      const transactions: CSVTransaction[] = [];
      const categories: string[] = [];

      parseCSV.on('data', async line => {
        const [title, type, value, category] = line.map((cell: string) =>
          cell.trim(),
        );

        if (!title || !type || !value) return;

        categories.push(category);

        transactions.push({ title, type, value, category });
      });

      await new Promise(resolve => parseCSV.on('end', resolve));

      const existentCategories = await categoryRepository.find({
        where: {
          title: In(categories),
        },
      });

      const existentCategoriesTitle = existentCategories.map(
        (category: Category) => category.title,
      );

      const addCategoryTitles = categories
        .filter(category => !existentCategoriesTitle.includes(category))
        .filter((value, index, self) => self.indexOf(value) === index);

      const newCategories = categoryRepository.create(
        addCategoryTitles.map(title => ({
          title,
        })),
      );

      await categoryRepository.save(newCategories);

      const finalCategories = [...existentCategories, ...newCategories];

      const createdTransactions = transactionsRepository.create(
        transactions.map(transaction => {
          const { title, type, value, category } = transaction;
          return {
            title,
            type,
            value,
            category: finalCategories.find(category => category.title === transaction.category)
          };
        })
      );

      await transactionsRepository.save(createdTransactions);
      await fs.promises.unlink(filePath);

      return createdTransactions; 
  } 

  /* public async execute(filename: string): Promise<Transaction[]> {
      const transactionsRepository = getCustomRepository(TransactionsRepository);
      const categoryRepository = getRepository(Category);
      const filePath = path.join(fileUploadConfig.directory, filename);

      const readCSVStream = fs.createReadStream(filePath);

      const parseStream = parse({
        from_line: 2,
        ltrim: true,
        rtrim: true,
      });

      const parseCSV = readCSVStream.pipe(parseStream);

      const transactions: CSVTransaction[] = [];
      const categories: string[] = [];

      parseCSV.on('data', async line => {
        const [title, type, value, category] = line.map((cell: string) =>
          cell.trim(),
        );

        if (!title || !type || !value) return;

        categories.push(category);

        transactions.push({ title, type, value, category });
      });

      await new Promise(resolve => parseCSV.on('end', resolve));

      const existentCategories = await categoryRepository.find({
        where: {
          title: In(categories),
        },
      });

      const existentCategoriesTitle = existentCategories.map(
        (category: Category) => category.title,
      );

      const addCategoryTitles = categories
        .filter(category => !existentCategoriesTitle.includes(category))
        .filter((value, index, self) => self.indexOf(value) === index);

      const newCategories = categoryRepository.create(
        addCategoryTitles.map(title => ({
          title,
        })),
      );

      await categoryRepository.save(newCategories);

      const finalCategories = [...existentCategories, ...newCategories];

      const createdTransactions = transactionsRepository.create(
        transactions.map(transaction => {
          const { title, type, value, category } = transaction;
          return {
            title,
            type,
            value,
            category: finalCategories.find(category => category.title === transaction.category)
          };
        })
      );

      await transactionsRepository.save(createdTransactions);
      await fs.promises.unlink(filePath);

      return createdTransactions; 
  }  */

}

export default ImportTransactionsService;
