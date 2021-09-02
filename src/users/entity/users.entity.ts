
import { Expense } from "src/expense/entity/expense.entity";
import { Group } from "src/group/entity/group.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;
  
    @Column({unique: true})
    userName: string;
  
    @Column()
    password: string;

    @Column({unique: true})
    emailId: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: null, nullable: true })
    contactNo?: string;

    @Column({ default: null, nullable: true })
    country?: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
 
    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => Group, group => group.groupUser)
    groups: Group[];

    @OneToMany(() => Expense, expense => expense.expenseUser)
    expenses: Expense[];

  }