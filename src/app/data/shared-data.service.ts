import { Injectable, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, Platform, ToastController } from '@ionic/angular';
// import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';

// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
// import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { Storage } from '@ionic/storage-angular'
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
  id: number = -1;
}
export class QRCode {
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
  refresh_token = ''
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
  QR_NFC_EVENT = 'QR-NFC-Event',
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
  dateObserved = new Date().toISOString();
  disabilities = { visionImpaired: false, wheelchairUser: false } /**[visionImapired,wheelchairUser] */
  emergency_contacts = []
  public_emergency_contacts = { 112: false, 115: false, 118: false }
  paired_devices = []
  qr_code = []
  nfc_code = []
  status = 'active'
  constructor() { }
}
export class AlertEvent {
  latitude = -1.0
  longitude = -1.0
  dateObserved = new Date().toISOString();
  quote = 0.0
  velocity = 0.0
  evolution = 'notHandled'
  deviceID: string = ''
  accelX = 0.0
  accelY = 0.0
  accelZ = 0.0
  status = 'alert'
}
export class QRNFCEvent {
  QRIDorNFC: string = ''
  identifier: string = ''
  action: string = ''
  dateObserved = new Date().toISOString();
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
  nameDevices = [];
  old_user_data: UserData = new UserData();
  public user_data: UserData = new UserData();
  gps_enable = false;
  constructor(private loadingController: LoadingController, private backgroundMode: BackgroundMode, private storage: Storage, private toastCtrl: ToastController, private router: Router, private platform: Platform, private nativeAudio: NativeAudio) {
    this.storage.create();
    this.platform.ready().then(() => {
      //this.enableAllBackgroundMode();
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
  loading;
  async presentLoading(msg) {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: msg,
      spinner: 'bubbles'
    });
    await this.loading.present();
  }
  async dismissLoading() {
    this.loading.dismiss()
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
            this.user_data.address = 'VialeMorgagni87'
            this.user_data.allergies = 'gluten'
            this.user_data.dateofborn = '1950-08-09'
            this.user_data.city = 'Florence'
            this.user_data.description = 'brownHairBlueEyes'
            this.user_data.disabilities.visionImpaired = false
            this.user_data.disabilities.wheelchairUser = true
            this.user_data.email = 'email@mail.com'
            this.user_data.emergency_contacts = [new Emergency_Contact('Paul', 'Rid', '785232145202')]
            this.user_data.ethnicity = 'white'
            this.user_data.gender = 'male'
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
            this.old_user_data = JSON.parse(JSON.stringify(this.user_data))
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
    console.log(id)
    let navigationExtras: NavigationExtras = {
      state: { deviceID: id },
      replaceUrl: true
    };
    this.nativeAudio.play('alert');
    this.router.navigate(['/show-alert'], navigationExtras)
    //this.sendEmergency();
  }
  moveToForeground(){
    this.backgroundMode.moveToForeground()
  }
  
  enableAllBackgroundMode() {
    console.log('enableBackgroundMode')
    this.backgroundMode.enable();
    //this.backgroundMode.overrideBackButton();
    this.backgroundMode.disableWebViewOptimizations();
    this.backgroundMode.disableBatteryOptimizations();
    this.backgroundMode.wakeUp();
    // this.backgroundMode.unlock();
  }
  setNameDevice(device, name) {
    var app = { id: '', name: '' };
    app.id = device;
    app.name = name === '' ? device : name;
    var check = true;
    if (this.nameDevices === null)
      this.nameDevices = []
    this.nameDevices.forEach(element => {
      if (element.id === device) {
        element.name = name;
        check = false;
      }
    })
    if (check)
      this.nameDevices.push(app)
    this.storage.set('nameDevices', this.nameDevices)
  }
  deleteDeviceFromNameDevice(device) {
    var index = this.nameDevices.indexOf(device);
    this.nameDevices.splice(index, 1)
    this.storage.set('nameDevices', this.nameDevices)
  }
  getNameDevices() {
    this.storage.get('nameDevices').then((result) => {
      this.nameDevices = result;
      console.log(this.nameDevices === null)
      if (this.nameDevices === null) {
        this.user_data.paired_devices.forEach(element => {
          console.log('SETNAME')
          this.setNameDevice(element, element)
        })
      }
    })
    if (this.nameDevices === null) {
      this.user_data.paired_devices.forEach(element => {
        this.setNameDevice(element, element)
      })
    }
  }
  
  // saveNameDevice() {
  //   var newData = []
  //   this.user_data.paired_devices.forEach(paired_element => {
  //     this.nameDevices.forEach(name_device => {
  //       if (name_device.id === paired_element) {
  //         var el;
  //         el.id = paired_element;
  //         el.name = 
  //       }
  //     })
  //   })
  //   this.storage.set('nameDevices', this.nameDevices)
  // }

}
