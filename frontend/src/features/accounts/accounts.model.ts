export type ViewMode = 'table' | 'card';

export interface AccountModel {
  id: number;
  name: string;
  currency: string;
  balance: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}
