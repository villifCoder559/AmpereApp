import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents } from '@awesome-cordova-plugins/background-geolocation/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@awesome-cordova-plugins/device-motion/ngx';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { NGSIv2QUERYService } from './ngsiv2-query.service';
import { AlertEvent, SharedDataService } from './shared-data.service';
declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {
  details_emergency = new AlertEvent();
  countFails = 0;
  watchAccelerationFunction;
  offSensorsInterval = 60 * 5 //milliseconds
  checkingPositionNativeTimer = null;
  emergencyNativeTimer: any = null;
  configGeolocation: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 10,
    distanceFilter: 10,
    debug: false, //  enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: true, // enable this to clear background location settings when the app terminates
    interval: 1500,
    fastestInterval: 3000,
    activitiesInterval: 2000
  };
  constructor(private platfrom: Platform, private translate: TranslateService, private backgroundGeolocation: BackgroundGeolocation, private NGSIv2Query: NGSIv2QUERYService, private localNotifications: LocalNotifications, private deviceMotion: DeviceMotion, public shared_data: SharedDataService, private router: Router) {
    //this.shared_data.moveAppToForeground();
  }
  startGeolocating() {
    this.platfrom.ready().then(() => {
      this.backgroundGeolocation.configure(this.configGeolocation)
      console.log('Starting geolocation background...')
      this.backgroundGeolocation.start();
      this.activateSensors();
    })
    //}
  }
  stopSendEmergency() {
    // clearTimeout(this.emergencyTimeout);
    console.log('STOP_SEND_EMERGENCY')
    this.emergencyNativeTimer.stop();
    this.emergencyNativeTimer = null;
    this.shared_data.is_sending_emergency.next(false)
    this.backgroundGeolocation.stop().catch((err) => console.log(err));
    this.timerStopCheckPosition();
    //this.backgroundGeolocation.finish().catch((err) => console.log(err)); No work

  }
  timeout_start;
  sendTestBattery(){
    this.details_emergency.status='test-battery'
    this.details_emergency.evolution='end';
    this.shared_data.changeDateRememberTest(this.details_emergency.deviceID);
    this.sendEmergencyImmediately();
  }
  sendEmergencyImmediately() {
    this.shared_data.createToast('ALERT.detect_position', 2000);
    this.getPosition().then(() => {
      this.sendEmergency(1);
    })
  }
  sendEmergency(timer = 20) {
    //this.shared_data.playSound();
    this.startGeolocating();
    this.shared_data.moveAppToForeground();
    this.timeout_start = Date.now();
    this.shared_data.is_sending_emergency.next(true)
    this.localNotifications.schedule({
      id: 0,
      text: this.translate.instant('NOTIFICATION.receive_alert'),
      data: ""
    })
    if (this.emergencyNativeTimer != null) {
      this.emergencyNativeTimer.stop();
      this.emergencyNativeTimer = null;
      console.log('CLEAR_TIMEOUT')
    }
    this.emergencyNativeTimer = new window.nativeTimer();
    this.emergencyNativeTimer.onTick = (tick) => {
      console.log('emergency_Timeout')
      if (tick == timer) {
        this.shared_data.createToast(this.translate.instant('ALERT.send_emergency'), 4000);
        console.log('Create Emergency')
        this.getPosition().then(() => {
          if(!this.shared_data.enabled_test_battery_mode.getValue())
            this.setTimerCheckPosition();
          this.sendAlert().then(() => {
            console.log('emergency Sended')
            if (!this.shared_data.enabled_test_battery_mode.getValue())
              this.shared_data.createToast(this.translate.instant('ALERT.send_emergency_succ'))
            else
              this.shared_data.createToast(this.translate.instant('ALERT.end_battery_test'))
            //this.shared_data.enableAllBackgroundMode();
            this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
            this.emergencyNativeTimer.stop();
            this.shared_data.enabled_test_battery_mode.next(false);
            this.shared_data.is_sending_emergency.next(false)
          }, err => {
            console.log(err)
            this.localNotifications.schedule({
              id: 2,
              text: this.translate.instant('SHOW_ALERT.error'),
              data: ""
            })
            this.emergencyNativeTimer.stop();
            this.emergencyNativeTimer = null;
            this.shared_data.is_sending_emergency.next(false)
            this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
          });
        }, err => console.log(err))
      }
    }
    this.emergencyNativeTimer.start(1, 1000);
  }

  getPosition() {
    return new Promise((resolve, reject) => {
      console.log('startwatchPosition')
      this.backgroundGeolocation.getCurrentLocation({ maximumAge: 25000, enableHighAccuracy: true, timeout: 60000 }).catch(err => reject(err)).then((position) => {
        console.log(position)
        this.setPositionToSend(position)
        //this.backgroundGeolocation.deleteAllLocations()
        resolve(true)
      }, err => reject(err))
    })
  }
  private timerStopCheckPosition() {
    if (this.checkingPositionNativeTimer != null) {
      console.log('STOP')
      this.checkingPositionNativeTimer.stop();
      this.checkingPositionNativeTimer = null;
    }
    this.backgroundGeolocation.stop().catch(err => console.log(err))
    console.log('Stop Background')
  }
  private setTimerCheckPosition() {
    this.checkingPositionNativeTimer = new window.nativeTimer();
    this.checkingPositionNativeTimer.onTick = (tick) => {
      if (tick % 5 == 0)
        this.backgroundGeolocation.getCurrentLocation({ maximumAge: 5000, timeout: 20000, enableHighAccuracy: true }).then((position) => {
          console.log('intervall')
          console.log(position)
          if (position.time != new Date(this.details_emergency.dateObserved).getTime()) {
            var distance = this.distance(this.details_emergency.latitude, this.details_emergency.longitude, position.latitude, position.longitude);
            if (distance >= 100 || position.accuracy < this.details_emergency.accuracy - 15) {
              this.setPositionToSend(position)
              this.sendEmergency()
            }
          }
          console.log()
        }, err => console.log(err))
      if (tick > this.offSensorsInterval){
        this.checkingPositionNativeTimer.stop();
        this.backgroundGeolocation.stop().catch(err => console.log(err))
      }
    };
    this.checkingPositionNativeTimer.start(1, 1000);
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
    var freq = 1000;
    this.watchAccelerationFunction = this.deviceMotion.watchAcceleration({ frequency: freq }).subscribe((acceleration: DeviceMotionAccelerationData) => {
      this.details_emergency.accelX = acceleration.x;
      this.details_emergency.accelY = acceleration.y;
      this.details_emergency.accelZ = acceleration.z;
    })
  }
  native_timer_watch_acceleration;
  private activateSensors() {
    console.log('GETTING_POSITION')
    this.getPosition().then(() => {
      console.log('GETTING_ACCELERATION')
      this.getAcceleration()
      if (this.native_timer_watch_acceleration != null)
        this.native_timer_watch_acceleration.stop();
      this.native_timer_watch_acceleration = new window.nativeTimer();
      this.native_timer_watch_acceleration.onTick = (tick) => {
        if (tick > this.offSensorsInterval) {
          console.log('Stop watch Acceleration')
          this.watchAccelerationFunction.unsubscribe();
          this.native_timer_watch_acceleration.stop();
          this.native_timer_watch_acceleration = null;
        }
      }
      this.native_timer_watch_acceleration.start(1, 1000)
    }, err => { this.activateSensors(); })
  }
  distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
      c(lat1 * p) * c(lat2 * p) *
      (1 - c((lon2 - lon1) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
  navive_timer_attemps;
  private sendAlert() {
    return new Promise((resolve, reject) => {
      this.NGSIv2Query.sendAlertEvent(this.details_emergency).then(() => {
        console.log('ALERT_EVENT_SENDED')
        if (!this.shared_data.enabled_test_battery_mode.getValue())
          this.localNotifications.schedule({
            id: 2,
            text: this.translate.instant('NOTIFICATION.send_alert'),
            data: ""
          })
        resolve(true);
      }, err => {
        console.log(err)
        console.log('error')
        if (this.navive_timer_attemps == null) {
          this.navive_timer_attemps = new window.nativeTimer();
          this.navive_timer_attemps.onTick = (tick) => {
            if (tick % 4 == 0) {
              console.log('Fail nr. ' + this.countFails)
              this.countFails++;
              if (this.countFails < 5)
                this.sendAlert().catch((err) => { console.log('ERROR->SendAlert'); reject(err) }).then(() => resolve(true));
              else {
                this.navive_timer_attemps.stop();
                this.navive_timer_attemps = null;
                reject(err)
              }
            }
          }
          this.navive_timer_attemps.start(1, 1000)
        }
      })
    })
  }
}
