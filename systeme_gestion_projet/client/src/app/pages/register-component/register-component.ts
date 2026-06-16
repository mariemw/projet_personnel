import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from '../../services/register';
import { InfoPopup } from '../info-popup/info-popup';


@Component({
  selector: 'app-register-component',
  standalone:true,
  imports: [FormsModule,InfoPopup],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  email:string='';
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';
  showInfoPopup = false;
  constructor(private registerService:Register,private router:Router){}
  saveEmail(){
    this.registerService.email=this.email;
    if (this.email && this.isValidEmail(this.email)){
      this.router.navigate(['/password']);
    }
    else{
      this.openPopup(
          "email invalide",
          'error'
      );
      return;
    }
  }

  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
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
