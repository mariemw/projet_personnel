import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../user.interface';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
    apiUrl=`${environment.apiUrl}/users/login`;

    constructor(private http:HttpClient){}
    
    getUser(user:User){
      return this.http.post<User>(this.apiUrl,user);
    }
}
