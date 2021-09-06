
import { Group } from "src/group/entity/group.entity";
import { User } from "src/users/entity/users.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Expense{

    @PrimaryGeneratedColumn()
    expenseId: number;
  
    @Column()
    expenseName: string;
  
    @Column()
    description: string;

    @ManyToOne(() => User, user => user.expenses)
    expenseUser: User;

    @OneToMany(() => Group, group => group.groupId)
    expenseGroup: Group[];

    @Column()
    amount: number;

    @Column({default: () => 'CURRENT_TIMESTAMP'})
    expenseDate: Date;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
 
    @DeleteDateColumn()
    deletedAt: Date;

 
}