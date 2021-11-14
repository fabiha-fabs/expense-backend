import { Expense } from 'src/expense/entity/expense.entity';
import { User } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  groupId: number;

  @Column({ unique: true })
  groupName: string;

  @Column()
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];

  @OneToMany(() => Expense, (expense) => expense.expenseGroup)
  expenses: Expense[];

  @ManyToOne(() => User, (user) => user.createdGroups)
  creator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
