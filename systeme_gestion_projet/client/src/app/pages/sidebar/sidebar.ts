import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() showContent:string='';
  @Input() progressPercentage:number=0;
  @Input() projectId = '';
  @Output() changeContent=new EventEmitter<string>();

  onChangeContent(content:string){
    localStorage.setItem(`content-${this.projectId}`, content);
    this.changeContent.emit(content);
  }

}
