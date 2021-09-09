import { IsNotEmpty, IsOptional } from "class-validator";
import { Group } from "src/group/entity/group.entity";
import { User } from "src/users/entity/users.entity";

export class ExpenseCreateRequest{

    @IsNotEmpty()
    expenseName: string;
  
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    expenseUser: User;

    @IsOptional()
    expenseGroup: Group[];

    @IsNotEmpty()
    amount: number;

    @IsOptional()
    expenseDate: Date;
}

export class ExpenseFilterRequest{

    perPageDataCnt: number;

    pageNumber: number;
    
  }