import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { Task } from 'src/interfaces/task.interface';
import { CreateProjectDto } from 'src/models/dto/create-project.dto';
import { UpdateProjectDto } from 'src/models/dto/update-project.dto';
import { ProjectService } from 'src/services/project/project.service';
import { UserService } from 'src/services/user/user.service';
import { Socket } from 'socket.io';

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService:ProjectService,private readonly userService:UserService){}

    @Get('/:id')
    async getProjectsByUserId(@Param('id') userId,@Res() res:Response){
        const projects=await this.projectService.getProjectByUserId(userId);
        return res.status(HttpStatus.OK).json(projects);
    }

    @Get('/tasks/:id')
    async getTasks(@Param('id') projectId:string,@Res() res:Response){
        const tasks=await this.projectService.getTasks(projectId);
        return res.json(tasks);
    }


    @Post('/newProject')
    async createProject(@Body() createProject:CreateProjectDto,@Res() res:Response){
        const project=await this.projectService.createProject(createProject);
        return res.status(HttpStatus.OK).json(project);
    }

    @Patch('/:id/update')
    async updateProject(@Param('id') id:string,@Body() updateProject:UpdateProjectDto,@Res() res:Response){
        const updatedProject=await this.projectService.updateProject(id,updateProject);
        return res.status(HttpStatus.OK).json(updatedProject);
    }

    @Patch('/:id/newTask')
    async addTask(@Param('id') id:string,@Body()task:Task,@Res() res:Response){
        const project=await this.projectService.addTask(id,task.title,task.description);
        return res.json(project);
    }

    @Patch('/:id/deleteTask')
    async deleteTask(@Param('id') id:string,@Body()task:Task,@Res() res:Response){
        const project=await this.projectService.deleteTask(id,task.id);
        return res.json(project);
    }

    @Patch('/:id/newMember')
    async addMember(@Param('id') id:string,@Body('memberName') memberName:string,@Res() res:Response){
        const project=await this.projectService.addMember(id,memberName);
        return res.json(project?.members);
    }

    @Patch('/:id/deleteMember')
    async deleteMember(@Param('id') id:string,@Body('memberName') memberName:string,@Res() res:Response){
        const project=await this.projectService.deleteMamebr(id,memberName);
        return res.json(project?.members);
    }

    @Patch(':projectId/tasks/:taskId')
    async updateTask(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() body: Task,@Res() res:Response
    ) {
        const tasks=await this.projectService.updateTask(projectId,taskId,body);
        return res.json(tasks);
    }

    @Patch(':projectId/taskDeadline/:taskId')
    async addTaskDeadline(@Res() res:Response,@Param('projectId') projectId: string,
    @Param('taskId') taskId: string,@Body('deadline') deadline:string){
        const tasks=await this.projectService.addTaskDeadline(projectId,taskId,deadline);
        return res.json(tasks);
    }

    @Delete('/:id/delete')
    async deleteProject(@Param('id') projectId:string,@Res() res:Response){
        await this.projectService.deleteProject(projectId);
        return res.status(HttpStatus.OK).json( 'Project deleted' );;
    }

}
