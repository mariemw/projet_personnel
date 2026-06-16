import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../task.interface';
import { STATUS } from '../../status.enum';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'app-task-cards',
  imports: [FormsModule,MatIcon],
  templateUrl: './task-cards.html',
  styleUrl: './task-cards.css',
})

export class TaskCards {
  @Input() tasks:Task[]=[];
  @Input() status=STATUS;
  @Input() projectId:string='';
  @Input() all!:boolean;
  @Output() changeStatus=new EventEmitter<{task:Task,value:STATUS}>();
  @Output() deleteTask=new EventEmitter<{projectId:string,task:Task}>();
  @Output() showEditPopUp=new EventEmitter<Task>();
  @Output() show=new EventEmitter<void>()
  activeTaskId: string | null = null;
  deadline:string='';

  constructor(private taskService:TaskService){}

  onChangeStatus(task:Task,value:STATUS){
    this.changeStatus.emit({task,value});
  }

  onDeleteTask(task:Task){
    this.deleteTask.emit({projectId:this.projectId,task});
  }

  onShow(){
    this.show.emit();
  }

  onShowEditPopUp(task:Task){
    this.showEditPopUp.emit(task);
  }

  showDates(taskId:string){
    this.activeTaskId = taskId;
  }

  addDeadline(taskId:string){
    this.taskService.addDeadline(this.projectId,taskId,this.deadline).subscribe({
      next: (res) => {
        this.tasks=res;
        
        this.deadline = '';
        this.activeTaskId = null;
      },
      error: (err) => {
        alert('Message de validation :'+err.error.message)
      }
    })
    
  }

  formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString('fr-FR');
  }


  isExpired(task: Task): boolean {
    if (!task.deadline) {
      return false;
    }

    return new Date() > new Date(task.deadline);
  }
  

}
