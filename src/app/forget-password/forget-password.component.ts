import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators,FormBuilder, FormArray } from '@angular/forms';
import { ApiServiceService  } from '../api-service.service';
import {Router} from '@angular/router';
import {ToastService} from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  responce = {
    success : '',
    message : '',
    data : []
  };

  constructor( private fb : FormBuilder, private service : ApiServiceService ,private router : Router , private toast : ToastService
    ) { }

  forgetPassword = this.fb.group({
    email : ['',[Validators.required,Validators.email]]
  });

  get login(){
    return this.forgetPassword.controls;
  }


  onSubmit(){
    console.log(this.forgetPassword.value);
    if(this.forgetPassword.valid){
      this.service.forgetPassword(this.forgetPassword.value).subscribe(res=>{
        this.responce = JSON.parse(JSON.stringify(res));
        const options = { opacity: 1 };
        if(this.responce.success){
          this.toast.error(this.responce.message, '', options);
          this.router.navigate(['/login']);
        } else{
          this.toast.error(this.responce.message, '', options);
          this.forgetPassword.reset;
        }
      });
    }else{
      this.validateAllFields(this.forgetPassword); 
    }
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

  ngOnInit(): void {
  }

}
