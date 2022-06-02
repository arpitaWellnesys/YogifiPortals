import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import { ApiServiceService } from '../api-service.service';
import { CollapseComponent, ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  cookieValue : any;
  responce : any;
  data : any;
  constructor(private cookieService:CookieService , private router : Router ,private service : ApiServiceService,private toast: ToastService) { }

  ngOnInit(): void {
    this.cookieValue = this.cookieService.get('user_data');
    if(this.cookieValue == ""){
      this.router.navigate(['/login']);
    }else{
      this.data  = JSON.parse(this.cookieValue);
      console.log("SIDEBAR DATA",this.data);
    }
  }
}