import { Expense } from 'src/expense/entity/expense.entity';
export interface GroupExpenseUserInterface {
  expenses: Expense[];
  users: UserWithPaidDue[];
}
export interface UserWithPaidDue {
  userId: number;
  userName: string;
  emailId: string;
  contactNo: string;
  country: string;
  paidDue: number;
}
