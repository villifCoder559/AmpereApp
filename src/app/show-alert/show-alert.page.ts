import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { CountdownComponent, CountdownConfig, CountdownModule } from 'ngx-countdown';
import { AlertEvent, DeviceType, SharedDataService, UserData } from '../data/shared-data.service'
import { DeviceMotion, DeviceMotionAccelerationData } from '@awesome-cordova-plugins/device-motion/ngx'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { NGSIv2QUERYService } from '../data/ngsiv2-query.service'
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@awesome-cordova-plugins/background-geolocation/ngx';

@Component({
  selector: 'app-show-alert',
  templateUrl: './show-alert.page.html',
  styleUrls: ['./show-alert.page.scss'],
})
export class ShowAlertPage implements OnInit {
  pin = ['', '', '', '']
  details_emergency = new AlertEvent();
  countFails = 0;
  @ViewChild('countdown', { static: false }) private countdown: CountdownComponent
  config: CountdownConfig = {
    leftTime: 20,
    formatDate: ({ date }) => `${date / 1000}`,
  };
  watchAccelerationFunction;
  offSensorsInterval = 30000 //milliseconds
  checkingPositionInterval = null;
  configGeolocation: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 10,
    distanceFilter: 10,
    debug: true, //  enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: true, // enable this to clear background location settings when the app terminates
    interval: 3000,
    fastestInterval: 6000,
    activitiesInterval: 1500
  };
  constructor(private backgroundGeolocation: BackgroundGeolocation, private changeRef: ChangeDetectorRef, private NGSIv2Query: NGSIv2QUERYService, private localNotifications: LocalNotifications, private deviceMotion: DeviceMotion, public shared_data: SharedDataService, private alertController: AlertController, private router: Router) {
    if (!this.shared_data.enabled_test_battery_mode && !this.shared_data.tour_enabled) {
      this.localNotifications.schedule({
        id: 1,
        text: 'Emergency notification, click to open and insert PIN to disable alert or click again to send emergency immediatly',
        data: ""
      });
      this.backgroundGeolocation.configure(this.configGeolocation).then(() => {
        console.log('Starting geolocation background...')
        this.backgroundGeolocation.start();
      })
    }
  }
  ngAfterViewInit() {
    console.log(this.shared_data.enabled_test_battery_mode.getValue())
    if (this.shared_data.tour_enabled) {
      this.countdown.stop();
    }
    if (this.shared_data.enabled_test_battery_mode.getValue()) {
      this.details_emergency.status = 'testBattery'
      this.details_emergency.evolution = 'finish'
      this.shared_data.enabled_test_battery_mode.next(false);
      this.countdown.left = 0;
      for (let i = 0; i < this.pin.length; i++)
        $('#' + i).attr('disabled', 'disabled')
      this.changeRef.detectChanges();
    }
  }
  ngOnInit() {
    this.details_emergency.deviceID = this.router.getCurrentNavigation().extras?.state?.deviceID;

  }

  immediateEmergency() {
    this.countdown.left = 1;
    this.changeRef.detectChanges();
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
      this.presentAlert('PIN wrong', 50).then(() => {
        for (var i = this.pin.length - 1; i >= 0; i--) {
          (<HTMLInputElement>document.getElementById(i.toString())).value = '';
          if (i == 0)
            document.getElementById(i.toString()).focus();
        }
      })
    }
    else {
      this.backgroundGeolocation.stop().catch((err) => console.log(err));
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
  send_Emergency(event) {
    console.log(event)
    if (event.action === 'done') {
      console.log('activateSensors')
      this.shared_data.createToast('Sending emergency...', 4000);
      this.activateSensors().then(() => {
        console.log('sendEmergency')
        this.sendAlert().then(() => {
          console.log('emergencySended')
          this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
          if (!this.shared_data.enabled_test_battery_mode.getValue())
            this.shared_data.createToast('Emergency sent successfully')
          else
            this.shared_data.createToast('Test battery completed succesfully')
        }, err => {
          alert(err);
          this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
        });
      }, err => {
        alert(err);
        this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
      })
    }
  }

  getPosition() {
    return new Promise((resolve, reject) => {
      console.log('startwatchPosition')
      this.backgroundGeolocation.getCurrentLocation().then((position) => {
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
  private timeoutStopCheckPosition() {
    setTimeout(() => {
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
            this.send_Emergency('done')
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
  private activateSensors() {
    return new Promise((resolve) => {
      console.log('GETPOSITION')
      this.getPosition().then(() => {
        console.log('GETACCELERATION')
        this.getAcceleration().then(() => {
          setTimeout(() => {
            this.watchAccelerationFunction.unsubscribe();
          }, this.offSensorsInterval)
          console.log('resolve')
          resolve(true)
        }, err => resolve(false))
      }, err => { console.log(err) })
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
        this.localNotifications.schedule({
          id: 2,
          text: 'Emergency sent!',
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
        }, 2500)
      })
    })
  }
}
