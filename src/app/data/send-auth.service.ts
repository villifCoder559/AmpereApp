import { Injectable } from '@angular/core';
import { NGSIv2QUERYService } from './ngsiv2-query.service';
import { DeviceType, SharedDataService } from './shared-data.service';
import { JwtHelperService } from '@auth0/angular-jwt'
import { AuthenticationService } from '../services/authentication.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Platform } from '@ionic/angular';
import BackgroundFetch from "cordova-plugin-background-fetch";

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class SendAuthService {
  interval_active_user = null;
  requestTokenTimeout = null;

  constructor(private platform: Platform, private localNotifications: LocalNotifications, private shared_data: SharedDataService, private ngsi: NGSIv2QUERYService, private authService: AuthenticationService) {
  }
  async onDeviceReady() {
    // Your BackgroundFetch event handler.
    console.log('OnDeviceReady')
    let onEvent = async (taskId) => {
      console.log('[BackgroundFetch] event received: ', taskId);
      var date=new Date().toISOString();
      console.log(date)
      if (this.authService.isAuthenticated)
        this.ngsi.sendUserProfile();
      else{
        console.log('Stop BACKGROUND_FETCH')
        BackgroundFetch.stop()
      }
      //this.checkAndRequestValidToken()
      // Required: Signal completion of your task to native code
      // If you fail to do this, the OS can terminate your app
      // or assign battery-blame for consuming too much background-time
      BackgroundFetch.finish(taskId);
    };

    // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
    let onTimeout = async (taskId) => {
      console.log('[BackgroundFetch] TIMEOUT: ', taskId);
      BackgroundFetch.finish(taskId);
    };
    // Configure the plugin.
    let status = await BackgroundFetch.configure({ minimumFetchInterval: 15 }, onEvent, onTimeout);
    console.log('[BackgroundFetch] configure, status: ', status);
  }
  sendStatus(state: "expired" | "valid") {
    this.shared_data.user_data.dateObserved = new Date().toISOString();
    if (state == 'expired')
      this.shared_data.user_data.status = 'token_expired'
    else
      this.shared_data.user_data.status = 'active'
    this.ngsi.updateEntity({ "status": { "value": this.shared_data.user_data.status } }, DeviceType.PROFILE).catch((err) => console.log(err))
  }
  startSendingValidStatus() {
    this.platform.ready().then(this.onDeviceReady.bind(this))
  }

  checkAndRequestValidToken() {
    var now_date = new Date();
    var expiration_date_token = new Date(helper.getTokenExpirationDate(this.shared_data.accessToken))
    console.log('EXPIRATION_TOKEN')
    console.log(expiration_date_token)
    //this.requestTokenTimeout = setTimeout(() => {
    this.authService.keycloak.updateToken(30).then((refreshed) => {
      this.shared_data.accessToken = this.authService.keycloak.token;
      if (refreshed)
        console.log('Token updated successfully')
      else
        console.log('token still valid')
      this.sendStatus('valid')
    }, err => {
      console.log(err)
      this.sendStatus('expired');
      this.localNotifications.schedule({
        text: 'Session is expired, login to contine using application! ',
        launch: true
      })
    })
    //}, expiration_date_token.getTime() - now_date.getTime())
  }
  clearAllInterval() {
    clearInterval(this.interval_active_user)
    clearTimeout(this.requestTokenTimeout)
  }
}
