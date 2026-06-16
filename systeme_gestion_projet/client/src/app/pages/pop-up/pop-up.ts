import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pop-up',
  imports: [FormsModule],
  templateUrl: './pop-up.html',
  styleUrl: './pop-up.css',
})
export class PopUp {
  @Input() fields:{label:string,placeHolder:string,input:string}[]=[];
  @Input() showPopup:boolean=false;
  @Input() title = '';
  @Input() actionLabel = '';
  @Output() action=new EventEmitter<any>();
  @Output() close=new EventEmitter<void>();

  onAction(){
    this.action.emit(this.fields);
  }

  onClose(){
    this.close.emit();
  }
}
