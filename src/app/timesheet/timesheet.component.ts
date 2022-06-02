import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import { ApiServiceService } from '../api-service.service';
import { ToastService } from 'ng-uikit-pro-standard';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { FormGroup, FormControl, Validators,FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  constructor(private cookieService:CookieService , private router : Router ,private service : ApiServiceService,private toast: ToastService, private fb : FormBuilder) {  }
  timesheetData : any = [];
  cookieValue : any;
  responce : any;
  data : any;
  dt = new Date();
  month = this.dt.getMonth();
  currentmonth = this.dt.getMonth();
  year = this.dt.getFullYear();
  daysInMonth = new Date(this.year, this.month, 0).getDate();
  MonthName = new Date(this.year, this.month+1, 0).toLocaleString('default', { month: 'long' });
  date =  (new Date()).toISOString().split('T')[0];

  timesheetForm = this.fb.group({
    date : [this.date],
    checkin : ['' , Validators.required],
    checkout : ['' , Validators.required],
    description : [''],
    teacher_id : ['']
  });

  ngOnInit(): void {
    this.cookieValue = this.cookieService.get('token');
    if(this.cookieValue == ""){
      this.router.navigate(['/login']);
    }else{
      this.cookieValue = JSON.parse(this.cookieService.get('user_data'));
      console.log("TIMESHEET DATA",this.cookieValue);
      this.data = this.cookieValue.users;
      this.service.showTimesheet(this.cookieValue.users._id).subscribe((res)=>{
        var responce = JSON.parse(JSON.stringify(res));
        this.timesheetData = responce.data;
        console.log("timesheet details",this.timesheetData);
        for(let i=0;i < this.timesheetData.length ; i++){
          let date = new Date(this.timesheetData[i].date);
          let getDate = date.getDate();
          this.timesheetData[i].getdate = getDate;
        }        
      })
    }
  }

  onSubmit(){
    this.timesheetForm.controls['teacher_id'].setValue(this.cookieValue.user._id);
    console.log(this.timesheetForm.value);
    if(this.timesheetForm.valid){
      this.service.addTimesheet(this.timesheetForm.value).subscribe(res => {
        this.responce = JSON.parse(JSON.stringify(res));
        console.log(this.responce);
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
      })
    }else{
      console.log("NIN ELSE")
      this.validateAllFields(this.timesheetForm); 
    }
  }

  reload(){
    window.location.reload();
  }

  get login(){
    return this.timesheetForm.controls;
  }

  validateAllFields(formGroup: FormGroup) {         
    Object.keys(formGroup.controls).forEach(field => {  
        const control = formGroup.get(field);            
        if (control instanceof FormControl) {             
            control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {        
            this.validateAllFields(control);  
        }
    });
  }

}
