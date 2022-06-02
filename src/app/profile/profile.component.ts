import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import { ApiServiceService } from '../api-service.service';
import { ToastService } from 'ng-uikit-pro-standard';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { FormGroup, FormControl, Validators,FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  hours : any;
  minutes : any;
  days : string[] = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  cookieValue : any;
  yogestyle : any;
  responce : any;
  
  data : any;
  check : boolean =  false;
  familarities : any;
  selectedItemsList = [];
  checkedIDs = [];
  style : string[] = [];
  socials : string[] = [];

  constructor(private cookieService:CookieService , private router : Router ,private service : ApiServiceService,private toast: ToastService, private fb : FormBuilder) { 
    // this.days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    this.yogestyle = ['Ashtanga','Hatha','Vinyasa','Power Yoga','Restorative','Gentle','Kundalini','Meditation','Pranayama'];
    this.hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
    this.minutes =[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40.41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59];
  }

  ngOnInit(): void {
    this.createDeliveryForm() 
    this.cookieValue = this.cookieService.get('token');
    if(this.cookieValue == ""){
      this.router.navigate(['/login']);
    }else{
      this.cookieValue = JSON.parse(this.cookieService.get('user_data'));
      console.log(this.cookieValue.user._id);
      this.service.userDetails().subscribe(res=>{
        console.log(res);
        this.responce = JSON.parse(JSON.stringify(res));
        const options = { opacity: 1 };
        if(this.responce.success){
          this.data = this.responce.data;
          this.service.familarities().subscribe((list)=>{
            this.responce = JSON.parse(JSON.stringify(list));
            if(this.responce.success){
              this.familarities = this.responce.data;
              console.log("FAMILARITIES"+this.familarities);
            }
          })
          console.log(this.data.profile_status);
          if(this.data.profile_status == 1){
            this.router.navigate(['/dashboard']);
          }
        }
      });
    }
  }
  

  profileForm = this.fb.group({
    first_name : ['',Validators.required],
    last_name : ['',Validators.required],
    phone_number : ['',Validators.required],
    email : ['',Validators.required],
    age : ['',Validators.required],
    gender : ['',Validators.required],
    education_qualification : ['',Validators.required],
    specialization : ['',Validators.required],
    teaching_hours : ['',Validators.required],
    accreditation : ['',Validators.required],
    method : ['',Validators.required],
    familarity : ['',Validators.required],
    social_media :[[]],
    // timing : this.fb.group({
    //   day : [[]],
    //   start_hour : [[]],
    //   start_min : [[]],
    //   end_hour : [[]],
    //   end_min : [[]]
    // }),
    timing : this.fb.array([ ]),
    yoga_style :[[]],
    profile_pic : ['',Validators.required],
    certificate_file : ['',Validators.required],
    yoga_video : ['',Validators.required],
    accept : ['',Validators.required],
    teacher_id : ['']
  });

  createDeliveryForm(){
    for(let i=0;i<this.days.length;i++){
      console.log(this.days[i])
        this.timing().push(this.newtiming(this.days[i]));
    }
  }

  newtiming(data:string) : FormGroup{
    return this.fb.group({
      day : [false],
      start_hour : [''],
      start_min : [''],
      end_hour : [''],
      end_min : ['']
    })
  }
  timing(): FormArray {
    return this.profileForm.get("timing") as FormArray;
  }

  getControls() {
    return (this.profileForm.get("timing") as FormArray).controls;
  }
  
  onSubmit(){
    this.profileForm.controls['teacher_id'].setValue(this.cookieValue.user._id);
    console.log(this.profileForm.value);
    if(this.profileForm.valid){
      this.service.profile(this.profileForm.value).subscribe((res)=>{
        // this.router.navigate(["/dashboard"]);
        this.responce = res;
        if(this.responce.data.acc_verify == 1){
          this.router.navigate(["/dashboard"]);
        }else{
          this.router.navigate(["/approval"]);
        }
        console.log(res);
      })
    }else{
      this.validateAllFields(this.profileForm); 
    }
  }

  get login(){
    return this.profileForm.controls;
  }

  onStyleChange(event:any){
    const name = event.target.value;
    if(event.target.checked){
      this.style.push(name);
    }else{
      this.style = this.style.filter(function(elem){
        return elem != name;
      }); 
    }
    console.log(this.style);
  }
  
  onSocialChange(event : any){
    const name = event.target.value;
    if(event.target.checked){
      this.socials.push(name);
    }else{
      this.socials = this.socials.filter(function(elem){
        return elem != name;
      }); 
    }
    console.log(this.socials);
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
