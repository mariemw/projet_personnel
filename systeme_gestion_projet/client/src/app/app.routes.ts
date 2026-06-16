import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register-component/register-component';
import { LoginComponent } from './pages/login/login';
import { PasswordComponent } from './pages/password-component/password-component';
import { Projects } from './pages/projects/projects';
import { ProjectBoard } from './pages/project-board/project-board';

export const routes: Routes = [
    { path:'',component:LoginComponent},
    { path:'login',component:LoginComponent},
    { path:'register',component:RegisterComponent},
    { path:'password',component:PasswordComponent},
    { path:'projects/:id',component:Projects},
    {path:'board/:id',component:ProjectBoard}
];
