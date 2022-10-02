import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Like, Repository } from 'typeorm';
import { User } from './entity/users.entity';
import { UserCreateRequest, UserFilterRequest } from './request/users.request';
import { UserCreateResponse } from './response/users.response';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(
    userCreateRequest: UserCreateRequest,
  ): Promise<UserCreateResponse> {
    const user: User = this.usersRepository.create(userCreateRequest);
    const userResponse: User = await this.usersRepository.save(user);
    return plainToClass(UserCreateResponse, userResponse);
  }
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(userId: number): Promise<User> {
    const user: User = await this.usersRepository.findOne(userId);
    /* const user: User = await this.usersRepository.findOne({
          where: {
            userId: userId
          },
          relations: ['group']
        }); */
    return user;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async updateUser(id: number, userCreateRequest: UserCreateRequest) {
    await this.usersRepository.update(id, userCreateRequest);
    const updatedUser: User = await this.usersRepository.findOne(id);
    return plainToClass(UserCreateResponse, updatedUser);
  }

  async getPagination(perPageDataCnt: number, pageNumber: number) {
    return await this.usersRepository.find({
      skip: (pageNumber - 1) * perPageDataCnt,
      take: perPageDataCnt,
    });
  }

  async getFilteredUsers(userFilterRequest: UserFilterRequest) {
    return await this.usersRepository.find({
      where: {
        ...(userFilterRequest.userName && {
          userName: Like(`${userFilterRequest.userName}%`),
        }),
        ...(userFilterRequest.emailId && {
          emailId: Like(`${userFilterRequest.emailId}%`),
        }),
        ...(userFilterRequest.contactNo && {
          contactNo: Like(`%${userFilterRequest.contactNo}%`),
        }),
        ...(userFilterRequest.country && {
          country: Like(`%${userFilterRequest.country}%`),
        }),
      },
      skip:
        (userFilterRequest.pageNumber - 1) * userFilterRequest.perPageDataCnt,
      take: userFilterRequest.perPageDataCnt,
    });
  }

  async findUserByUserName(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      where: {
        userName: username,
      },
    });
  }
}
