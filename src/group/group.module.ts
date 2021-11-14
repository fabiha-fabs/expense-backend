import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from 'src/expense/entity/expense.entity';
import { User } from 'src/users/entity/users.entity';
import { Group } from './entity/group.entity';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User, Expense])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
