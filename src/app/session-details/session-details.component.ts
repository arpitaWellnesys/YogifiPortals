import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService  } from '../api-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from 'ng-uikit-pro-standard';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css']
})
export class SessionDetailsComponent implements OnInit {

 
  cookieValue : any;
  responce : any;
  data : any;
  resp : any;
  matInfo : any;
  selectedLevel:any;
  startDate : any ;
  dt = new Date();
  endDate : any;
  totalData : number = 0;
  recordPerPage : any = 10;
  currentPage : number = 1;
  totalPages : any = 1;
  params : any;

  constructor(private cookieService:CookieService,private activatedRoute: ActivatedRoute, private fb : FormBuilder , private service : ApiServiceService ,private router : Router , private toast : ToastService) { 
    this.activatedRoute.params.subscribe(params => {
      this.params = params.id;
      this.startDate = params.startdate;
      this.endDate = params.enddate;
    }) 
  }

  ngOnInit(): void {
    this.cookieValue = this.cookieService.get('token');
    if(this.cookieValue == ""){
      this.router.navigate(['/login']);
    }else{
      this.cookieValue = JSON.parse(this.cookieService.get('user_data'));
      this.data = this.cookieValue.users;
      this.service.getBestSessionDetails(this.params,this.startDate,this.endDate).subscribe(res=>{
        this.resp = res;
        if(this.resp.code == 200){
          this.matInfo = this.resp.data;
          console.log(this.matInfo);
          if(this.resp.total_count > 0){
            var subpagescount = Math.floor(this.resp.total_count / this.recordPerPage);
            this.totalPages = subpagescount+1;
            console.log(this.totalPages);
          }
        }
      })
    }
  }
}
