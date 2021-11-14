import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ExpenseService } from './expense.service';
import {
  ExpenseCreateRequest,
  ExpenseFilterRequest,
  ExpenseUpdateRequest,
} from './request/expense.request';

@UseGuards(JwtAuthGuard)
@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Post('/create')
  async createExpense(@Body() expenseRequest: ExpenseCreateRequest) {
    console.log('create expense request method=', expenseRequest);
    return await this.expenseService.createExpense(expenseRequest);
  }

  @Get('/expenseall')
  async expenseAll() {
    console.log('expenseall expense request method call--');
    return await this.expenseService.findAll();
  }

  @Get('/findexpense/:id')
  async getExpenseById(@Param('id', ParseIntPipe) expenseId: number) {
    console.log('get expense by expenseId request method call--');
    return await this.expenseService.findOne(expenseId);
  }

  @Delete('/delete/:id')
  async deleteExpense(@Param('id', ParseIntPipe) expenseId: number) {
    console.log('delete expense ' + expenseId + ' request method call--');
    await this.expenseService.remove(expenseId);
    return 'delete expense ' + expenseId;
  }

  @Put('/update/:id')
  async updateExpense(
    @Param('id', ParseIntPipe) expenseId: number,
    @Body() expenseUpdateRequest: ExpenseUpdateRequest,
  ) {
    console.log('update expense ' + expenseId + ' request method call--');
    return await this.expenseService.updateExpense(
      expenseId,
      expenseUpdateRequest,
    );
  }

  @Get('/paginated')
  async getPaginated(@Query() request: ExpenseFilterRequest) {
    return await this.expenseService.getPagination(
      request.perPageDataCnt,
      request.pageNumber,
    );
  }
}
