import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import {ActivatedRoute, Router} from '@angular/router';
import { ApiServiceService } from '../api-service.service';
import { ToastService } from 'ng-uikit-pro-standard';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrls: ['./dashboard-details.component.css']
})
export class DashboardDetailsComponent implements OnInit {


  programList : any;
  resp : any;
  data : any;
  cookieValue : any;
  dashdata : any;
  fileName = "DashboardDetails.xlsx";
  days : any = 0;
  page:number=1;
  totalLength:any;

  constructor(private cookieService:CookieService ,private activatedRoute: ActivatedRoute, private router : Router ,private service : ApiServiceService,private toast: ToastService) { 
    this.activatedRoute.params.subscribe(params => {
      this.days = params.id;
    }) 
  }

  ngOnInit(): void {
    this.cookieValue = this.cookieService.get('token');
    if(this.cookieValue == ""){
      this.router.navigate(['/login']);
    }else{
      this.cookieValue = JSON.parse(this.cookieService.get('user_data'));
      this.dashdata = this.cookieValue.users;
      this.service.getDashboardDetails(this.days).subscribe(res=>{
        this.resp = res;
        if(this.resp.code == 200){
          this.programList = this.resp.data;
          console.log(this.programList);
        }
      })
    }
  }

  getDashboardData(){
    this.service.getDashboardDetails(this.days).subscribe(res=>{
      this.resp = res;
      if(this.resp.code == 200){
        this.programList = this.resp.data;
        console.log(this.programList);
      }
    })
  }

  exportexcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
  } 

}
