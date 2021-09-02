import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GroupModule } from './group/group.module';
import { ExpenseModule } from './expense/expense.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(), UsersModule, GroupModule, ExpenseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
