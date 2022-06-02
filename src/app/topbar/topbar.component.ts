import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import { ApiServiceService } from '../api-service.service';
import { ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  constructor(private cookieService:CookieService , private router : Router ,private service : ApiServiceService,private toast: ToastService) { }
  cookieValue : any;
  responce : any;
  data : any;

  ngOnInit(): void {
    this.cookieValue = this.cookieService.get('user_data');
    if(this.cookieValue == ""){
      this.router.navigate(['/login']);
    } else{
      this.data  = JSON.parse(this.cookieValue);
      console.log("top bar", this.data);
      
    }
  }

  logout(){
    this.cookieService.delete('token');
    this.cookieService.delete('user_data');
    this.router.navigate(['/login']);
  }
}
