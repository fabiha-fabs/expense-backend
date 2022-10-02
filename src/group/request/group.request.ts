import { Optional } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entity/users.entity';

export class GroupCreateRequest {
  @IsNotEmpty()
  groupName: string;

  @Optional()
  description: string;
}

export class GroupUpdateRequest {
  @IsNotEmpty()
  groupName: string;

  @Optional()
  description: string;
}

export class GroupFilterRequest {
  perPage: number;
  pageNumber: number;
  groupName?: string;
}

export class GroupAddUsersRequest {
  @IsNotEmpty()
  userIDsArr: number[];

  @IsNotEmpty()
  groupID: number;
}
