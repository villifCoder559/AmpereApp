import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { AlertEvent, DeviceType, SharedDataService, UserData } from '../data/shared-data.service'
import { DeviceMotion, DeviceMotionAccelerationData } from '@awesome-cordova-plugins/device-motion/ngx'
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx'
import { NGSIv2QUERYService } from '../data/ngsiv2-query.service'
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@awesome-cordova-plugins/background-geolocation/ngx';
import { TranslateService } from '@ngx-translate/core';
import { EmergencyService } from '../data/emergency.service';

@Component({
  selector: 'app-show-alert',
  templateUrl: './show-alert.page.html',
  styleUrls: ['./show-alert.page.scss'],
})
export class ShowAlertPage implements OnInit {
  pin = ['', '', '', '']
  details_emergency = new AlertEvent();
  countFails = 0;
  valueTimer = 20;
  watchAccelerationFunction;
  offSensorsInterval = 300000 //milliseconds
  checkingPositionInterval = null;
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
  constructor(private emergencyService: EmergencyService, private platfrom: Platform, private translate: TranslateService, private backgroundGeolocation: BackgroundGeolocation, private changeRef: ChangeDetectorRef, private NGSIv2Query: NGSIv2QUERYService, private localNotifications: LocalNotifications, private deviceMotion: DeviceMotion, public shared_data: SharedDataService, private alertController: AlertController, private router: Router) {
    //this.shared_data.moveAppToForeground();
    console.log('LOCAL_NOTIFICATION')
    //this.shared_data.is_sending_emergency.next(true)
  }
  interval_coundown;
  ngAfterViewInit() {
    console.log(this.shared_data.enabled_test_battery_mode.getValue())
    if (!this.shared_data.tour_enabled && !this.shared_data.enabled_test_battery_mode.getValue()) {
      console.log('LEFT')
      var left = (Math.floor((20000 - (Date.now() - this.emergencyService.timeout_start)) / 1000))
      console.log(left)
      console.log(typeof (left))
      //this.countdown.left=left;
      this.valueTimer = left
      this.interval_coundown = setInterval(() => {
        console.log(this.valueTimer)
        if (this.valueTimer > 0)
          this.valueTimer--
        else
          clearInterval(this.interval_coundown);
      }, 1000)
      //this.changeRef.detectChanges();
    }
    if (this.shared_data.tour_enabled) {
      this.valueTimer = 20;
    }
    if (this.shared_data.enabled_test_battery_mode.getValue()) {
      console.log('BATTERY')
      this.details_emergency.status = 'testBattery'
      this.details_emergency.evolution = 'end'
      this.shared_data.enabled_test_battery_mode.next(false);
      this.valueTimer = 0;
      for (let i = 0; i < this.pin.length; i++)
        $('#' + i).attr('disabled', 'disabled')
      //this.changeRef.detectChanges();
    }
  }
  ngOnInit() {

    //this.details_emergency.deviceID = this.router.getCurrentNavigation().extras?.state?.deviceID;
    // this.platfrom.ready().then(() => {
    //   if (!this.shared_data.enabled_test_battery_mode.getValue() && !this.shared_data.tour_enabled) {
    //     this.backgroundGeolocation.configure(this.configGeolocation).then(() => {
    //       console.log('Starting geolocation background...')
    //       this.backgroundGeolocation.start();
    //     })
    // this.localNotifications.addActions('fast-pin', [
    //   { id: 'fast', title: this.translate.instant('ALERT.send_emergency_now') },
    //   { id: 'pin', title: this.translate.instant('ALERT.false_alarm') }])
    // this.localNotifications.on('fast').subscribe(() => {
    //   this.immediateEmergency();
    // })
    // this.localNotifications.on('pin').subscribe(() => {
    //   this.shared_data.moveAppToForeground();
    // })
    // setTimeout(()=>{
    //   this.localNotifications.schedule({
    //     id: 0,
    //     text: 'Emergency notification, click to open and insert PIN to disable alert or click the button to send emergency immediatly',
    //     data: ""
    //   });
    // },2000)

    //   }
    // })
  }

  immediateEmergency() {
    this.valueTimer = 0;
    this.changeRef.detectChanges();
    this.emergencyService.send_Emergency(0)
  }
  onDigitInput(event) {
    console.log(event);
    let element;
    console.log(this.pin)
    if (event.key !== 'Backspace')
      element = event.srcElement.nextElementSibling;

    if (event.key === 'Backspace') {
      element = event.srcElement.previousElementSibling;
      element.select()
    }
    if (element === null) {
      this.checkPin();
    }
    else
      element.focus();
  }
  checkPin() {
    var ok = true;
    // var pin_saved = window.localStorage.getItem('user.password');
    var pin_saved = this.shared_data.user_data.pin;
    console.log('checkPIN')
    console.log(this.shared_data.user_data)
    console.log(this.pin[i])
    for (var i = 0; i < this.pin.length; i++) {
      console.log(pin_saved[i])
      console.log(this.pin[i])
      if (pin_saved[i] != this.pin[i])
        ok = false
    }
    if (!ok) {
      this.presentAlert(this.translate.instant('ALERT.pin_wrong'), 50).then(() => {
        for (var i = this.pin.length - 1; i >= 0; i--) {
          (<HTMLInputElement>document.getElementById(i.toString())).value = '';
          if (i == 0)
            document.getElementById(i.toString()).focus();
        }
      })
    }
    else {
      this.emergencyService.stopSendEmergency()
      this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
    }
  }
  async presentAlert(text, time) {
    const alert = await this.alertController.create({
      cssClass: '',
      header: text,
      subHeader: '',
      message: '',
      buttons: ['OK']
    });
    alert.present().then(async () => {
      await new Promise(f => setTimeout(f, time));
      alert.dismiss();
    });
  }
  // send_Emergency(event) {
  //   console.log(event)
  //   if (event.action === 'done') {
  //     //this.shared_data.moveAppToForeground();
  //     console.log('activateSensors')
  //     this.shared_data.createToast(this.translate.instant('ALERT.send_emergency'), 4000);
  //     this.activateSensors().then(() => {
  //       console.log('sendEmergency')
  //       this.sendAlert().then(() => {
  //         console.log('emergencySended')
  //         this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
  //         if (!this.shared_data.enabled_test_battery_mode.getValue())
  //           this.shared_data.createToast(this.translate.instant('ALERT.send_emergency_succ'))
  //         else
  //           this.shared_data.createToast(this.translate.instant('ALERT.end_battery_test'))
  //         this.shared_data.is_sending_emergency.next(false)
  //       }, err => {
  //         this.localNotifications.schedule({
  //           id: 2,
  //           text: this.translate.instant('SHOW-ALERT_error'),
  //           data: ""
  //         })
  //         this.shared_data.is_sending_emergency.next(false)
  //         this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
  //       });
  //     }, err => {
  //       this.localNotifications.schedule({
  //         id: 2,
  //         text: this.translate.instant('SHOW-ALERT_error'),
  //         data: ""
  //       })
  //       this.shared_data.is_sending_emergency.next(false)
  //       this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
  //     })
  //   }
  // }

  // getPosition() {
  //   return new Promise((resolve, reject) => {
  //     console.log('startwatchPosition')
  //     this.backgroundGeolocation.getCurrentLocation({ maximumAge: 10000, enableHighAccuracy: true, timeout: 12000000 }).catch(err => reject(err)).then((position) => {
  //       console.log(position)
  //       this.setPositionToSend(position)
  //       if (this.checkingPositionInterval !== null)
  //         clearInterval(this.checkingPositionInterval)
  //       this.checkingPositionInterval = this.setIntervalPositionCheck()
  //       this.timeoutStopCheckPosition();
  //       this.backgroundGeolocation.deleteAllLocations()
  //       resolve(true)
  //     }, err => reject(err))
  //     // start recording location
  //     console.log('getCurrentPosition')
  //   })
  // }
  timeout_position;
  // private timeoutStopCheckPosition() {
  //   if (this.timeout_position != null)
  //     clearTimeout(this.timeout_position)
  //   this.timeout_position = setTimeout(() => {
  //     clearInterval(this.checkingPositionInterval);
  //     this.backgroundGeolocation.stop().catch(err => console.log(err))
  //   }, this.offSensorsInterval)
  // }
  // private setIntervalPositionCheck() {
  //   return setInterval(() => (
  //     this.backgroundGeolocation.getCurrentLocation().then((position) => {
  //       console.log('intervall')
  //       console.log(position)
  //       if (position.time != new Date(this.details_emergency.dateObserved).getTime()) {
  //         var distance = this.distance(this.details_emergency.latitude, this.details_emergency.longitude, position.latitude, position.longitude);
  //         if (distance >= 100) {
  //           this.setPositionToSend(position)
  //           this.send_Emergency('done')
  //         }
  //       }
  //       console.log()
  //     }, err => console.log(err))
  //   ), 5000)
  // }
  // private setPositionToSend(position) {
  //   this.details_emergency.latitude = position.latitude;
  //   this.details_emergency.longitude = position.longitude;
  //   this.details_emergency.quote = position.altitude != undefined ? position.altitude : 0;
  //   this.details_emergency.velocity = position.speed != undefined ? position.speed : 0;
  //   this.details_emergency.accuracy = position.accuracy;
  //   this.details_emergency.dateObserved = new Date().toISOString();
  // }
  // getAcceleration() {
  //   return new Promise((resolve, reject) => {
  //     var freq = 1000;
  //     this.watchAccelerationFunction = this.deviceMotion.watchAcceleration({ frequency: freq }).subscribe((acceleration: DeviceMotionAccelerationData) => {
  //       this.details_emergency.accelX = acceleration.x;
  //       this.details_emergency.accelY = acceleration.y;
  //       this.details_emergency.accelZ = acceleration.z;
  //       resolve(true);
  //     }, (err) => {
  //       console.log(err)
  //       reject(err);
  //     })
  //   })
  // }
  timeout_watch_acceleration;
  // private activateSensors() {
  //   return new Promise((resolve) => {
  //     console.log('GETPOSITION')
  //     this.getPosition().then(() => {
  //       console.log('GETACCELERATION')
  //       this.getAcceleration().then(() => {
  //         if (this.timeout_watch_acceleration != null)
  //           clearTimeout(this.timeout_watch_acceleration);
  //         this.timeout_watch_acceleration = setTimeout(() => {
  //           this.watchAccelerationFunction.unsubscribe();
  //         }, this.offSensorsInterval)
  //         console.log('resolve')
  //         resolve(true)
  //       }, err => resolve(false))
  //     }, err => { this.activateSensors() })
  //   })

  // }
  // distance(lat1, lon1, lat2, lon2) {
  //   var p = 0.017453292519943295;    // Math.PI / 180
  //   var c = Math.cos;
  //   var a = 0.5 - c((lat2 - lat1) * p) / 2 +
  //     c(lat1 * p) * c(lat2 * p) *
  //     (1 - c((lon2 - lon1) * p)) / 2;
  //   return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  // }
  // private sendAlert() {
  //   return new Promise((resolve, reject) => {
  //     this.NGSIv2Query.sendAlertEvent(this.details_emergency).then(() => {
  //       this.localNotifications.schedule({
  //         id: 2,
  //         text: 'Emergency sent!',
  //         data: ""
  //       })
  //       resolve(true);
  //     }, err => {
  //       console.log(err)
  //       setTimeout(() => {
  //         console.log('Fail nr. ' + this.countFails)
  //         this.countFails++;
  //         if (this.countFails < 5)
  //           this.sendAlert().catch((err) => { console.log('ERROR->SendAlert'); reject(err) });
  //         else
  //           reject(err)
  //       }, 3500)
  //     })
  //   })
  // }
  ngOnDestroy() {
    console.log('SHOW_ALERT_DESTROIED')
  }
}
