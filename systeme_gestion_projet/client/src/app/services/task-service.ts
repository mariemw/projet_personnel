import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../project.interface';
import { Task } from '../task.interface';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
   constructor(private http:HttpClient){}

   addTaks(projectId:string,task:Task){
    return this.http.patch<Project>(`${environment.apiUrl}/project/${projectId}/newTask`,task)
   }

   getTasks(projectId:string){
    return this.http.get<Task[]>(`${environment.apiUrl}/project/tasks/${projectId}`)
   }

   deleteTask(projectId:string,task:Task){
    return this.http.patch<Project>(`${environment.apiUrl}/project/${projectId}/deleteTask`,task)
   }

  updateTask(projectId:string,taskId:string,task:Task){
    return this.http.patch<Task[]>(`${environment.apiUrl}/project/${projectId}/tasks/${taskId}`,task)
  }

  addDeadline(projectId:string,taskId:string,deadline:string){
    return this.http.patch<Task[]>(`${environment.apiUrl}/project/${projectId}/taskDeadline/${taskId}`,{deadline})
  }
}
