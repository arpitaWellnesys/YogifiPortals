import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService  } from '../api-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from 'ng-uikit-pro-standard';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-teacher-details',
  templateUrl: './teacher-details.component.html',
  styleUrls: ['./teacher-details.component.css']
})
export class TeacherDetailsComponent implements OnInit {

  cookieValue : any;
  responce : any;
  data : any;
  resp : any;
  details : any;
  selectedLevel:any;
  startDate : any ;
  dt = new Date();
  endDate : any;
  totalData : number = 0;
  recordPerPage : any = 10;
  currentPage : number = 1;
  totalPages : any = 1;
  params : any;
  userinfo : any;
  dashdata : any;

  constructor(private cookieService:CookieService,private activatedRoute: ActivatedRoute, private fb : FormBuilder , private service : ApiServiceService ,private router : Router , private toast : ToastService) { 
    this.activatedRoute.params.subscribe(params => {
      this.params = params.id;
    }) 
  }

  ngOnInit(): void {
    this.cookieValue = this.cookieService.get('user_data');
    if(this.cookieValue == ""){
      this.router.navigate(['/login']);
    }else{
      this.cookieValue = JSON.parse(this.cookieService.get('user_data'));
      this.dashdata = this.cookieValue.users;
      this.service.userDetailsById(this.params).subscribe(res=>{
        this.resp = res;
        console.log(this.resp);
        if(this.resp.success){
          this.details = this.resp.data;
          console.log("detailssssssssss",this.details);
        }
      })
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
