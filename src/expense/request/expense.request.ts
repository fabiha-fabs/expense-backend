import { IsNotEmpty, IsOptional } from "class-validator";
import { Group } from "src/group/entity/group.entity";
import { User } from "src/users/entity/users.entity";

export class ExpenseCreateRequest{

    @IsNotEmpty()
    expenseName: string;
  
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    expenseGroup: Group;

    @IsOptional()
    expenseDate: Date;
}

export class ExpenseFilterRequest{

    perPageDataCnt: number;

    pageNumber: number;
    
  }

  export class ExpenseUpdateRequest{

    @IsNotEmpty()
    expenseName: string;
  
    @IsOptional()
    description: string;

    @IsNotEmpty()
    amount: number;

    @IsOptional()
    expenseDate: Date;
}