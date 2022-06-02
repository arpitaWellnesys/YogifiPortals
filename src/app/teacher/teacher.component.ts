import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import { ApiServiceService } from '../api-service.service';
import { ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  cookieValue : any;
  responce : any;
  list : any;
  data : any;
  dashdata : any;
  
  constructor(private cookieService:CookieService , private router : Router ,private service : ApiServiceService,private toast: ToastService) { }

  ngOnInit(): void {
    this.cookieValue = this.cookieService.get('token');
    if(this.cookieValue == ""){
      this.router.navigate(['/login']);
    }else{
      this.cookieValue = JSON.parse(this.cookieService.get('user_data'));
      this.dashdata = this.cookieValue.users;
      this.service.userDetails().subscribe(res=>{
        console.log(res);
        this.responce = JSON.parse(JSON.stringify(res));
        const options = { opacity: 1 };
        if(this.responce.success){
          this.data = this.responce.data;
        }
      });
      this.service.teacherList().subscribe(res=>{
        console.log(res);
        this.responce = JSON.parse(JSON.stringify(res));
        if(this.responce.success){
          this.list = this.responce.data;
        }else{ 
          this.list = [];
        }
      });
    }
  }

  verifyTeacher(id:string , status : number){
    this.service.verifyTeacher(id,status).subscribe(res=>{
      console.log(res);
      this.responce = JSON.parse(JSON.stringify(res));
      const options = { opacity: 1 };
      if(this.responce.success){
        this.toast.success(this.responce.message, '', options);
        setTimeout(this.reload, 5000);
        // window.location.reload();
      }else{ 
        this.toast.error(this.responce.message, '', options);
        setTimeout(this.reload, 5000);
        // window.location.reload();
      }
    });
  }
  reload(){
    window.location.reload();
  }

}
