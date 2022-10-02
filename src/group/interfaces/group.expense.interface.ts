import { Expense } from 'src/expense/entity/expense.entity';
import { User } from '../../users/entity/users.entity';
export interface GroupExpenseUserInterface {
  groupName: string;
  description: string;
  isActive: boolean;
  creator: User;
  expenses: Expense[];
  users: UserWithPaidDue[];
}
export interface UserWithPaidDue {
  userId: number;
  userName: string;
  emailId: string;
  contactNo: string;
  country: string;
  paidDue: string;
}
