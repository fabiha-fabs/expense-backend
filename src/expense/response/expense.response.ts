import { Exclude, Expose } from "class-transformer";
import { Group } from "src/group/entity/group.entity";
import { User } from "src/users/entity/users.entity";

// not used this class yet
@Exclude()
export class ExpenseCreateAndUpdateResponse{

    @Expose()
    expenseId: number;

    @Expose()
    expenseName: string;

    @Expose()
    description: string;

    @Expose()
    amount: number;

    @Expose()
    expenseGroup: Group;

    @Expose()
    expenseUser: User;

    @Expose()
    expenseDate: Date;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    deletedAt: Date;
}