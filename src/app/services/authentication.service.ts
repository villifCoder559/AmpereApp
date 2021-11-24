import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { SharedDataService } from '../data/shared-data.service'
import * as Keycloak from 'keycloak-ionic/keycloak';
import { BluetoothService } from '../data/bluetooth.service'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public keycloak: Keycloak.KeycloakInstance;
  constructor() {
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
          url: "https://www.snap4city.org/auth/"
        });
      }
      this.keycloak.init({
        onLoad: 'login-required',
        adapter: 'cordova'
      }).then((autentication) => {
        console.log('autentication')
        console.log(autentication)
        if (autentication) {
          //this.sharedData.snap4city_logged = true;
          //alert("Success Auth")
          console.log('autenticated')
          console.log('token '+this.keycloak.token)
          console.log('profile '+this.keycloak.profile)
          resolve(true);
        }
        else
          this.keycloak.login().then((value) => {
            console.log('authenticated!');
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
    this.isAuthenticated.next(false);  
    window.localStorage.removeItem('TOKEN_KEY');
    if(this.keycloak!=null)
      this.keycloak.logout();    
  }
}
