import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService  } from '../api-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  params : any; 
  responce = {
    success : 0,
    message : '',
    data : []
  };
  constructor(private activatedRoute: ActivatedRoute, private fb : FormBuilder , private service : ApiServiceService ,private router : Router , private toast : ToastService) { 
    this.activatedRoute.params.subscribe(params => {
      this.params = params.id;
    }) 
  }

  ngOnInit(): void {
  }

  resetPassword = this.fb.group({
    password : ['',Validators.required],
    confirm_password : ['',Validators.required],
    _id : ['']
  })

  onSubmit(){
    this.resetPassword.controls['_id'].setValue(this.params);
    if(this.resetPassword.invalid){
      this.validateAllFields(this.resetPassword); 
    }else{
      console.log("FORM GROUP"+this.resetPassword.value);
      this.service.resetPassword(this.resetPassword.value).subscribe(res=>{
        this.responce = JSON.parse(JSON.stringify(res));
        console.log(this.responce);
        const options = { opacity: 1 };
        if(this.responce.success){
          this.toast.success(this.responce.message, '', options);
          this.router.navigate(['/login']);
        }else{
          this.toast.error(this.responce.message, '', options);
          this.resetPassword.reset;
        }
      });
    }
  }

  get login(){
    return this.resetPassword.controls;
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
