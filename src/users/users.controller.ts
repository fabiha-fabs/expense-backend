import { Delete, ParseIntPipe, Put, Query, UseGuards, Request } from '@nestjs/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from './entity/users.entity';
import { UserCreateRequest, UserFilterRequest } from './request/users.request';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
      ) {}
      
    @Get()
    async getUsers(){
        return "fabiha-fabs 222" ;
    }

    @Post("/create")
    async createUser(@Body() userRequest: UserCreateRequest){
        console.log("create user request method=", userRequest) ;
        return await this.userService.createUser(userRequest);
    }

    @Get("/userall")
    async userAll(@Request() req) {
        console.log('User who executed request: ',req.user);
        console.log("userall user request method call--") ;
        return await this.userService.findAll();
    }

    @Get("/finduser/:id")
    async getUserById(@Param('id', ParseIntPipe) userId: number){
        console.log("get user by userId request method call--") ;
        return await this.userService.findOne(userId);
    }

    @Delete("/delete/:id")
    async deleteUser(@Param('id', ParseIntPipe) userId: number){
        console.log("delete user "+userId+" request method call--") ;
        await this.userService.remove(userId);
        return "delete user "+userId ;
    }

    @Put("/update/:id")
    async updateUser(@Param('id', ParseIntPipe) userId: number, @Body() userRequest: UserCreateRequest){
        console.log("update user "+userId+" request method call--") ;
        return await this.userService.updateUser(userId, userRequest);
    }

    @Get("/paginated")
    async getPaginated(@Query() request: UserFilterRequest) {
        return await this.userService.getPagination(request.perPageDataCnt, request.pageNumber);
    }
   
}
