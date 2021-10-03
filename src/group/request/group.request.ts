import { Optional } from "@nestjs/common";
import { IsNotEmpty } from "class-validator";
import { User } from "src/users/entity/users.entity";

export class GroupCreateRequest{

    @IsNotEmpty()
    groupName: string;

    @Optional()
    description: string;

}

export class GroupUpdateRequest{

    @IsNotEmpty()
    groupName: string;
    
    @Optional()
    description: string;
}

export class GroupFilterRequest{

    perPageDataCnt: number;

    pageNumber: number;
    
  }

  export class GroupAddUsersRequest{

    @IsNotEmpty()
    userIDsArr: number[];

    @IsNotEmpty()
    groupID: number;

  }