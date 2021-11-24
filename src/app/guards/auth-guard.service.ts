import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { SharedDataService } from '../data/shared-data.service';
import {AuthenticationService} from '../services/authentication.service'
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService:AuthenticationService,private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log(route)
    if (this.authService.isAuthenticated.getValue())
      return true;
    else {
      console.log('Token expired')
      this.router.navigateByUrl("", { replaceUrl: true }).then(() => {
        return false
      }, (err) => { return false })
    }
  }
}
