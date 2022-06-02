import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardServiceService {

  constructor(private cookieService:CookieService ) { }

  gettoken(){  
    return !!this.cookieService.get('token');
  }
 
}
