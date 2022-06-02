import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import { ApiServiceService } from '../api-service.service';
import { ToastService } from 'ng-uikit-pro-standard';
import * as XLSX from 'xlsx';
import { Chart } from 'chart.js';
import  ChartDataLabels  from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  fileName= '';
  cookieValue : any;
  responce : any;
  data : any;
  resp : any;
  programList : any;
  selectedLevel:any;
  chart:any = [];
  dashboardStatics = {
    "active_student" : 0,
    "enrolled_student" : 0,
    "mat_in_use" : 0,
    "total_score" : 0,
    "total_sessions" : 0,
    "yogifi_minutes" : 0
  };
  leaderBoard : any = [];
  totalLength:any;
  page:number=1;
  pieChart :any;
  lineChart : any = [];
  totalData : number = 0;
  recordPerPage : any = 10;
  currentPage : number = 1;
  totalPages : any = 1;
  dashdata : any;
  search : any;
  
  constructor(private cookieService:CookieService , private router : Router ,private service : ApiServiceService,private toast: ToastService) { 
    
  }

  ngOnInit(): void {
    // window.location.reload();
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
          if(this.data.profile_status == 0){
            this.router.navigate(['/next-step']);
          }else if(this.data.acc_verify != 1 && this.data.user_type != 'admin'){
            this.router.navigate(['/approval']);
          }
        }else{ 
          window.location.reload();
            // this.toast.error(this.responce.message, '', options);
            // this.router.navigate(['/login']);
            // this.cookieService.delete('token');
            // this.cookieService.delete('user_data');
            // this.router.navigate(['/login']);
        }
      });
      
    }
    var days = $('#interval :selected').val();
    this.service.programsList(days).subscribe(res=>{
      this.resp = res;
      if(this.resp.code == 200){
        this.programList = this.resp.data;
        console.log(this.programList);
      }
    })

    this.service.getLineChartData().subscribe(res=>{
      this.responce = res;
      console.log("weekly",this.responce.data.weekly);
      if(this.responce.code == 200){
        this.lineChart = this.responce.data;
        console.log("Line Chart",this.lineChart);
        let month = this.lineChart.monthly.map((x:any)=>{return x.month_name});
        let studentCount = this.lineChart.monthly.map((x:any)=>{return x.student_count});
        let minutes = this.lineChart.monthly.map((x:any)=>{return x.yogifi_minutes});
        // console.log(month);
        var xValues = month;
        this.chart = new Chart('line-chart', {
          type: 'line',
          data: {
            labels: xValues,
            datasets: [
              {
                label : "Session",
                data:  minutes,
                borderColor: '#A4CD3C',
                fill: false
              },{
                label : "Student",
                data:  studentCount,
                borderColor: '#EB008A',
                fill: false
              }
            ]
          },
          options: {
            scales: {
              xAxes: {
                display: true
              },
              yAxes: {
                display : true,
              },
            }
          }
        });
        
        let weekly = this.lineChart.weekly.map((x:any)=>{return x.day_name});
        let wstudentCount = this.lineChart.weekly.map((x:any)=>{return x.student_count});
        let wminutes = this.lineChart.weekly.map((x:any)=>{return x.yogifi_minutes});
        console.log("HERE W",weekly);
        var xValues = weekly;
        this.chart = new Chart('weekly-chart', {
          type: 'line',
          data: {
            labels: xValues,
            datasets: [
              {
                label : "Session",
                data:  wminutes,
                borderColor: '#A4CD3C',
                fill: false
              },{
                label : "Student",
                data:  wstudentCount,
                borderColor: '#EB008A',
                fill: false
              }
            ]
          },
          options: {
            scales: {
              xAxes: {
                display: true
              },
              yAxes: {
                display : true,
              },
            }
          }
        });
        
      }
    })
    this.service.getPieChartData().subscribe(res=>{
      this.responce = res;
      if(this.responce.code == 200){
        this.pieChart = this.responce.data;
        console.log("Pie chart",this.pieChart.geography);
        let ageLabel = this.pieChart.age.map((x:any)=>{return x.name});
        let ageData = this.pieChart.age.map((x:any)=>{return x.user_count});
        // console.log("ageLabel",ageLabel);
        let mlabels = Object.keys(this.pieChart.gender.male);
        let mdata = Object.values(this.pieChart.gender.male);
        let flabels = Object.keys(this.pieChart.gender.female);
        let fdata = Object.values(this.pieChart.gender.female);
        
        new Chart('pieChart-male', {
          type: 'pie',
          data: {
            labels: mlabels,
            datasets: [{
              data: mdata,
              backgroundColor: ["#EB008A", "#E67E22", "#2ECC71"],
              hoverBackgroundColor: ["#EB008A", "#E67E22", "#2ECC71"]
            }]
          },
          plugins: [ChartDataLabels],
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
              },
              datalabels: {
                color: 'white',
                display: true,
                font: {
                  weight: 'bold'
                },
                formatter: Math.round ,
              }
            }
          }
        });

        new Chart('pieChart-female', {
          type: 'pie',
          data: {
            labels: flabels,
            datasets: [{
              data: fdata,
              backgroundColor: ["#EB008A", "#E67E22", "#2ECC71"],
              hoverBackgroundColor: ["#EB008A", "#E67E22", "#2ECC71"]
            }]
          },
          plugins: [ChartDataLabels],
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'bottom'
              },
              datalabels: {
                color: 'white',
                display: true,
                font: {
                  weight: 'bold'
                },
                formatter: Math.round ,
              }
            }
          }
        });
        new Chart('pieChart-age', {
          type: 'pie',
          "data": {
            labels: ageLabel,
            datasets: [{
              data: ageData,
              backgroundColor: ["#EB008A", "#E67E22", "#2ECC71","#00008B","#00FF00","#FFC0CB","#808080","#A52A2A"],
              hoverBackgroundColor: ["#EB008A", "#E67E22", "#2ECC71","#00008B","#00FF00","#FFC0CB","#808080","#A52A2A"]
            }]
          },
          plugins: [ChartDataLabels],
          "options": {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'right',
                align: 'start'
              },
              datalabels: {
                color: 'white',
                display: true,
                font: {
                  weight: 'bold'
                },
                formatter: Math.round ,
              }
            }
          }
        });
      }
      
      console.log(this.responce);
    })
    
    $('.pie-btn a').on('click', function(){
      var id = $(this).data('id');
      if(id == 'pie-geography'){
        $('#pie-geography').css('display','block');
        $('#pie-age').css('display','none');
        $('#pie-gender-1').css('display','none');
        $('#pie-gender').css('display','none');
      }
      if(id == 'pie-age'){
        $('#pie-geography').css('display','none');
        $('#pie-age').css('display','block');
        $('#pie-gender-1').css('display','none');
        $('#pie-gender').css('display','none');
      }
      if(id == 'pie-gender'){
        $('#pie-geography').css('display','none');
        $('#pie-age').css('display','none');
        $('#pie-gender-1').css('display','block');
        $('#pie-gender').css('display','block');
      }
      $('.pie-btn a.chart-active').removeClass('chart-active');
      $(this).addClass('chart-active');
    });

    $('.mid-sec-btn a').on('click', function(){
      var id = $(this).data('id');
      console.log(id);
      if(id == 'activity'){
        $('#program').css('display','none');
        $('#activity').css('display','block');
      }
      if(id == 'program'){
        $('#activity').css('display','none');
        $('#program').css('display','block');
      }
      $('.mid-sec-btn a.btn-active').removeClass('btn-active');
      $(this).addClass('btn-active');
    });

    $(".line-chart button").on('click',function(){
      var id = $(this).attr('id');
      if(id == 'line-week'){
        $('#line-chart').css('display','none');
        $('#weekly-chart').css('display','block');
      }
      if(id == 'line-month'){
        $('#weekly-chart').css('display','none');
        $('#line-chart').css('display','block');
      }
      $('.line-chart button.line-active').removeClass('line-active');
      $(this).addClass('line-active');
    })
    
    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
    this.service.getDashboardStatics().subscribe((res)=>{
      this.responce = res;
      if(this.responce.code == 200){
        this.dashboardStatics = this.responce.data;
        console.log(this.dashboardStatics);
      }
    })

    var keyword = $("#search").val();
    if(keyword != ""){
      this.totalPages = 1;
      this.search = true;
    }else{
      this.search = false;
    }
    this.service.getLeadboardData(this.currentPage  , this.search ,keyword ).subscribe(res=>{
      this.responce = res;
      if(this.responce.code == 200){
        this.leaderBoard = this.responce.data;
        console.log(this.leaderBoard);
        if(this.responce.total_count > 0){
          var subpagescount = Math.floor(this.responce.total_count / this.recordPerPage);
          console.log(this.check(this.responce.total_count));
          if(this.check(this.responce.total_count)){
            this.totalPages = subpagescount;
          }else{
            this.totalPages = subpagescount+1;
          }
          console.log(this.totalPages);
        }
      }
    })
   
  }

  getProgramList(){
    var days = $('#interval :selected').val();
    this.service.programsList(days).subscribe(res=>{
      this.resp = res;
      if(this.resp.code == 200){
        this.programList = this.resp.data;
        console.log(this.programList);
      }
    })
  }

  numFormatter(num:any) {
    if(num > 999 && num < 1000000){
        return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    }else if(num > 1000000){
        return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    }else if(num < 900){
        return num; // if value < 1000, nothing to do
    }
}

  exportexcel(): void
  {
    var days = $('#interval :selected').val();
    if(days == 365){
      this.fileName = "YearlyProgramList.xlsx";
    }else if(days == 30){
      this.fileName = "MonthlyProgramList.xlsx";
    }else if(days == 7){
      this.fileName = "WeeklyProgramList.xlsx";
    }else if(days == 1){
      this.fileName = "DailyProgramList.xlsx";
    }
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
  } 

  getpaginateddata(id : any){
    this.currentPage = id;
    var keyword = $("#search").val();
    if(keyword != ""){
      this.totalPages = 1;
      this.search = true;
    }else{
      this.search = false;
    }
    this.service.getLeadboardData(this.currentPage  , this.search ,keyword ).subscribe(res=>{
      this.responce = res;
      if(this.responce.code == 200){
        this.leaderBoard = this.responce.data;
        console.log(this.leaderBoard);
        if(this.responce.total_count > 0){
          var subpagescount = Math.floor(this.responce.total_count / this.recordPerPage);
          console.log(this.check(this.responce.total_count));
          if(this.check(this.responce.total_count)){
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
    var keyword = $("#search").val();
    if(keyword != ""){
      this.totalPages = 1;
      this.search = true;
    }else{
      this.search = false;
    }
    this.service.getLeadboardData(this.currentPage  , this.search ,keyword ).subscribe(res=>{
      this.responce = res;
      if(this.responce.code == 200){
        this.leaderBoard = this.responce.data;
        console.log(this.leaderBoard);
        if(this.responce.total_count > 0){
          var subpagescount = Math.floor(this.responce.total_count / this.recordPerPage);
          console.log(this.check(this.responce.total_count));
          if(this.check(this.responce.total_count)){
            this.totalPages = subpagescount;
          }else{
            this.totalPages = subpagescount+1;
          }
          console.log(this.totalPages);
        }
      }
    })
  }

  check(a:number) {
    console.log(Number.isInteger(a/10))
    return Number.isInteger(a/10)
  }

  
}
