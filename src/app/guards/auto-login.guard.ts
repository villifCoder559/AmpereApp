import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { filter, map, take } from 'rxjs/operators';
import { SharedDataService } from '../data/shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  constructor(private authService: AuthenticationService, private shared_data:SharedDataService) { }
 
  canLoad(): Observable<boolean> {    
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map(isAuthenticated => {
        console.log(isAuthenticated)
        if (isAuthenticated) {
          console.log('autologin auth')
          // Directly open inside area
          //this.shared_data.goHomepage()
        } else {          
          // Simply allow access to the login
          console.log('access to login')
          return true;
        }
      })
    );
  }
}
