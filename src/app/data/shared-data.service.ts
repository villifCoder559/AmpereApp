import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
// import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
// import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { Storage } from '@ionic/storage-angular'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
/**fix logout */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountdownModule
  ],
  providers: [
    NativeAudio]
})
export class NFCCode {
  link: string = '';
  id: number = -1;
  description: string = '';
}
export class QRCode {
  description: string = '';
  action: string = '';
  code: string = '';
  id: number = -1;
}
export class Emergency_Contact {
  number: string = '';
  name: string = '';
  surname: string = '';
  constructor(name, surname, number) {
    this.name = name;
    this.surname = surname;
    this.number = number;
  }
}
/**accuray:'15',major:125,mior:758,proximity:'Near',rssi:'-69',tx:'10db',uuid:'51446-54564w-fwfffw4-56d4we5d1e5113d2e1' */

/* check iBeacon library OK
  save data */
export enum FakeKeycloak {
  token = '',
  refresh_token=''
}
export enum typeChecking {
  NFC_CODE = 'nfc_code',
  QR_CODE = 'qr_code',
  EMERGENCY_CONTACTS = 'emergency_contacts',
  DISABILITIES = 'disabilities',
  PUB_EMERGENCY_CONTACTS = 'public_emergency_contacts',
  PAIRED_DEVICES = 'paired_devices'
}
export enum DeviceType {
  ALERT_EVENT = 'AmpereEvent',
  QR_NFC_EVENT = 'QR-NFC-Event	',
  DICTIONARY = 'QRNFCDictionary',
  PROFILE = 'Profile'
}

export class UserData {
  id: string = ''
  name: string = '';
  surname: string = ''
  nickname: string = ''
  language: string = ''
  email: string = ''
  phoneNumber: string = ''
  dateofborn: string = ''
  gender: string = ''
  address: string = ''
  locality: string = ''
  city: string = ''
  height: string = ''
  weight: string = ''
  ethnicity: string = ''
  description: string = ''
  purpose: string = ''
  pin: string = ''
  allergies: string = ''
  medications: string = ''
  disabilities = [false, false] /**[visionImapired,wheelchairUser] */
  emergency_contacts: Array<Emergency_Contact> = []
  public_emergency_contacts = { 112: false, 115: false, 118: false }
  paired_devices = []
  qr_code = []
  nfc_code = []
  constructor() { }
}
export class AlertEvent {
  latitude: number = 0.0
  longitude: number = 0.0
  quote: number = 0.0
  velocity: number = 0.0
  evolution: string = ''
  deviceID: string = ''
  accelX: number = 0.0
  accelY: number = 0.0
  accelZ: number = 0.0
  status: number = 0
}
export class QRNFCEvent {
  QRIDorNFC: string = ''
  identifier: string = ''
  action: string = ''
  constructor(qridNfc, id, action) {
    this.QRIDorNFC = qridNfc;
    this.identifier = id;
    this.action = action;
  }
}
@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  old_user_data;
  public user_data: UserData = new UserData();
  gps_enable = false;
  constructor(private backgroundMode: BackgroundMode, private storage: Storage, private toastCtrl: ToastController, private router: Router, private platform: Platform, private nativeAudio: NativeAudio) {
    //console.log('contructor')
    this.storage.create();
    this.platform.ready().then(() => {
      this.enableAllBackgroundMode();
      this.nativeAudio.preloadSimple('alert', 'assets/sounds/alert.mp3').then(() => { }, (err) => console.log(err));
      this.nativeAudio.preloadSimple('sendData', 'assets/sounds/send_data.mp3').then(() => { }, (err) => console.log(err));
    })
  }
  async createToast(header) {
    let toast = await this.toastCtrl.create({
      header: header,
      duration: 3500
    })
    toast.present();
  }
  setUserData(data) {
    this.user_data = data
  }
  saveData() {
    this.storage.set('user_data', this.user_data);
    console.log('storage')
  }

  loadDataUser(auth) {
    //console.log('data from service')
    //console.log(this.user_data)
    return new Promise((resolve, reject) => {
      if (auth) {
        this.storage.get('user_data').then((storageData) => {
          if (storageData != null) {
            console.log('TRUE_BLOCK')
            console.log('LOADINGDATA')
            this.user_data = storageData;
            this.user_data.name = 'TEST'
            resolve(true);
          }
          else {
            console.log('ELSE_BLOCK')
            var qr_code = new QRCode();
            qr_code.id = 40;
            var nfc_code = new NFCCode();
            nfc_code.id = 42;
            this.user_data.id = 'ampereuser1'
            this.user_data.nickname = 'KL15'
            this.user_data.address = 'VialeMorgagni87' //database no spaces available
            this.user_data.allergies = 'gluten'
            this.user_data.dateofborn = '1950-08-09'
            this.user_data.city = 'Florence'
            this.user_data.description = 'brownHairBlueEyes' //no spaces
            this.user_data.disabilities = [false, true] // vision,wheelchair
            this.user_data.email = 'email@mail.com' // no @
            this.user_data.emergency_contacts = [new Emergency_Contact('Paul', 'Rid', '785232145202')]
            this.user_data.ethnicity = 'white'
            this.user_data.gender = '0' //0->Male 1->Female
            this.user_data.height = '185'
            this.user_data.locality = 'Careggi'
            this.user_data.medications = ''
            this.user_data.name = 'Wayne'
            this.user_data.weight = '85'
            this.user_data.surname = 'Richards'
            this.user_data.phoneNumber = '2587436910'
            this.user_data.public_emergency_contacts = { 112: true, "115": false, "118": true }
            this.user_data.paired_devices = []
            this.user_data.pin = '0258'
            this.user_data.purpose = 'PersonalSafety'
            this.user_data.qr_code = [qr_code]
            this.user_data.nfc_code = [nfc_code];
            resolve(false)
          }
        }, err => console.log(err));
      }
    })
  }
  // goHomepage() {
  //   //load user data from database
  //   this.loadDataUser()
  //   this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true });
  // }
  showAlert(id) {
    //take bluetooth signal, create handler that takes the signal
    this.nativeAudio.play('alert')
    this.router.navigate(['/show-alert', { deviceId: id }], { replaceUrl: true })
    //this.sendEmergency();
  }

  enableAllBackgroundMode() {
    console.log('enableBackgroundMode')
    this.backgroundMode.enable();
    this.backgroundMode.overrideBackButton();
    this.backgroundMode.disableWebViewOptimizations();
    this.backgroundMode.disableBatteryOptimizations();
  }

  checkIDValidityNFCorQR(type: typeChecking.QR_CODE | typeChecking.NFC_CODE, id) {
    console.log('userData')
    console.log(this.user_data[type])
    var ok = false;
    this.user_data[type].forEach(element => {
      console.log(parseInt(element.id) == id)
      if (parseInt(element.id) == id)
        return ok = true
    });
    return ok;
  }
}
