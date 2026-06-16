import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../user.interface';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class Register {
  email:string='';
  
  constructor(private http:HttpClient){}

  createUser(user:User){
    return this.http.post<any>(`${environment.apiUrl}/users/new`,user)
  }
}
