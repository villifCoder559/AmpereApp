import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { SharedDataService } from '../data/shared-data.service'
import * as Keycloak from 'keycloak-ionic/keycloak';
import { BluetoothService } from '../data/bluetooth.service'
import { NGSIv2QUERYService, Entity } from '../data/ngsiv2-query.service'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public keycloak: Keycloak.KeycloakInstance;
  token = '';
  constructor(private ngsiv2QUERY: NGSIv2QUERYService, private bluetoothService: BluetoothService, private http: HttpClient, private shared_data: SharedDataService) {
    this.loadToken();

  }

  loadToken() {
    const token = window.localStorage.getItem('TOKEN_KEY');
    console.log('Token_get')
    if (token != null) {
      console.log('set token: ', token);
      this.token = token;
      this.shared_data.loadDataUser();
      this.shared_data.setIs_logged(true);
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

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
          console.log('autenticato')
          this.shared_data.enableAllBackgroundMode();
          this.ngsiv2QUERY.getEntity(Entity.USERID).then(() => {
            this.bluetoothService.autoConnectBluetooth();
            this.bluetoothService.enableNotificationTurnOffBluetooth()
            resolve(true)
          },(err)=>alert(err))
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
  async logout() {
    this.isAuthenticated.next(false);
    this.shared_data.setIs_logged(false);
    this.shared_data.disableBackgaundMode();
    this.bluetoothService.disconnectAllDevices();
    this.bluetoothService.disableNotificationTurnOffBluetooth()
    window.localStorage.removeItem('TOKEN_KEY');
    console.log(this.shared_data.snap4city_logged)
    if (this.shared_data.snap4city_logged) {
      this.keycloak.logout();
      console.log('logout')
      this.shared_data.snap4city_logged = false;
    }
  }
}
