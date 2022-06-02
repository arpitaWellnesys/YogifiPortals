import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService  } from '../api-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from 'ng-uikit-pro-standard';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  params : any; 
  responce = {
    success : 0,
    message : '',
    data : []
  };  

  data : any;
  dashdata : any;
  cookieValue : any;

  constructor( private cookieService:CookieService  , private activatedRoute: ActivatedRoute, private fb : FormBuilder , private service : ApiServiceService ,private router : Router , private toast : ToastService) { 
    this.activatedRoute.params.subscribe(params => {
      this.params = params.id;
    }) 
  }

  changePassword = this.fb.group({
    password : ['',Validators.required],
    new_password : ['',Validators.required],
    confirm_password : ['',Validators.required],
    _id : ['']
  })

  ngOnInit(): void {
    this.cookieValue = JSON.parse(this.cookieService.get('user_data'));
    this.dashdata = this.cookieValue.users;
    this.service.userDetails().subscribe(res=>{
      console.log(res);
      this.responce = JSON.parse(JSON.stringify(res));
      const options = { opacity: 1 };
      if(this.responce.success){
        this.data = this.responce.data;
      }
    });
  }

  get login(){
    return this.changePassword.controls;
  }

  onSubmit(){
    this.changePassword.controls['_id'].setValue(this.data._id);
    if(this.changePassword.invalid){
      this.validateAllFields(this.changePassword); 
    }else{
      console.log("FORM GROUP"+this.changePassword.value);
      this.service.changePassword(this.changePassword.value).subscribe(res=>{
        this.responce = JSON.parse(JSON.stringify(res));
        console.log(this.responce);
        const options = { opacity: 1 };
        if(this.responce.success){
          this.toast.success(this.responce.message, '', options);
          this.cookieService.delete('token');
          this.cookieService.delete('user_data');
          this.router.navigate(['/login']);
        } else {
          this.toast.error(this.responce.message, '', options);
          this.changePassword.reset;
        }
      });
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

}
