import { Injectable } from '@angular/core';
import { NGSIv2QUERYService } from './ngsiv2-query.service';
import { DeviceType } from './shared-data.service';
import { AuthenticationService } from '../services/authentication.service';
import { Platform } from '@ionic/angular';
import BackgroundFetch from "cordova-plugin-background-fetch";

@Injectable({
  providedIn: 'root'
})
export class SendAuthService {
  constructor(private platform: Platform, private ngsi: NGSIv2QUERYService, private authService: AuthenticationService) { }

  private async onDeviceReady() {
    // Your BackgroundFetch event handler.
    console.log('OnDeviceReady')
    let onEvent = async (taskId) => {
      console.log('[BackgroundFetch] event received: ', taskId);
      var date = new Date().toISOString();
      console.log(date)
      if (this.authService.isAuthenticated) {
        this.ngsi.updateBackgroundEntity({ "dateObserved": { "value": date } }, DeviceType.PROFILE).catch((err) => console.log(err))
      }
      else {
        console.log('Stop BACKGROUND_FETCH')
        BackgroundFetch.stop()
      }
      BackgroundFetch.finish(taskId);
    };
    // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
    let onTimeout = async (taskId) => {
      console.log('[BackgroundFetch] TIMEOUT: ', taskId);
      BackgroundFetch.finish(taskId);
    };
    let status = await BackgroundFetch.configure({ minimumFetchInterval:30 }, onEvent, onTimeout);
    console.log('[BackgroundFetch] configure, status: ', status);
  }
  startSendingStatus() {
    this.platform.ready().then(this.onDeviceReady.bind(this))
  }
}
