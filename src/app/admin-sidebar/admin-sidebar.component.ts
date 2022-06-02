import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import { ApiServiceService } from '../api-service.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {

  constructor(private cookieService:CookieService , private router : Router ,private service : ApiServiceService,private toast: ToastService , private fb : FormBuilder) { }
  cookieValue : any;
  responce : any;
  data : any;
  teacher_id : any;
  fileData : any;

  ngOnInit(): void {
    this.cookieValue = this.cookieService.get('user_data');
    if(this.cookieValue == ""){
      this.router.navigate(['/login']);
    } else{
      this.data  = JSON.parse(this.cookieValue);
      console.log("top bar", this.data);
      this.teacher_id = this.data.users._id;
      console.log('teacher id',this.teacher_id);
    }
  }

  onSubmit(){
    
    this.uploadContent.controls['teacher_id'].setValue(this.teacher_id);
    this.uploadContent.controls['file'].setValue(this.fileData);
    console.log(this.uploadContent.value);
    if(this.uploadContent.valid){
      this.service.uploadContent(this.uploadContent.value).subscribe((res)=>{
        this.responce = res;
        const options = { opacity: 1 };
        if(this.responce.success){
          this.toast.success(this.responce.message, '', options);
        }else{
          this.toast.error(this.responce.message, '', options);
          window.location.reload();
        }
      })
    }else{
      this.validateAllFields(this.uploadContent); 
    }
  }

  get login(){
    return this.uploadContent.controls;
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

  uploadContent = this.fb.group({
    filedata : ['' , Validators.required],
    url : ['', Validators.required],
    teacher_id : ['', Validators.required],
    file : ['']
  });

  upload(event:any){
    $("#imgupload").click();
  }

  logout(){
    // alert("logout");
    console.log("logout");
    this.cookieService.delete('token');
    this.cookieService.delete('user_data');
    this.router.navigate(['/login']);
  }

  handleUpload(event:any , id : any) {
    console.log(id);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        this.fileData = reader.result;
    };
  }

}
