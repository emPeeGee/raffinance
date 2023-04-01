import { CategoryModel } from 'features/categories';
import { TagModel } from 'features/tags';

export enum TransactionType {
  'INCOME' = 1,
  'EXPENSE' = 2,
  'TRANSFER' = 3
}

// TODO:MOVE from account model
export interface TransactionModel {
  id: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  amount: number;
  description: string;
  location: string;
  toAccountId: number;
  transactionTypeId: number;
  category: CategoryModel;
  tags: TagModel[];
}

export interface TransactionDetailsModel {
  id: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  amount: number;
  description: string;
  location: string;
  toAccountId: number;
  transactionTypeId: number;
  category: CategoryModel;
  tags: TagModel[];
}

export interface CreateTransactionDTO {
  date: string;
  amount: number;
  description: string;
  location: string;
  toAccountId: number;
  transactionTypeId: number;
  category: number;
  tags: number[];
}
