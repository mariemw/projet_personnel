import { Component, OnInit } from '@angular/core';
import { Task } from '../../task.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task-service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { STATUS } from '../../status.enum';
import { ProjectsService } from '../../services/projects';
import { User } from '../../user.interface';
import { Project } from '../../project.interface';
import { TaskCards } from '../task-cards/task-cards';
import { MembersCards } from '../members-cards/members-cards';
import { Sidebar } from '../sidebar/sidebar';
import { Chat } from '../chat/chat';
import { SocketService } from '../../services/socket';
import { PopUp } from '../pop-up/pop-up';
import { InfoPopup } from '../info-popup/info-popup';

@Component({
  selector: 'app-project-board',
  imports: [FormsModule,MatIconModule,TaskCards,MembersCards,Sidebar,Chat,PopUp,InfoPopup],
  templateUrl: './project-board.html',
  styleUrl: './project-board.css',
})
export class ProjectBoard implements OnInit {
  projects:Project[]=[];
  project!:Project;
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';
  showInfoPopup = false;
  tasks:Task[]=[];
  title:string='';
  description:string='';
  titlemodif:string='';
  descriptionmodif:string='';
  projectId:string='';
  showPopup:boolean=false;
  showpopupModifiy:boolean=false;
  selectedTask: Task | null = null;
  status=STATUS;
  userId:string='';
  members:User[]=[];
  showContent:string='alltasks';
  logger:string[]=[];
  memberName='';
  showmember:boolean=false;
  creator:string='';
  taskFields=[{label:'titre',placeHolder:'Entrer titre',input:''},
    {label:'description',placeHolder:'Entrer description',input:''}
  ]
  memberFields=[{label:'Nom du membre',placeHolder:'Entrer nom d utilisateur',input:''}]
  constructor(private route:ActivatedRoute,private taskService:TaskService,private router:Router,
    private projectService:ProjectsService,private socket:SocketService,
  ){}

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParamMap.get('userId')!;
    this.projectId=this.route.snapshot.paramMap.get('id')!;
    this.projectService.getProjects(this.userId).subscribe(data => {
      this.projects=data;
      this.project = this.projects.find(
        p => p._id === this.projectId
      )!;

      this.creator=this.project.creator;
      this.members =this.project.members || [];
      this.logger = this.project.logs || [];
    });
    
    this.taskService.getTasks(this.projectId).subscribe({
      next: (data) => {
        this.tasks = data;
    
      },
      error: (err) => {
        this.openPopup(
          err.error.message,
          'error'
        );
      }
    })
    this.socket.joinProject(this.projectId);
    this.socket.onUpdateTask((data) => {
      this.tasks = [...data];
    });
    
    this.getUser(this.userId);
    this.showContent =localStorage.getItem(`content-${this.projectId}`) || 'alltasks';
   
  }

  get progressPercentage(){
    const finished = this.tasks.filter(t => t.status === STATUS.FINISHED).length;
    return this.tasks.length ? (finished / this.tasks.length) * 100 : 0;
  }

  get todoTasks(){
    return this.tasks.filter(task=> task.status===this.status.NOT_STARTED)
  }

  get progressTasks(){
    return this.tasks.filter(task=> task.status===this.status.IN_PROGRESS)
  }

  get finishedTasks(){
    return this.tasks.filter(task=> task.status===this.status.FINISHED)
  }

  show(){
    this.showPopup=true;
   
  }

  showmod(task:Task){
    this.showpopupModifiy=true;
    
    this.selectedTask = task;
    

    this.titlemodif = task.title || '';
    this.descriptionmodif = task.description || '';
  }

  closemod(){
    this.showpopupModifiy=false;
    this.selectedTask=null;
  }

  addTask(projectId:string,title:string,description:string){
    this.taskService.addTaks(projectId,{title:title,description:description}).subscribe({
      next:(data)=>{
        this.tasks=data.tasks||[];
        this.title = '';
        this.description = '';
        this.showPopup=false;

      },
      error: (err) => {
        this.openPopup(
          err.error.message,
          'error'
        );
      }
    })
  }

  deleteTask(projectId:string,task:Task){
    this.taskService.deleteTask(projectId,task).subscribe({
      next:(data)=>{
        this.tasks=this.tasks.filter((t)=>t.id!==task.id);
      },
      error: (err) => {
        this.openPopup(
          err.error.message,
          'error'
        );
      }
    })
  }

  updateTask(projectId:string,taskId:string,task:Task){
    this.taskService.updateTask(projectId,taskId,task).subscribe({
      next:(data)=>{
      this.tasks=data;
    
      this.showpopupModifiy=false;

      },
      error: (err) => {
        this.openPopup(
          err.error.message,
          'error'
        );
      }
    })
  }

  changeStatus(task: Task, newStatus: STATUS) {

    const updatedTask: Task = {
      ...task,
      status: newStatus
    };

    this.updateTask(
      this.projectId,
      task.id!,
      updatedTask
    );
  }

  return(){
    this.router.navigate(['/projects',this.userId])
  }

  addMember(projectId:string,memberName:string){
    return this.projectService.addMember(projectId,memberName).subscribe({
      next:(data)=>{
        this.members=data;
        const project = this.projects.find(
          p => p._id === projectId
        );

        if(project){
          project.members = data;
        }
        this.socket.joinProject(projectId);

      },
      error: (err) => {
        this.openPopup(
          err.error.message,
          'error'
        );
      }
    })
  }

  deleteMember(projectId:string,memberName:string){
    return this.projectService.deleteMember(projectId,memberName).subscribe({
      next:(data)=>{
        this.members=data;
        const project = this.projects.find(
          p => p._id === projectId
        );

        if(project){
          project.members = data;
        }
      },
      error: (err) => {
        this.openPopup(
          err.error.message,
          'error'
        );
      }
    })
  }

  showMembers(){
    // this.showmember=true;
    this.showmember=true;
  }

  closeMemebers(){
  // this.showmember=false;
    this.showmember=false;
  }


  getUser(userId:string){
    return this.projectService.getUser(userId).subscribe({
      next:(data)=>{
        this.memberName=data.userName;
      },
      error: (err) => {
        this.openPopup(
          err.error.message,
          'error'
        );
      }
    });
  }

  createTask(fields:any[]) {

    const title = fields[0].input;
    const description = fields[1].input;

    this.addTask(
      this.projectId,
      title,
      description
    );

    this.showPopup = false;
    
  }

  editTask(fields:any[]) {

    const title = fields[0].input;
    const description = fields[1].input;

    this.updateTask(this.projectId,this.selectedTask?.id!,{title,description});

    this.showpopupModifiy = false;
  }

  addUser(fields:any[]){
    const memberName=fields[0].input;
    this.addMember(this.projectId,memberName);
    this.showmember=false;
  }

  private openPopup(
    message: string,
    type: 'success' | 'error'
  ) {
    this.popupMessage = message;
    this.popupType = type;
    this.showInfoPopup = true;
  }
}
