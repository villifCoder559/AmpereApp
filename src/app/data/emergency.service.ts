import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@awesome-cordova-plugins/background-geolocation/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@awesome-cordova-plugins/device-motion/ngx';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { NGSIv2QUERYService } from './ngsiv2-query.service';
import { AlertEvent, SharedDataService } from './shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {
  details_emergency = new AlertEvent();
  countFails = 0;
  watchAccelerationFunction;
  offSensorsInterval = 300000 //milliseconds
  checkingPositionInterval = null;
  emergencyTimeout: any = null;
  configGeolocation: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 10,
    distanceFilter: 10,
    debug: false, //  enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: true, // enable this to clear background location settings when the app terminates
    interval: 3000,
    fastestInterval: 4000,
    activitiesInterval: 1500
  };
  constructor(private platfrom: Platform, private translate: TranslateService, private backgroundGeolocation: BackgroundGeolocation, private NGSIv2Query: NGSIv2QUERYService, private localNotifications: LocalNotifications, private deviceMotion: DeviceMotion, public shared_data: SharedDataService, private router: Router) {
    //this.shared_data.moveAppToForeground();
    console.log('LOCAL_NOTIFICATION')
  }
  startGeolocating() {
    this.platfrom.ready().then(() => {
      this.backgroundGeolocation.configure(this.configGeolocation).then(() => {
        console.log('Starting geolocation background...')
        this.backgroundGeolocation.start();
      })
      //}
    })
  }
  stopSendEmergency() {
    clearTimeout(this.emergencyTimeout);
    this.backgroundGeolocation.stop().catch((err) => console.log(err));
    this.shared_data.is_sending_emergency.next(false)
  }
  timeout_start;
  send_Emergency(timer = 20000) {
    //console.log(event)
    //if (event.action === 'done') {
    //this.shared_data.moveAppToForeground();
    this.timeout_start=Date.now();
    this.shared_data.is_sending_emergency.next(true)
    this.localNotifications.schedule({
      id: 0,
      text: this.translate.instant('NOTIFICATION.receive_alert'),
      data: ""
    })
    this.startGeolocating();
    if (this.emergencyTimeout != null)
      clearTimeout(this.emergencyTimeout)
    this.emergencyTimeout = setTimeout(() => {
      console.log('activateSensors')
      this.shared_data.createToast(this.translate.instant('ALERT.send_emergency'), 4000);
      this.activateSensors().then(() => {
        console.log('sendEmergency')
        this.sendAlert().then(() => {
          console.log('emergencySended')
          this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
          if (!this.shared_data.enabled_test_battery_mode.getValue())
            this.shared_data.createToast(this.translate.instant('ALERT.send_emergency_succ'))
          else
            this.shared_data.createToast(this.translate.instant('ALERT.end_battery_test'))
          this.shared_data.is_sending_emergency.next(false)
        }, err => {
          this.localNotifications.schedule({
            id: 2,
            text: this.translate.instant('SHOW-ALERT.error'),
            data: ""
          })
          this.shared_data.is_sending_emergency.next(false)
          this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
        });
      }, err => {
        this.localNotifications.schedule({
          id: 2,
          text: this.translate.instant('SHOW-ALERT_error'),
          data: ""
        })
        this.shared_data.is_sending_emergency.next(false)
        this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
      })
    }, timer)
    //}
  }

  getPosition() {
    return new Promise((resolve, reject) => {
      console.log('startwatchPosition')
      this.backgroundGeolocation.getCurrentLocation({ maximumAge: 10000, enableHighAccuracy: true, timeout: 12000000 }).catch(err => reject(err)).then((position) => {
        console.log(position)
        this.setPositionToSend(position)
        if (this.checkingPositionInterval !== null)
          clearInterval(this.checkingPositionInterval)
        this.checkingPositionInterval = this.setIntervalPositionCheck()
        this.timeoutStopCheckPosition();
        this.backgroundGeolocation.deleteAllLocations()
        resolve(true)
      }, err => reject(err))
      // start recording location
      console.log('getCurrentPosition')
    })
  }
  timeout_position;
  private timeoutStopCheckPosition() {
    if (this.timeout_position != null)
      clearTimeout(this.timeout_position)
    this.timeout_position = setTimeout(() => {
      clearInterval(this.checkingPositionInterval);
      this.backgroundGeolocation.stop().catch(err => console.log(err))
    }, this.offSensorsInterval)
  }
  private setIntervalPositionCheck() {
    return setInterval(() => (
      this.backgroundGeolocation.getCurrentLocation().then((position) => {
        console.log('intervall')
        console.log(position)
        if (position.time != new Date(this.details_emergency.dateObserved).getTime()) {
          var distance = this.distance(this.details_emergency.latitude, this.details_emergency.longitude, position.latitude, position.longitude);
          if (distance >= 100) {
            this.setPositionToSend(position)
            this.send_Emergency()
          }
        }
        console.log()
      }, err => console.log(err))
    ), 5000)
  }
  private setPositionToSend(position) {
    this.details_emergency.latitude = position.latitude;
    this.details_emergency.longitude = position.longitude;
    this.details_emergency.quote = position.altitude != undefined ? position.altitude : 0;
    this.details_emergency.velocity = position.speed != undefined ? position.speed : 0;
    this.details_emergency.accuracy = position.accuracy;
    this.details_emergency.dateObserved = new Date().toISOString();
  }
  getAcceleration() {
    return new Promise((resolve, reject) => {
      var freq = 1000;
      this.watchAccelerationFunction = this.deviceMotion.watchAcceleration({ frequency: freq }).subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.details_emergency.accelX = acceleration.x;
        this.details_emergency.accelY = acceleration.y;
        this.details_emergency.accelZ = acceleration.z;
        resolve(true);
      }, (err) => {
        console.log(err)
        reject(err);
      })
    })
  }
  timeout_watch_acceleration;
  private activateSensors() {
    return new Promise((resolve) => {
      console.log('GETPOSITION')
      this.getPosition().then(() => {
        console.log('GETACCELERATION')
        this.getAcceleration().then(() => {
          if (this.timeout_watch_acceleration != null)
            clearTimeout(this.timeout_watch_acceleration);
          this.timeout_watch_acceleration = setTimeout(() => {
            this.watchAccelerationFunction.unsubscribe();
          }, this.offSensorsInterval)
          console.log('resolve')
          resolve(true)
        }, err => resolve(false))
      }, err => { this.activateSensors() })
    })

  }
  distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
      c(lat1 * p) * c(lat2 * p) *
      (1 - c((lon2 - lon1) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
  private sendAlert() {
    return new Promise((resolve, reject) => {
      this.NGSIv2Query.sendAlertEvent(this.details_emergency).then(() => {
        if (!this.shared_data.enabled_test_battery_mode.getValue())
          this.localNotifications.schedule({
            id: 2,
            text: this.translate.instant('NOTIFICATION.send_alert'),
            data: ""
          })
        resolve(true);
      }, err => {
        console.log(err)
        setTimeout(() => {
          console.log('Fail nr. ' + this.countFails)
          this.countFails++;
          if (this.countFails < 5)
            this.sendAlert().catch((err) => { console.log('ERROR->SendAlert'); reject(err) });
          else
            reject(err)
        }, 3500)
      })
    })
  }

}
