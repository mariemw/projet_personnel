import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Register } from '../../services/register';
import { Router } from '@angular/router';
import { InfoPopup } from '../info-popup/info-popup';

@Component({
  selector: 'app-password-component',
  imports: [FormsModule,InfoPopup],
  templateUrl: './password-component.html',
  styleUrl: './password-component.css',
})
export class PasswordComponent {
  userName:string='';
  password:string='';
  passwordError:string = '';
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';
  showInfoPopup = false;

  constructor(private registerService:Register,private router:Router){}
  createUser(){
    if (!this.validatePassword()) {
      return;
    }
    this.registerService.createUser({userName:this.userName,password:this.password,email:this.registerService.email}).subscribe({
      next:()=>{
        this.password='';
        this.userName='';
        this.registerService.email='';
        this.router.navigate(['/']);
        
      },
      error: (err) => {
        this.openPopup(
          err.error.message,
          'error'
        );
      }
    })

  }
  validatePassword(): boolean {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(this.password)) {
      this.passwordError =
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.';
      return false;
    }

    this.passwordError = '';
    return true;
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
