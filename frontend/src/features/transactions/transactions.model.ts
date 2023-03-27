import { Category } from 'features/categories';
import { Tag } from 'features/tags';

// TODO: Global type
export type ViewMode = 'table' | 'card';

export enum TransactionType {
  'INCOME' = 1,
  'EXPENSE' = 2,
  'TRANSFER' = 3
}

// TODO:MOVE from account model
export interface Transaction {
  id: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  amount: number;
  description: string;
  location: string;
  toAccountId: number;
  transactionTypeId: number;
  category: Category;
  tags: Tag[];
}
