import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login';
import { FormsModule } from '@angular/forms';
import { InfoPopup } from '../info-popup/info-popup';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,FormsModule,InfoPopup],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  userName:string='';
  password:string='';
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';
  showInfoPopup = false;
  constructor(private loginService:LoginService,private router:Router){}

  login(){
     this.loginService.getUser({userName:this.userName,password:this.password}).subscribe({
      next:(data) =>{
        this.router.navigate(['/projects',data._id]);
      },
      error: (err) => {
        // alert(err.message);
        this.openPopup(
          err.error.message,
          'error'
        );
      }
    });
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
