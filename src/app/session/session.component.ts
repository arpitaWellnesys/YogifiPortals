import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import { ApiServiceService } from '../api-service.service';
import { ToastService } from 'ng-uikit-pro-standard';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {

  cookieValue : any;
  responce : any;
  data : any;
  resp : any;
  matInfo : any;
  selectedLevel:any;
  startDate : any = "2022-01-12";
  dt = new Date();
  endDate : any = "2022-01-16";
  totalData : number = 0;
  recordPerPage : any = 10;
  currentPage : number = 1;
  totalPages : any = 1;
  fileName = "sessionDuration.xlsx";
  dashdata : any;
  search : Boolean = false;
  exportedata : any = [];
  
  constructor(private cookieService:CookieService , private router : Router ,private service : ApiServiceService,private toast: ToastService) { }

  ngOnInit(): void {
    this.cookieValue = this.cookieService.get('token');
    if(this.cookieValue == ""){
      this.router.navigate(['/login']);
    }else{
      this.cookieValue = JSON.parse(this.cookieService.get('user_data'));
      this.dashdata = this.cookieValue.users;
      
      var keyword = $("#search").val();
      if(keyword != ""){
        this.totalPages = 1;
        this.search = true;
      }else{
        this.search = false;
      }
      this.service.getSessionDuration(this.startDate,this.endDate,this.currentPage , this.search ,keyword ).subscribe(res=>{
        this.resp = res;
        if(this.resp.code == 200){
          this.matInfo = this.resp.data;
          console.log(this.matInfo);
          if(this.resp.total_count > 0){
            var subpagescount = Math.floor(this.resp.total_count / this.recordPerPage);
            console.log(this.check(this.resp.total_count));
            if(this.check(this.resp.total_count)){
              this.totalPages = subpagescount;
            }else{
              this.totalPages = subpagescount+1;
            }
            console.log(this.totalPages);
          }
        }
      })
    }
  }
  check(a:number) {
    console.log(Number.isInteger(a/10))
    return Number.isInteger(a/10)
   }
   

  getMetData(){
    this.currentPage = 1;
    this.startDate = $("#start_date").val();
    this.endDate = $("#end_date").val();
    var keyword = $("#search").val();
    if(keyword != ""){
      this.totalPages = 1;
      this.search = true;
    }else{
      this.search = false;
    }
    this.service.getSessionDuration(this.startDate,this.endDate,this.currentPage , this.search ,keyword ).subscribe(res=>{
      this.resp = res;
      if(this.resp.code == 200){
        this.matInfo = this.resp.data;
        console.log(this.matInfo);
        if(this.resp.total_count > 0){
          var subpagescount = Math.floor(this.resp.total_count / this.recordPerPage);
          if(this.check(this.resp.total_count)){
            this.totalPages = subpagescount;
          }else{
            this.totalPages = subpagescount+1;
          }
          console.log(this.totalPages);
        }
      }
    })
  }

  getpaginateddata(id : any){
    this.currentPage = id;
    this.startDate = $("#start_date").val();
    this.endDate = $("#end_date").val();
    var keyword = $("#search").val();
    if(keyword != ""){
      this.totalPages = 1;
      this.search = true;
    }else{
      this.search = false;
    }
    this.service.getSessionDuration(this.startDate,this.endDate,this.currentPage , this.search ,keyword ).subscribe(res=>{
      this.resp = res;
      if(this.resp.code == 200){
        this.matInfo = this.resp.data;
        console.log(this.matInfo);
        if(this.resp.total_count > 0){
          var subpagescount = Math.floor(this.resp.total_count / this.recordPerPage);
          if(this.check(this.resp.total_count)){
            this.totalPages = subpagescount;
          }else{
            this.totalPages = subpagescount+1;
          }
          console.log(this.totalPages);
        }
      }
    })
  }

  searchRecord(){
    this.currentPage = 1;
    this.startDate = $("#start_date").val();
    this.endDate = $("#end_date").val();
    
    var keyword = $("#search").val();
    if(keyword != ""){
      this.totalPages = 1;
      this.search = true;
    }else{
      this.search = false;
    }
    this.service.getSessionDuration(this.startDate,this.endDate,this.currentPage , this.search ,keyword ).subscribe(res=>{
      this.resp = res;
      if(this.resp.code == 200){
        this.matInfo = this.resp.data;
        console.log(this.matInfo);
        if(this.resp.total_count > 0){
          var subpagescount = Math.floor(this.resp.total_count / this.recordPerPage);
          if(this.check(this.resp.total_count)){
            this.totalPages = subpagescount;
          }else{
            this.totalPages = subpagescount+1;
          }
          console.log(this.totalPages);
        }
      }
    })
  }

  exportexcel(){
    var keyword = $("#search").val();
    if(keyword != ''){
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.matInfo);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, this.fileName);
    }else{
      this.exportedata = [];
      for (let index = 1; index <= this.totalPages; index++) {
        console.log(index);
        
        this.service.getSessionDuration(this.startDate,this.endDate,index , this.search ,keyword ).subscribe(res=>{
          this.resp = res;
          this.resp.data.forEach((element:any)  => {
            this.exportedata.push(element);
            console.log(this.exportedata);
            if(this.exportedata.length == this.resp.total_count){
              this.excelexportedata();
            }
          });
        });
      }
      
    }
  }

  excelexportedata(){
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.exportedata);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }

}
