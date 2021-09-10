import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { User } from './entity/users.entity';
import { UserCreateRequest } from './request/users.request';
import { UserCreateResponse } from './response/users.response';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
      ) {}

      async createUser(userCreateRequest: UserCreateRequest): Promise<UserCreateResponse>{
        const user: User = this.usersRepository.create(userCreateRequest);
        const userResponse: User = await this.usersRepository.save(user);
        return plainToClass(UserCreateResponse, userResponse);
      }
      async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
      }
    
      async findOne(userId: number): Promise<User> {
        const userFindById: User = await this.usersRepository.findOne(userId);
        return userFindById;
      }
    
      async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
      }

      async updateUser(id: number, userCreateRequest: UserCreateRequest){
        await this.usersRepository.update(id, userCreateRequest);
        const updatedUser: User = await this.usersRepository.findOne(id);
        return plainToClass(UserCreateResponse, updatedUser);
      }

      async getPagination(perPageDataCnt: number, pageNumber: number){
        return await this.usersRepository.find({
          skip: (pageNumber - 1) * perPageDataCnt,
          take: perPageDataCnt,
        });
      }

      async findUserByUserName(username: string): Promise<User | undefined> {
        return await this.usersRepository.findOne({
          where: {
            userName: username,
          }
        });
      }
}
