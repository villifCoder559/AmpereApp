import { Injectable, NgModule } from '@angular/core';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import * as Keycloak from 'keycloak-ionic/keycloak';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  requestTokenTimeout = null;
  public keycloak: Keycloak.KeycloakInstance;
  constructor() {}
  
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
      })
        .then((autentication) => {
          if (autentication) {
            this.keycloak.loadUserProfile().then((info: any) => {
              //this.shareData.user_data.id = info.username;
              console.log('token ' + this.keycloak.token)
              console.log(info)
              resolve(true);
            })
          }
          else
            this.keycloak.login().then((value) => {
              console.log('authenticated else!');
              console.log(value)
              resolve(true)
            });
        }, (err) => {
          reject(err)
        })
    })
  }
  logout() {
    return new Promise((resolve, reject) => {
      //this.shareData.user_data = new UserData();
      this.keycloak.logout().then(() => {
        this.isAuthenticated.next(false)
        resolve(true)
      }, err => reject(err));
    })
  }
}
