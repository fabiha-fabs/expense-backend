import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { Expense } from './entity/expense.entity';
import { ExpenseCreateRequest } from './request/expense.request';

@Injectable()
export class ExpenseService {
    constructor(
        @InjectRepository(Expense)
        private expenseRepository: Repository<Expense>,
      ) {}

      async createExpense(userCreateRequest: ExpenseCreateRequest): Promise<Expense>{
        const expense: Expense = this.expenseRepository.create(userCreateRequest);
        const expenseResponse: Expense = await this.expenseRepository.save(expense);
        return plainToClass(Expense, expenseResponse);
      }

      async findAll(): Promise<Expense[]> {
        return await this.expenseRepository.find();
      }
    
      async findOne(expenseId: number): Promise<Expense> {
        const expenseFindById: Expense = await this.expenseRepository.findOne(expenseId);
        return expenseFindById;
      }
    
      async remove(id: number): Promise<void> {
        await this.expenseRepository.delete(id);
      }

      async updateUser(id: number, expenseCreateRequest: ExpenseCreateRequest){
        await this.expenseRepository.update(id, expenseCreateRequest);
        const updatedExpense: Expense = await this.expenseRepository.findOne(id);
        return plainToClass(ExpenseCreateRequest, updatedExpense);
      }

      async getPagination(perPageDataCnt: number, pageNumber: number){
        return await this.expenseRepository.find({
          skip: (pageNumber - 1) * perPageDataCnt,
          take: perPageDataCnt,
        });
      }
      
}
