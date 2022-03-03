import { Injectable } from '@angular/core';
import { NGSIv2QUERYService } from './ngsiv2-query.service';
import { SharedDataService } from './shared-data.service';
import { JwtHelperService } from '@auth0/angular-jwt'
import { AuthenticationService } from '../services/authentication.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class SendAuthService {
  interval_active_user = null;
  requestTokenTimeout = null;

  constructor(private localNotifications: LocalNotifications, private shared_data: SharedDataService, private ngsi: NGSIv2QUERYService, private authService: AuthenticationService) { }

  sendStatus(state: "expired" | "valid") {
    this.shared_data.user_data.dateObserved = new Date().toISOString();
    if (state == 'expired')
      this.shared_data.user_data.status = 'token_expired'
    else
      this.shared_data.user_data.status = 'active'
    this.ngsi.sendUserProfile().catch((err) => console.log(err))
  }
  startSendingValidStatus() {
    var status: "valid"
    console.log(typeof(status))
    let time = 1000 * 60 * 30;
    this.sendStatus(status);
    this.interval_active_user = setInterval(() => {
      this.shared_data.user_data.status = typeof(status)
      this.ngsi.sendUserProfile().catch((err) => console.log(err))
    }, time)
  }
  // sendAccessAndCheckStatusToken() {
  //   this.sendStatusToken('valid')
  //   var expiration_date_token = helper.getTokenExpirationDate(this.authService.keycloak.token);
  //   console.log('Expiration token-> ' + expiration_date_token)
  //   this.checkAndRequestValidToken();
  // }
  checkAndRequestValidToken() {
    var now_date = new Date();
    var expiration_date_token = new Date(helper.getTokenExpirationDate(this.authService.keycloak.token))
    this.requestTokenTimeout = setTimeout(() => {
      this.authService.keycloak.updateToken(30).then((refreshed) => {
        this.shared_data.accessToken = this.authService.keycloak.token;
        if (refreshed)
          console.log('Token updated successfully')
        else
          console.log('token still valid')
        this.checkAndRequestValidToken();
      }, err => {
        console.log(err)
        this.sendStatus('expired');
        this.localNotifications.schedule({
          text: 'Session is expired, login to contine using application! ',
          launch: true
        })
      })
    }, expiration_date_token.getTime() - now_date.getTime())
  }
  clearAllInterval() {
    clearInterval(this.interval_active_user)
    clearTimeout(this.requestTokenTimeout)
  }
}
