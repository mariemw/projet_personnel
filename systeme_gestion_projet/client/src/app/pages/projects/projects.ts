import { Component, OnInit } from '@angular/core';
import { Project } from '../../project.interface';
import { ProjectsService } from '../../services/projects';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SocketService } from '../../services/socket';
import { ValidationPopup } from '../validation-popup/validation-popup';
import { PopUp } from '../pop-up/pop-up';
import { InfoPopup } from '../info-popup/info-popup';

@Component({
  selector: 'app-projects',
  imports: [FormsModule,MatIconModule,ValidationPopup,PopUp,InfoPopup],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  validation:boolean=false;
  showPopup:boolean=false;
  projectToDelete?: string;
  projectToEdit?: Project;
  projects:Project[]=[];
  title:string='';
  description:string='';
  creator:string='';
  userName:string='';
  creatorNames: { [key: string]: string } = {};
  userId:string='';
  projectFields=[{label:'titre',placeHolder:'Entrer titre',input:''},
    {label:'description',placeHolder:'Entrer description',input:''}
  ]
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';
  showInfoPopup = false;
  constructor(private projectService:ProjectsService,private route: ActivatedRoute,private router:Router,
    private socketService:SocketService
  ){}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    this.userId=userId!;
    if (userId) {
      this.creator=userId;
      this.getUser(this.creator);
      this.projectService.getProjects(userId).subscribe((data) => {
        this.projects = data;
        this.projects.forEach(project => {
          if (!this.creatorNames[project.creator]) {
            this.projectService.getUser(project.creator).subscribe(user => {
              this.creatorNames[project.creator] = user.userName;
            });
          }
        });
      });
    }
    
    this.socketService.onUpdateProject((data)=>this.projects=data);
  }

  protected show(){
    this.showPopup=true; 
  }

  protected close(){
    this.showPopup=false; 
  }

  protected create(title:string,description:string){
    if (!this.creator) {
      return;
    }
    this.projectService.createProject({title:title,description:description,creator:this.creator}).subscribe({
      next:(data)=>{
       
        this.projects.push(data);
        this.title = '';
        this.description = '';
        const projectId=data._id;
        if (projectId){
          this.socketService.joinProject(projectId);
          
        }
        
      },
      error: (err) => {
        // alert('Message de validation :'+err.error.message)
        this.openPopup(
          err.error.message,
          'error'
        );
      }
    })
    this.close();
  }

  private getUser(userId:string){
    return this.projectService.getUser(userId).subscribe({
      next:(data)=>{
        this.userName=data.userName;
        
      },
      error: (err) => {
        
        this.openPopup(
          err.error.message,
          'error'
        );
      }
    });
  }

  protected goToProject(projectId:string){
    this.router.navigate(['/board',projectId],{
      queryParams: {
        userId: this.creator
      }
    })
  }

  protected removeProject(projectId:string){
    this.projectService.deleteProject(projectId).subscribe({
      next:(data)=>{
        this.projects=this.projects.filter((p)=>p._id!==projectId);
        this.projectToDelete='';
      },
      error: (err) => {
        // alert('Message de validation :'+err.error.message)
        this.openPopup(
          err.error.message,
          'error'
        );
      }
    })
  }

  protected editProject(projectId:string,title:string,description:string){
    this.projectService.editProject(projectId,title,description).subscribe({
      next:(data)=>{
        this.projects=this.projects.filter((p)=>p._id!==projectId);
        this.projects.push(data);
        this.projectToEdit=undefined;
      },
      error: (err) => {
        //alert('Message de validation :'+err.error.message)
        this.openPopup(
          err.error.message,
          'error'
        );
      }
    })
    
  }


  protected deconnect(){
    this.router.navigate(['/login']);
    localStorage.clear();
  }

  protected openEditPopup(project: Project) {
    this.projectToEdit = project;

    this.title = project.title;
    this.description = project.description;
  }

  edit(fields:any[]){
    const title = fields[0].input;
    const description = fields[1].input;

    this.editProject(this.projectToEdit?._id!,title,description);

    this.projectToEdit = undefined;
  }

  add(fields:any[]){
    const title = fields[0].input;
    const description = fields[1].input;

    this.create(title,description);
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
