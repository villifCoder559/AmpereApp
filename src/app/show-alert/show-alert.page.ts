import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { SharedDataService, UserData } from '../data/shared-data.service'
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { NativeAudio } from '@ionic-native/native-audio/ngx'
/*
  OK Fix view page OK
  OK Add sound when I click button and when the time expires OK
  Check cordova elements( localization,accelerometer,if I send emergency check the coords,notification, etc ) OK
    _fix errors when i click notification OK
  Add possibility when I click two times the emergency button app sends immediately notification OK
  
*/
@Component({
  selector: 'app-show-alert',
  templateUrl: './show-alert.page.html',
  styleUrls: ['./show-alert.page.scss'],
})
export class ShowAlertPage implements OnInit {
  pin = ['', '', '', '']
  config: CountdownConfig = {
    leftTime: 20,
    formatDate: ({ date }) => `${date / 1000}`,
    // notify: 1
  };;
  constructor(private route: ActivatedRoute, private platform: Platform, private nativeAudio: NativeAudio, private localNotifications: LocalNotifications, private deviceMotion: DeviceMotion, private shared_data: SharedDataService, private sms: SMS, private alertController: AlertController, private router: Router, private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation, private androidPermissions: AndroidPermissions) {
    this.localNotifications.schedule({
      id: 1,
      text: 'Emergency notification, click to open and insert PIN to disable alert or click again to send emergency immediatly',
      data: ""
    });
  }
  ngOnInit() {
  }

  onDigitInput(event) {
    console.log(event);
    // console.log(event.target.attributes.getNamedItem('ng-reflect-name').value)
    let element;
    console.log(this.pin)
    if (event.code !== 'Backspace')
      element = event.srcElement.nextElementSibling;

    if (event.code === 'Backspace') {
      element = event.srcElement.previousElementSibling;
      element.select()
    }
    if (element == null) {
      this.checkPin();
      return;
    }
    else
      element.focus();
  }
  async checkPin() {
    var ok = true;
    // var pin_saved = window.localStorage.getItem('user.password');
    var pin_saved = ['0', '0', '0', '0',]
    for (var i = 0; i < this.pin.length; i++) {
      if (pin_saved[i] != this.pin[i])
        ok = false
    }
    if (!ok) {
      await this.presentAlert('PIN wrong', 500).then(() => {
        for (var i = this.pin.length - 1; i >= 0; i--) {
          (<HTMLInputElement>document.getElementById(i.toString())).value = '';
          if (i == 0)
            document.getElementById(i.toString()).focus();
        }
      })

    }
    else {
      this.shared_data.reset_EmergencyClick();
      this.presentAlert('PIN correct', 1500);
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
  async send_Emergency(event) {
    console.log(event)
    if (event.action == 'done' && this.shared_data.count_click_emergency == 1) {
      this.shared_data.showAlert();
    }
  }
  testButton() {
    this.shared_data.showAlert();
  }
}
