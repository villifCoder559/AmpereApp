import { Injectable } from '@angular/core';
import { NGSIv2QUERYService } from './ngsiv2-query.service';
import { DeviceType, SharedDataService } from './shared-data.service';
import { AuthenticationService } from '../services/authentication.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Platform } from '@ionic/angular';
import BackgroundFetch from "cordova-plugin-background-fetch";

@Injectable({
  providedIn: 'root'
})
export class SendAuthService {
  constructor(private platform: Platform, private localNotifications: LocalNotifications, private shared_data: SharedDataService, private ngsi: NGSIv2QUERYService, private authService: AuthenticationService) { }

  private async onDeviceReady() {
    // Your BackgroundFetch event handler.
    console.log('OnDeviceReady')
    let onEvent = async (taskId) => {
      console.log('[BackgroundFetch] event received: ', taskId);
      var date = new Date().toISOString();
      console.log(date)
      if (this.authService.isAuthenticated) {
        this.ngsi.updateBackgroundEntity({ "status": { "value": this.shared_data.user_data.status }, "dateObserved": { "value": date } }, DeviceType.PROFILE).catch((err) => console.log(err))
      }
      else {
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

  startSendingValidStatus() {
    this.platform.ready().then(this.onDeviceReady.bind(this))
  }
}
