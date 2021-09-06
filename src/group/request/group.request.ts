import { IsNotEmpty } from "class-validator";
import { User } from "src/users/entity/users.entity";

export class GroupCreateRequest{

    @IsNotEmpty()
    groupName: string;
 
    @IsNotEmpty()
    isActive: boolean;

   
    @IsNotEmpty()
    groupUser: User;

    //@OneToOne(() => User, user => user.groups)
    @IsNotEmpty()
    creator: User;
}

export class GroupUpdateRequest{

    @IsNotEmpty()
    groupName: string;
 
    @IsNotEmpty()
    isActive: boolean;

    @IsNotEmpty()
    groupUser: User;
}

export class GroupFilterRequest{

    perPageDataCnt: number;

    pageNumber: number;
    
  }