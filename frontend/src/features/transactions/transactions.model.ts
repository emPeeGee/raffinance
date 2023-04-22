import { CategoryModel } from 'features/categories';
import { TagModel } from 'features/tags';

export enum TransactionType {
  'INCOME' = 1,
  'EXPENSE' = 2,
  'TRANSFER' = 3
}

export interface TransactionModel {
  id: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  amount: number;
  description: string;
  location: string;
  toAccountId: number;
  fromAccountId: number;
  transactionTypeId: TransactionType;
  category: CategoryModel;
  tags: TagModel[];
}

export interface CreateTransactionDTO {
  date: Date;
  amount: number;
  description: string;
  location: string;
  toAccountId: number;
  fromAccountId?: number;
  transactionTypeId: number;
  categoryId: number;
  tagIds: number[];
}

export interface TransactionFilterModel {
  dateRange: [Date | null, Date | null];
  description: string;
  type: string;
  categories: string[];
  tags: string[];
  accounts: string[];
}
