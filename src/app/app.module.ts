import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'ng-uikit-pro-standard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OtpComponent } from './otp/otp.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { GoogleLoginProvider, SocialLoginModule } from 'angularx-social-login';
import { ProfileComponent } from './profile/profile.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { TeacherComponent } from './teacher/teacher.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar } from '@fullcalendar/core'; // include this line
import { CalendarOptions  } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { MatdataComponent } from './matdata/matdata.component';
import { NextStepComponent } from './next-step/next-step.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { NgChartsModule } from 'ng2-charts';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { MatDetailsComponent } from './mat-details/mat-details.component';
// import {PopoverModule} from "ngx-smart-popover";
import { PopoverModule, PopoverConfig } from 'ngx-bootstrap/popover';
import { DashboardSidebarComponent } from './dashboard-sidebar/dashboard-sidebar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TabsModule} from 'ngx-bootstrap/tabs';
import { SessionComponent } from './session/session.component';
import { TeacherDetailsComponent } from './teacher-details/teacher-details.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AuthGuardServiceService } from './auth-guard-service.service';
import { BestSessionComponent } from './best-session/best-session.component';
import { SessionDetailsComponent } from './session-details/session-details.component';
import { DashboardDetailsComponent } from './dashboard-details/dashboard-details.component';


FullCalendarModule.registerPlugins([ 
  interactionPlugin,
  dayGridPlugin,
  timeGridPlugin,
  listPlugin
]);


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    OtpComponent,
    DashboardComponent,
    ResetPasswordComponent,
    ProfileComponent,
    TeacherComponent,
    SidebarComponent,
    TopbarComponent,
    CalendarComponent,
    TimesheetComponent,
    ThankyouComponent,
    MatdataComponent,
    NextStepComponent,
    ChangePasswordComponent,
    EditProfileComponent,
    MatDetailsComponent,
    DashboardSidebarComponent,
    SessionComponent,
    TeacherDetailsComponent,
    AdminSidebarComponent,
    BestSessionComponent,
    SessionDetailsComponent,
    DashboardDetailsComponent
  ],
  imports: [  
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ToastModule.forRoot(),
    HttpClientModule,
    SocialLoginModule,
    NgxMaterialTimepickerModule,
    FullCalendarModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    NgChartsModule,
    PopoverModule,
    NgxPaginationModule,
    NgbModule,
    TabsModule.forRoot()
  ],
  providers: [
    AuthGuardServiceService,
    {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: true, //keeps the user signed in
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('845065559218-0t2qbjhbt779nbobjf829nqmgjv6i7kh.apps.googleusercontent.com') // your client id
        }
      ]
    }
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
