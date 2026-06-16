import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../user.interface';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-members-cards',
  imports: [MatIcon],
  templateUrl: './members-cards.html',
  styleUrl: './members-cards.css',
})
export class MembersCards {
  @Input() members:User[]=[];
  @Input() projectId:string='';
  @Input() userId:string='';
  @Input() creator:string='';
  @Output() deleteMember=new EventEmitter<{projectId:string,userName:string}>();

  onDeleteMember(projectId:string,userName:string){
    this.deleteMember.emit({projectId,userName});
  }

}
