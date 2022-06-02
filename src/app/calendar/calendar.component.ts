import { Component, OnInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core'; // include this line
import { CalendarOptions , FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import * as moment from 'moment'
import * as $ from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import { ApiServiceService } from '../api-service.service';
import { ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  cookieValue : any;
  responce : any;
  data : any;
  days : string[] = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  result = [{date : "" , day_type : 0}];
  dashdata : any;
  // Events = [{'title' : 'Event name', 'start' : '2022-04-05', }];
  Events =  [{}];
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true
  };
  
  constructor(private cookieService:CookieService , private router : Router ,private service : ApiServiceService,private toast: ToastService) {  const name = Calendar.name}

  onDateClick(res:any) {
    alert('You clicked on : ' + res.dateStr)
  }

  ngOnInit(){
    this.cookieValue = JSON.parse(this.cookieService.get('user_data'));
      this.dashdata = this.cookieValue.users;

    this.service.userDetails().subscribe(res=>{
      this.responce = JSON.parse(JSON.stringify(res));
      const options = { opacity: 1 };
      if(this.responce.success){
        this.data = this.responce.data;
        if(this.data.profile_status == 0){
          this.router.navigate(['/profile']);
        }else if(this.data.acc_verify != 1 && this.data.user_type != 'admin'){
          this.router.navigate(['/approval']);
        }
        console.log(this.data);
        console.log("profile data",this.data.teacherdetails[0].timing);
        var timing  = this.data.teacherdetails[0].timing;
        for(let i=0;i<timing.length;i++){
          if(timing[i].day){
            this.getDates(i);
            console.log(this.result);
            console.log(this.days[i] , timing[i].start_hour+":"+timing[i].start_min ,  timing[i].end_hour+":"+timing[i].end_min);
          }
        }
        for(let j=1;j< this.result.length; j++){
          var obj = {
            "title" : this.days[this.result[j].day_type], 
            "start" : this.result[j].date+"T"+timing[this.result[j].day_type].start_hour+":"+timing[this.result[j].day_type].start_min,
            "end" : this.result[j].date+"T"+timing[this.result[j].day_type].end_hour+":"+timing[this.result[j].day_type].end_min,
          }
          this.Events.push(obj);  
        }
        console.log("EVENTS",this.Events);
      }
    });
    
    setTimeout(() => {
      console.log("CALLED THIS FUNC");
      this.calendarOptions = {
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        initialView: 'dayGridMonth',
        weekends: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        events : this.Events
      };
    }, 3500);
    }  
    getDates(day:any){
      var start = moment(moment().format('YYYY-MM-DD')),
        end   = moment(moment().add(6,'months').format('YYYY-MM-DD')), // Nov. 2nd
        day   = day;                    // Sunday

      var current = start.clone();
      var res = [];
      while (current.day(7 + day).isBefore(end)) {
        this.result.push({ "date" : moment(current.clone()).format('YYYY-MM-DD').toString() , "day_type" : day });
      }
    }

}
