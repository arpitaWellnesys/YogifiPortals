import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { OtpComponent } from './otp/otp.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProfileComponent } from './profile/profile.component';
import { TeacherComponent } from './teacher/teacher.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { MatdataComponent } from './matdata/matdata.component';
import { NextStepComponent } from './next-step/next-step.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MatDetailsComponent } from './mat-details/mat-details.component';
import { SessionComponent } from './session/session.component';
import {TeacherDetailsComponent} from './teacher-details/teacher-details.component';
import { AuthGuard } from './services/auth.guard';
import { BestSessionComponent } from './best-session/best-session.component';
import { SessionDetailsComponent } from './session-details/session-details.component';
import { DashboardDetailsComponent } from './dashboard-details/dashboard-details.component';

const routes: Routes = [
  {path : "" , redirectTo : '/dashboard' , pathMatch : 'full'},
  {path : "login" , component : LoginComponent},
  {path : 'register', component : RegisterComponent},
  {path : "forget-password" , component : ForgetPasswordComponent },
  {path : "reset-password/:id" , component : ResetPasswordComponent },
  {path : "verify-otp/:id" , component :  OtpComponent},
  {path : "dashboard" , component : DashboardComponent ,canActivate:[AuthGuard]},
  {path : "profile" , component : ProfileComponent ,canActivate:[AuthGuard]},
  {path : "teachers-list" , component : TeacherComponent ,canActivate:[AuthGuard]},
  {path : "calendar" , component : CalendarComponent ,canActivate:[AuthGuard]},
  {path : "timesheet" , component : TimesheetComponent ,canActivate:[AuthGuard]},
  {path : "approval" , component : ThankyouComponent ,canActivate:[AuthGuard]},
  {path : "mat-data" , component : MatdataComponent ,canActivate:[AuthGuard]},
  {path : "session-duration" , component : SessionComponent ,canActivate:[AuthGuard]},
  {path : "best-session" , component : BestSessionComponent , canActivate: [AuthGuard]},
  {path : "session-details/:startdate/:enddate/:id" , component : SessionDetailsComponent , canActivate: [AuthGuard]},
  {path : "next-step" , component : NextStepComponent ,canActivate:[AuthGuard]},
  {path : "change-password" , component : ChangePasswordComponent ,canActivate:[AuthGuard]},
  {path : "edit-profile" , component : EditProfileComponent ,canActivate:[AuthGuard]},
  {path : "matdetails/:startdate/:enddate/:id" , component : MatDetailsComponent ,canActivate:[AuthGuard]},
  {path : "teacher-details/:id" , component : TeacherDetailsComponent ,canActivate:[AuthGuard]},
  {path : "dashboard-details/:id" , component : DashboardDetailsComponent ,canActivate:[AuthGuard]}
];  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
