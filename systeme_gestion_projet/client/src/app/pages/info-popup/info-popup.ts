import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-info-popup',
  imports: [],
  templateUrl: './info-popup.html',
  styleUrl: './info-popup.css',
})
export class InfoPopup {
  @Input() message = '';
  @Input() type: 'success' | 'error' = 'success';

  @Output() close = new EventEmitter<void>();

}
