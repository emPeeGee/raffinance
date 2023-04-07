import { TransactionModel } from 'features/transactions';

export interface AccountModel {
  id: number;
  name: string;
  currency: string;
  balance: number;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDTO {
  name: string;
  currency: string;
  balance: number;
  icon: string;
  color: string;
}

export interface AccountDetailsModel {
  id: number;
  name: string;
  currency: string;
  balance: number;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  transactions: TransactionModel[];
}
