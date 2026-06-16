import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-validation-popup',
  imports: [MatIcon],
  templateUrl: './validation-popup.html',
  styleUrl: './validation-popup.css',
})
export class ValidationPopup {
  @Output() confirm=new EventEmitter();
  @Output() cancel=new EventEmitter();
  @Input() text:string='';

  onConfirm(){
    this.confirm.emit();
  }

  onCancel(){
    this.cancel.emit();
  }
}
