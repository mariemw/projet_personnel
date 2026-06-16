import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ProjectService } from 'src/services/project/project.service';

@WebSocketGateway()
export class ListsGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly projectService:ProjectService) { }
  
  @OnEvent('updateProjects')
  async handleProjects(userId:string) {
    const projects=await this.projectService.getProjectByUserId(userId);
    this.server.emit('projectUpdated',projects);
  }

   @OnEvent('updateTasks')
   async handleTasks(projectId:string){ 
    const tasks=await this.projectService.getTasks(projectId);
    this.server.emit('taskUpdated',tasks);
   }
}
