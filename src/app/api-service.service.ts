import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import {catchError, tap, map} from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  cookieValue : any;
  requestHeader : any;
  header : any;
  leaderHeader : any;
  requestOptions : any;
  // api_url = "http://localhost:8081/";
  api_url = "https://yogifi-teacher.azurewebsites.net/api/";
  
  constructor(private http:HttpClient , private cookieService:CookieService) {
    this.cookieValue = this.cookieService.get('token');
    console.log("cookies value from service",this.cookieValue)
    this.requestHeader = { headers: new HttpHeaders({'x-access-token': this.cookieValue})}
    this.header = {headers : new HttpHeaders({'x_auth' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjYyNDY3YmNhNWZlZmU1MWFmZmRlZTYiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNjUwNjA3NzM5fQ.aXHSGiWq6FZBS-SS-vs0QkxCwVk0YH2ioO4fUdo0AOQ'})}
    this.leaderHeader = {headers : new HttpHeaders({'x_auth' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjYyNDY3YmNhNWZlZmU1MWFmZmRlZTYiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNjUwNjA3NzM5fQ.aXHSGiWq6FZBS-SS-vs0QkxCwVk0YH2ioO4fUdo0AOQ'})}
  }

  login(data:any){
    return this.http.post(this.api_url+"login",data).pipe(map(result=>result));
  }

  register(data:any){
    return this.http.post(this.api_url+"register",data).pipe(map(result=>result));
  }

  forgetPassword(data:any){
    return this.http.post(this.api_url+"forget-password",data).pipe(map(result=>result));
  }

  verifyOtp(data:any){
    return this.http.post(this.api_url+"verify-otp",data).pipe(map(result=>result));
  }

  resendOtp(data: any){
    return this.http.post(this.api_url+"resend-otp",data).pipe(map(result=>result));
  }

  googleLogin(data : any){
    return this.http.post(this.api_url+"google-login",data).pipe(map(result=>result));
  }

  resetPassword(data : any){
    return this.http.post(this.api_url+"reset-password",data).pipe(map(result=>result));
  }

  userDetails(){
    return this.http.get(this.api_url+"user-details",this.requestHeader ).pipe(map(result=>result));
  } 

  userDetailsById(data:any){
    return this.http.get(this.api_url+"user-details-by-id/"+data,this.requestHeader ).pipe(map(result=>result));
  } 
  
  familarities(){
    return this.http.get(this.api_url+"familarities").pipe(map(result=>result));
  }

  profile(data:any){
    return this.http.post(this.api_url+"profile",data,this.requestHeader).pipe(map(result=>result));
  }

  teacherList(){
    return this.http.get(this.api_url+"teacher-list",this.requestHeader).pipe(map(result=>result));
  }

  verifyTeacher(id:String,status:Number){
    return this.http.get(this.api_url+"teacher-status/"+id+"/"+status,this.requestHeader).pipe(map(result=>result));
  }

  addTimesheet(data:any){
    return this.http.post(this.api_url+"add-timesheet",data,this.requestHeader).pipe(map(result=>result));
  }

  showTimesheet(id : String){
    return this.http.get(this.api_url+"timesheet/"+id, this.requestHeader).pipe(map(result=>result));
  }

  programsList(days:any){
    return this.http.get("https://stageazapi.gyaanifi.com/user_track/getProgramList?days="+days , this.header).pipe(map(result=>result));
    
  }

  getUserMatDuration(startdate:any , enddate : any , page : any , search : Boolean , keyword : any){
    return this.http.get("https://stageazapi.gyaanifi.com/user_track/getUserMatDuration?start_date="+startdate+"&end_date="+enddate+"&page_no="+page+"&search="+search+"&search_keyword="+keyword, this.header).pipe(map(result=>result));
  }

  getMatDetails(id:any , startdate : any , enddate : any){
    return this.http.get("https://stageazapi.gyaanifi.com/user_track/getUserMatDetails?start_date="+startdate+"&end_date="+enddate+"&student_id="+id , this.header).pipe(map(result=>result));
  }

  getDashboardStatics(){
    return this.http.get("https://stageazapi.gyaanifi.com/user_track/getDashboardStatistics",this.header).pipe(map(result=>result));
  }

  getLeadboardData(data:any ,search : Boolean , keyword : any){
    return this.http.get("https://stageazapi.gyaanifi.com/user_track/leaderBoard?page_no="+data+"&search="+search+"&search_keyword="+keyword,this.leaderHeader).pipe(map(result=>result));
  }

  getLineChartData(){
    return this.http.get("https://stageazapi.gyaanifi.com/user_track/getLineChartData",this.header).pipe(map(result=>result));
  }

  getPieChartData(){
    return this.http.get("https://stageazapi.gyaanifi.com/user_track/getPIChartData",this.header).pipe(map(result=>result));
  }

  getSessionDuration(startdate:any , enddate : any , page : any ,search : Boolean , keyword : any ){
    return this.http.get("https://stageazapi.gyaanifi.com/user_track/getSessionSummarry?start_date="+startdate+"&end_date="+enddate+"&page_no="+page+"&search="+search+"&search_keyword="+keyword,this.header).pipe(map(result=>result));
  }

  getBestSession(startdate:any , enddate : any , page : any,search : Boolean , keyword : any ){
    return this.http.get("https://stageazapi.gyaanifi.com/user_track/getBestSession?start_date="+startdate+"&end_date="+enddate+"&page_no="+page+"&search="+search+"&search_keyword="+keyword,this.header).pipe(map(result=>result));
  }

  getBestSessionDetails(id:any , startdate : any , enddate : any){
    startdate = '2020-07-13'; enddate = "2020-07-19";
    return this.http.get("https://stageazapi.gyaanifi.com/user_track/getBestSessionDetails?start_date="+startdate+"&end_date="+enddate+"&student_id="+id , this.header).pipe(map(result=>result));
  }

  getDashboardDetails(data : any){
    return this.http.get("https://stageazapi.gyaanifi.com/user_track/getDashboardDetails?input="+data , this.header).pipe(map(result=>result));
  }

  changePassword(data : any){
    return this.http.post(this.api_url+"change-password",data , this.requestHeader).pipe(map(result=>result));
  }

  profileDetails(id : String){
    return this.http.get(this.api_url+"profile-details/"+id, this.requestHeader).pipe(map(result=>result));
  }

  uploadContent(data : any){
    return this.http.post(this.api_url+"upload-content",data,this.requestHeader).pipe(map(result=>result));
  }

}
