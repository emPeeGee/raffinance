export enum TransactionType {
  'INCOME' = 1,
  'EXPENSE' = 2,
  'TRANSFER' = 3
}

export interface AccountModel {
  id: number;
  name: string;
  currency: string;
  balance: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDTO {
  name: string;
  currency: string;
  balance: number;
  color: string;
}

export interface AccountDetailsModel {
  id: number;
  name: string;
  currency: string;
  balance: number;
  color: string;
  createdAt: string;
  updatedAt: string;
  transactions: Transaction[];
}

// TODO:MOVE from account model
interface Transaction {
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

interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
}

interface Tag {
  id: number;
  name: string;
  color: string;
  icon: string;
}
