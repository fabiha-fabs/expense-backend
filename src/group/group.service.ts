import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { skip } from 'rxjs';
import { Expense } from 'src/expense/entity/expense.entity';
import { User } from 'src/users/entity/users.entity';
import { In, Like, Repository } from 'typeorm';
import { Group } from './entity/group.entity';
import {
  GroupExpenseUserInterface,
  UserWithPaidDue,
} from './interfaces/group.expense.interface';
import {
  GroupAddUsersRequest,
  GroupCreateRequest,
  GroupFilterRequest,
  GroupUpdateRequest,
} from './request/group.request';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async createGroup(groupCreateRequest: GroupCreateRequest): Promise<Group> {
    const group: Group = await this.groupRepository.create(groupCreateRequest);
    const groupResponse: Group = await this.groupRepository.save(group);
    return plainToClass(Group, groupResponse);
  }

  async findAll(): Promise<Group[]> {
    return await this.groupRepository.find();
  }

  async findOne(groupId: number): Promise<GroupExpenseUserInterface> {
    const groupUserExpenseData: Group = await this.groupRepository.findOne({
      where: {
        groupId: groupId,
      },
      relations: ['expenses', 'expenses.expenseUser', 'users'],
    });
    const expense_user_map = {};
    let totalCost = 0;
    groupUserExpenseData?.expenses?.forEach((expense) => {
      if (expense.expenseUser.userId in expense_user_map) {
        expense_user_map[expense.expenseUser.userId] =
          parseFloat(expense_user_map[expense.expenseUser.userId]) +
          expense.amount;
      } else {
        expense_user_map[expense.expenseUser.userId] = expense.amount;
      }
      totalCost += expense.amount;
    });
    const usersListWIthPaidDues: UserWithPaidDue[] = [];
    const numberOfUsers: number = groupUserExpenseData?.users?.length;
    const averageCost: number = totalCost / numberOfUsers;
    groupUserExpenseData?.users?.forEach((user) => {
      let usersExpense = 0;
      if (expense_user_map[user.userId]) {
        usersExpense = expense_user_map[user.userId];
      }
      const userWithPaidDue: UserWithPaidDue = {
        userId: user.userId,
        userName: user.userName,
        emailId: user.emailId,
        contactNo: user.contactNo,
        country: user.country,
        paidDue: (usersExpense - averageCost).toFixed(2),
      };
      usersListWIthPaidDues.push(userWithPaidDue);
    });

    const groupExpenseUser: GroupExpenseUserInterface = {
      groupName: groupUserExpenseData.groupName,
      description: groupUserExpenseData.description,
      isActive: groupUserExpenseData.isActive,
      creator: groupUserExpenseData.creator,
      expenses: groupUserExpenseData.expenses,
      users: usersListWIthPaidDues,
    };
    return groupExpenseUser;
  }

  async remove(id: number): Promise<void> {
    await this.groupRepository.delete(id);
  }

  async updateGroup(id: number, groupUpdateRequest: GroupUpdateRequest) {
    await this.groupRepository.update(id, groupUpdateRequest);
    const updatedGroup: Group = await this.groupRepository.findOne(id);
    return plainToClass(Group, updatedGroup);
  }

  async getPagination(perPageDataCnt: number, pageNumber: number) {
    return await this.groupRepository.find({
      skip: (pageNumber - 1) * perPageDataCnt,
      take: perPageDataCnt,
    });
  }

  async addUsersToGroup(
    groupAddUsersRequest: GroupAddUsersRequest,
  ): Promise<Group> {
    const usersList: User[] = await this.userRepository.findByIds(
      groupAddUsersRequest.userIDsArr,
    );
    const group: Group = await this.groupRepository.findOne({
      where: {
        groupId: groupAddUsersRequest.groupID,
      },
      relations: ['users'],
    });
    const existingUserIds: number[] = group?.users.map((user) => user.userId);
    const newUsersToBeAdded = usersList.filter(
      (user) => !existingUserIds.includes(user.userId),
    );
    const usersToBeAdded: User[] = group?.users.concat(newUsersToBeAdded);
    group.users = usersToBeAdded;
    return await this.groupRepository.save(group);
  }

  async detachedUsersFromGroup(
    groupAddUsersRequest: GroupAddUsersRequest,
  ): Promise<Group> {
    const usersList: User[] = await this.userRepository.findByIds(
      groupAddUsersRequest.userIDsArr,
    );
    const connectedUsersInGroup: Group = await this.groupRepository.findOne({
      where: {
        groupId: groupAddUsersRequest.groupID,
      },
      relations: ['users'],
    });
    const usersToRemain: User[] = connectedUsersInGroup?.users?.filter(
      (user) => !groupAddUsersRequest.userIDsArr.includes(user.userId),
    );
    connectedUsersInGroup.users = usersToRemain;
    return await this.groupRepository.save(connectedUsersInGroup);
  }

  async calculateTotalCost(groupId: number) {
    if (!groupId) {
      throw new BadRequestException('Group Id must be provided');
    }
    const expenses: Expense[] = await this.expenseRepository.find({
      where: { expenseGroup: groupId },
    });
    let totalCost = 0;
    expenses.map((expense) => (totalCost += expense.amount));
    return totalCost;
  }

  async getFilteredGroups(groupFilterRequest: GroupFilterRequest) {
    const [data, count] = await this.groupRepository.findAndCount({
      where: {
        ...(groupFilterRequest.groupName && {
          groupName: Like(`${groupFilterRequest.groupName}%`),
        }),
      },
      skip: (groupFilterRequest.pageNumber - 1) * groupFilterRequest.perPage,
      take: groupFilterRequest.perPage,
    });
    return { data: data, count: count };
  }

  async getGroupJoinLeaveListForUser(
    groupFilterRequest: GroupFilterRequest,
    loggedUser: User,
  ) {
    const [data, count] = await this.groupRepository.findAndCount({
      where: {
        ...(groupFilterRequest.groupName && {
          groupName: Like(`${groupFilterRequest.groupName}%`),
        }),
      },
      relations: ['users'],
      skip: (groupFilterRequest.pageNumber - 1) * groupFilterRequest.perPage,
      take: groupFilterRequest.perPage,
    });
    return {
      data: data.map((groupData) =>
        Object.assign(groupData, {
          joined: this.isUserJoinedToGroup(groupData, loggedUser),
        }),
      ),
      count: count,
    };
  }

  isUserJoinedToGroup(group: Group, loggedUser: User): boolean {
    for (const user of group?.users) {
      if (user.userId == loggedUser.userId) {
        return true;
      }
    }
    return false;
  }

  async getJoinedGroupsListForCurrentUser(
    groupFilterRequest: GroupFilterRequest,
    loggedUser: User,
  ) {
    const user: User = await this.userRepository.findOne({
      where: { userId: loggedUser.userId },
      relations: ['groups'],
    });
    if (!user) {
      throw new BadRequestException('User not found!');
    }

    return {
      data: this.handleFilter(groupFilterRequest, user.groups),
      count: user?.groups?.length,
    };
  }

  handleFilter(
    groupFilterRequest: GroupFilterRequest,
    groups: Group[],
  ): Group[] {
    if (groupFilterRequest?.groupName?.length) {
      groups = groups.filter((group) =>
        group.groupName.startsWith(groupFilterRequest?.groupName),
      );
    }
    return groups?.slice(
      (groupFilterRequest.pageNumber - 1) * groupFilterRequest.perPage,
      groupFilterRequest.perPage,
    );
  }
}
