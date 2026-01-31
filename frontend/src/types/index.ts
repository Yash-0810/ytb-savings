export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  date: string;
  category?: string;
  payment_method?: string;
}

export interface DailyReport {
  date: string;
  totalDebits: number;
  totalCredits: number;
  balance: number;
}

export interface MonthlyReport {
  month: string;
  totalDebits: number;
  totalCredits: number;
  balance: number;
  transactions: Transaction[];
}

export interface AnnualReport {
  year: number;
  totalDebits: number;
  totalCredits: number;
  balance: number;
  monthlyData: MonthlyReport[];
}
