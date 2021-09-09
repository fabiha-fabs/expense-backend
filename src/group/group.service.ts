import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { Group } from './entity/group.entity';
import { GroupCreateRequest, GroupUpdateRequest } from './request/group.request';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
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
        const groupFindById: Group = await this.groupRepository.findOne(groupId);
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
}
