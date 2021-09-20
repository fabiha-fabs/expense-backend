import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { User } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import { Group } from './entity/group.entity';
import { GroupAddUsersRequest, GroupCreateRequest, GroupUpdateRequest } from './request/group.request';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}

      async createGroup(groupCreateRequest: GroupCreateRequest): Promise<Group>{
        const group: Group = await this.groupRepository.create(groupCreateRequest);
        const groupResponse: Group = await this.groupRepository.save(group);
        return plainToClass(Group, groupResponse);
      }

      async findAll(): Promise<Group[]> {
        return await this.groupRepository.find();
      }
    
      async findOne(groupId: number): Promise<Group> {
        const groupFindById: Group = await this.groupRepository.findOne({
          where:{
            groupId: groupId,
          },
          relations: ['expenses'],
        });
        return groupFindById;
      }
    
      async remove(id: number): Promise<void> {
        await this.groupRepository.delete(id);
      }

      async updateGroup(id: number, groupUpdateRequest: GroupUpdateRequest){
        await this.groupRepository.update(id, groupUpdateRequest);
        const updatedGroup: Group = await this.groupRepository.findOne(id);
        return plainToClass(Group, updatedGroup);
      }

      async getPagination(perPageDataCnt: number, pageNumber: number){
        return await this.groupRepository.find({
          skip: (pageNumber - 1) * perPageDataCnt,
          take: perPageDataCnt,
        });
      }

      async addUsersToGroup(groupAddUsersRequest: GroupAddUsersRequest): Promise<Group>{
        const usersList: User[] = await this.userRepository.findByIds(groupAddUsersRequest.userIDsArr);
        const group: Group = await this.groupRepository.findOne({
          where:{
            groupId: groupAddUsersRequest.groupID
          },
          relations: ['users'],
        });
        const existingUserIds: number[] = group?.users.map((user) => user.userId);
        const newUsersToBeAdded = usersList.filter((user) => !existingUserIds.includes(user.userId));
        const usersToBeAdded: User[] = group?.users.concat(newUsersToBeAdded);
        group.users = usersToBeAdded;
        return await this.groupRepository.save(group);
      }

      async detachedUsersFromGroup(groupAddUsersRequest: GroupAddUsersRequest): Promise<Group>{
        const usersList: User[] = await this.userRepository.findByIds(groupAddUsersRequest.userIDsArr);
        const connectedUsersInGroup: Group = await this.groupRepository.findOne({
          where:{
            groupId: groupAddUsersRequest.groupID
          },
          relations: ['users']
        });
        const usersToRemain: User[] = connectedUsersInGroup
                                            ?.users
                                            ?.filter((user) => 
                                              !groupAddUsersRequest.userIDsArr.includes(user.userId));
        connectedUsersInGroup.users = usersToRemain;
        return await this.groupRepository.save(connectedUsersInGroup);
      }
}
