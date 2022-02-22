import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import * as Keycloak from 'keycloak-ionic/keycloak';
import { SharedDataService, UserData } from '../data/shared-data.service';
import { Router } from '@angular/router';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public keycloak: Keycloak.KeycloakInstance;
  constructor(private localNotifications: LocalNotifications, private shareData: SharedDataService, private router: Router) {
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
      })
        .then((autentication) => {
          if (autentication) {
            this.keycloak.loadUserProfile().then((info: any) => {
              this.keycloak.onTokenExpired = () => {
                this.keycloak.updateToken(30).then((refreshed) => {
                  if (refreshed)
                    console.log('token refreshed correctly')
                  else
                    console.log('Token still valid')
                }, err => {
                  console.log(err)
                  this.localNotifications.schedule({
                    text: 'Token expired, login to continue using the app!'
                  })
                  this.logout();
                })
              }
              this.shareData.user_data.id = info.username;
              console.log(this.shareData.user_data.id)
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
