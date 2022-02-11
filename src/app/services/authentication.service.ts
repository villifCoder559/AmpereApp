import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import * as Keycloak from 'keycloak-ionic/keycloak';
import { SharedDataService, UserData } from '../data/shared-data.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public keycloak: Keycloak.KeycloakInstance;
  constructor(private shareData: SharedDataService, private router: Router) {
    //this.loadToken();
  }

  // loadToken() {
  //   const token = window.localStorage.getItem('TOKEN_KEY');
  //   console.log('Token_get '+ token)
  //   if (token != null) {
  //     console.log('set token: ', token);
  //     //this.shared_data.loadDataUser();
  //     this.shared_data.setIs_logged(true);
  //     this.isAuthenticated.next(true);
  //   } else {
  //     this.isAuthenticated.next(false);
  //   }
  // }

  login(credentials: { email, password }): Observable<any> {
    this.isAuthenticated.next(true)
    return this.isAuthenticated
    // return this.http.post(`https://reqres.in/api/login`, credentials).pipe(
    //   map((data: any) => {
    //     this.token = data.token;
    //     window.localStorage.setItem('TOKEN_KEY', this.token);
    //     this.shared_data.setIs_logged(true);
    //     this.isAuthenticated.next(true);
    //   })
    // )
  }
  loginSnap4City() {
    return new Promise<boolean>((resolve, reject) => {
      if (this.keycloak == null) {
        console.log('keycloak null')
        this.keycloak = Keycloak({
          clientId: 'js-snap4city-mobile-app',
          realm: 'master',
          url: "https://www.snap4city.org/auth/",
        });
      }
      this.keycloak.init({
        onLoad: 'login-required',
        adapter: 'cordova'
      }).then((autentication) => {
        //console.log('autentication')
        //console.log(autentication)
        // this.keycloak.updateToken(30).then((result) => {
        //   console.log('Token successfully refreshed')
        //   console.log(this.keycloak.refreshToken)
        // }, (err) => {
        //   console.log(err)
        // })
        if (autentication) {
          //this.isAuthenticated.next(true);
          this.keycloak.loadUserProfile().then((info: any) => {
            this.shareData.user_data.id = info.username;
            console.log(this.shareData.user_data.id)
            console.log('token ' + this.keycloak.token)
            console.log('refresh_token ' + this.keycloak.refreshToken) //Use this token!
            resolve(true);
          })
        }
        else
          this.keycloak.login().then((value) => {
            //this.isAuthenticated.next(true)
            console.log('authenticated else!');
            console.log(value)
            resolve(true)
          });
      }, (err) => {
        alert(err);
        reject(false)
      })
    })
  }
  logout() {
    //this.bluetoothService.disableAll();
    window.localStorage.removeItem('TOKEN_KEY');
    this.shareData.user_data = new UserData();
    if (this.keycloak != null)
      this.keycloak.logout().then(() => this.isAuthenticated.next(false));
    else
      this.isAuthenticated.next(false);

  }
}
