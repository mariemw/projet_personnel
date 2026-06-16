import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/interfaces/task.interface';
import { CreateProjectDto } from 'src/models/dto/create-project.dto';
import { UpdateProjectDto } from 'src/models/dto/update-project.dto';
import { Project, ProjectDocument } from 'src/models/schema/project.schema';
import { randomUUID } from 'crypto';
import { UserService } from '../user/user.service';
import { STATUS } from 'src/enums/status.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';


@Injectable()
export class ProjectService {
    constructor(
        @InjectModel(Project.name) private projectModel:Model<ProjectDocument>,
        private userService:UserService,
        private eventEmitter:EventEmitter2
    ){}

    async getProjectByUserId(userId:string){
        return await this.projectModel.find({
        $or: [
            { creator: userId },
            { "members._id": userId }
        ]
    });
    }

    async createProject(createProject:CreateProjectDto){
        const newProject=new this.projectModel(createProject);
        return await newProject.save();
    }

    async updateProject(projectId:string,updateProject:UpdateProjectDto){
        const project= await this.projectModel.findByIdAndUpdate(
            projectId,
            {
                title:updateProject.title,
                description:updateProject.description
            },
            { returnDocument: 'after', upsert: true }
        );
        if (!project) {
            throw new NotFoundException('Projet introuvable');
        }
        this.eventEmitter.emit('updateProjects',project.creator);
        return project;
    }

    async deleteProject(projectId:string){
        const project=await this.projectModel.findByIdAndDelete(projectId);
        if (project) this.eventEmitter.emit('updateProjects',project.creator);
    }

    async addTask(projectId:string,title:string,description:string){
        const project=await this.projectModel.findById(projectId);
        if(!title || !description) throw new Error('titre ou description vide');
        if (!project)
            throw new Error('project not found');
        const existingtask=project.tasks.find((t)=>t.title===title);
        if (existingtask) throw new Error('il existe deja une tache avec le meme nom');
        project.tasks.push({id:randomUUID(),title:title,description:description,status:STATUS.NOT_STARTED});
        project.logs.push(`une nouvelle tache ${title} a été ajouté au projet ${project.title}`)
        await project.save();
        this.eventEmitter.emit('updateTasks',projectId);
        return project;
    }

    async deleteTask(projectId:string,taskId:string){
        const project=await this.projectModel.findById(projectId);
        if (!project)
            throw new Error('project not found');
        const task=project.tasks.find((t)=>t.id===taskId);
        project.tasks=project.tasks.filter((t)=>t.id!==taskId);
        project.logs.push(`la tache ${task?.title} a été supprimée`)
       
        await project.save();
        this.eventEmitter.emit('updateTasks',projectId);
        return project
    }

    async getTasks(projectId:string){
        const project=await this.projectModel.findById(projectId);
        if (!project)
            throw new Error('project not found');
        return project.tasks;
    }

    async addTaskDeadline(projectId:string,taskId:string,deadline:string){
        const project = await this.projectModel.findById(projectId);
        if (!project) {
            throw new NotFoundException('Projet introuvable');
        }

        const task = project.tasks.find((t)=>t.id===taskId);

        if (!task) {
            throw new NotFoundException('Tache introuvable');
        }
        const nowDate=new Date();
        const deadlineConvet=new Date(deadline);
        if (nowDate>deadlineConvet) throw new NotFoundException('date invalide');
        task.deadline=deadlineConvet;
        project.markModified('tasks');
        await project.save();
        this.eventEmitter.emit('updateTasks',projectId);
        return project.tasks;
        // toLocaleDateString('fr-FR');
    }

    async addMember(projectId:string,memberName:string){
        const project=await this.projectModel.findById(projectId);
        const member=await this.userService.findUserByName(memberName);
        if (!member)
            throw new Error('user not found');
        const existingmembe=project?.members.find((m)=>m.userName===memberName);
        if (existingmembe) throw new Error('member exist');
        if (member.id===project?.creator) throw new Error('member admin');
        project?.members.push(member);
        project?.logs.push(`une membre ${memberName} a été ajouté au projet ${project?.title}`);
        
        await project?.save();
        this.eventEmitter.emit('updateProjects',project?.creator);
        return project
    }

    async updateTask(projectId:string,taskId:string,taskmodif:Task){
        const project = await this.projectModel.findById(projectId);

        if (!project) {
            throw new NotFoundException('Projet introuvable');
        }

        const task = project.tasks.find((t)=>t.id===taskId);

        if (!task) {
            throw new NotFoundException('Tache introuvable');
        }

        task.title = taskmodif.title ?? task.title;
        task.description = taskmodif.description ?? task.description;
        task.status = taskmodif.status ?? task.status;
        task.deadline=taskmodif.deadline ?? task.deadline;
        project.logs.push(`la tache ${task?.title} a été modifié`)
        project.markModified('logs');
        project.markModified('tasks');
        await project.save();
        this.eventEmitter.emit('updateTasks',projectId);
        return project.tasks;
    }

    async deleteMamebr(projectId:string,memberName:string){
        const project=await this.projectModel.findById(projectId);
        if (!project)
            throw new Error('project not found');
        project.members=project.members.filter((m)=>m.userName!==memberName);
        project.logs.push(`une membre ${memberName} a été supprimé du projet ${project?.title}`)
        await project?.save();
        this.eventEmitter.emit('updateProjects',project.creator);
        return project
    }

}
