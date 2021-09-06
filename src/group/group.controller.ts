import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { Group } from './entity/group.entity';
import { GroupService } from './group.service';
import { GroupCreateRequest, GroupFilterRequest, GroupUpdateRequest } from './request/group.request';

@Controller('group')
export class GroupController {
    constructor(
        private groupService: GroupService,
      ) {}

    @Post("/create")
    async createGroup(@Body() groupRequest: GroupCreateRequest){
        console.log("create group request method=", groupRequest) ;
        return await this.groupService.createGroup(groupRequest);
    }

    @Get("/groupall")
    async groupAll() {
        console.log("groupall group request method call--") ;
        return await this.groupService.findAll();
    }

    @Get("/findgroup/:id")
    async getGroupById(@Param('id', ParseIntPipe) groupId: number){
        console.log("get group by groupId request method call--") ;
        return await this.groupService.findOne(groupId);
    }

    @Delete("/delete/:id")
    async deleteGroup(@Param('id', ParseIntPipe) groupId: number){
        console.log("delete group "+groupId+" request method call--") ;
        /* const groupExits: Group = await this.groupService.findOne(groupId);
        if(groupExits === null)
            "group "+groupId + " does not exist.."; */
        await this.groupService.remove(groupId);
        return "delete group "+groupId ;
    }

    @Put("/update/:id")
    async updateGroup(@Param('id', ParseIntPipe) groupId: number, @Body() groupUpdateRequest: GroupUpdateRequest){
        console.log("update group "+groupId+" request method call--") ;
        return await this.groupService.updateGroup(groupId, groupUpdateRequest);
    }

    @Get("/paginated")
    async getPaginated(@Query() request: GroupFilterRequest) {
        return await this.groupService.getPagination(request.perPageDataCnt, request.pageNumber);
    }
}
