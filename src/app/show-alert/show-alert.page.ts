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
  //details_emergency = new AlertEvent();
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
      //this.countdown.left=left;
      if (left <= 1)
        this.valueTimer = 0;
      else{
        this.valueTimer=left;
        this.interval_coundown = setInterval(() => {
          console.log('timer ' + this.valueTimer)
          if (this.valueTimer > 0)
            this.valueTimer--;
          else {
            this.valueTimer = 0;
            clearInterval(this.interval_coundown)
          }
        }, 1000)
      }

      //this.changeRef.detectChanges();
    }
    if (this.shared_data.tour_enabled) {
      this.valueTimer = 20;
    }
    if (this.shared_data.enabled_test_battery_mode.getValue()) {
      console.log('BATTERY')
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
    this.emergencyService.sendEmergencyImmediately()
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
  ngOnDestroy() {
    console.log('SHOW_ALERT_DESTROIED')
  }
}
