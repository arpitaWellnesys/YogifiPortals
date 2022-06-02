import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators,FormBuilder, FormArray } from '@angular/forms';
import { ApiServiceService  } from '../api-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from 'ng-uikit-pro-standard';
import { timer } from 'rxjs';
import { any } from 'joi';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  
  params : any; 
  timeLeft: number = 10;
  numbers : any ;

  subscribeTimer : any;
  responce = {
    success : 0,
    message : '',
    data : []
  };

  constructor( private activatedRoute: ActivatedRoute, private fb :FormBuilder , private service : ApiServiceService ,private router : Router , private toast : ToastService
    ) {  
    this.activatedRoute.params.subscribe(params => {
      this.params = params.id;
    }) 
  }

  ngOnInit(): void {
   
  }

  observableTimer() {
    const source = timer(1000, 2000);
      const abc = source.subscribe(val => {
        if(val <= 10){
          console.log(val, '-');
          this.numbers = this.timeLeft-val;
          
          this.subscribeTimer = (this.numbers <= 9 ? "0" : "") + this.numbers;
          }
      });
  }

  otpForm = this.fb.group({
    otp : ['',[Validators.required]],
    _id : ['']
  });

  get login(){
    return this.otpForm.controls;
  }
  
  onSubmit(){
    this.otpForm.controls['_id'].setValue(this.params);
    if(this.otpForm.invalid){
      this.validateAllFields(this.otpForm); 
    }else{
      console.log("FORM GROUP"+this.otpForm.value);
      this.service.verifyOtp(this.otpForm.value).subscribe(res=>{
        this.responce = JSON.parse(JSON.stringify(res));
        console.log(this.responce);
        const options = { opacity: 1 };
        if(this.responce.success){
          this.toast.success(this.responce.message, '', options);
          this.router.navigate(['/login']);
        }else{
          this.observableTimer();
          this.toast.error(this.responce.message, '', options);
          this.otpForm.reset;
        }
      });
    }
  }

  resendOtp(){
    this.otpForm.controls['_id'].setValue(this.params);
    this.service.resendOtp(this.otpForm.value).subscribe(res=>{
      this.responce = JSON.parse(JSON.stringify(res));
      console.log(this.responce);
      const options = { opacity: 1 };
      if(this.responce.success){
        this.toast.success(this.responce.message, '', options);
        this.otpForm.reset;
        // this.router.navigate(['/login']);
        // setTimeout(this.reload, 5000);
      }else{
          this.toast.error(this.responce.message, '', options);
          this.otpForm.reset;
      }
    });
  }

  reload(){
    this.router.navigate(['/login']);
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
