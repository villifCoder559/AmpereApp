import { Injectable, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, Platform, ToastController } from '@ionic/angular';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { CountdownModule } from 'ngx-countdown';
import { Storage } from '@ionic/storage-angular'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx'
import { BehaviorSubject } from 'rxjs';
import { BLE } from '@ionic-native/ble/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

//import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
/**fix logout */
// @NgModule({
//   imports: [
//     CommonModule,
//     FormsModule,
//     IonicModule,
//     CountdownModule
//   ],
//   providers: [
//     NativeAudio, BackgroundMode]
// })
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
export enum StorageNameType {
  QR_CODE = 'qr_code',
  NFC_CODE = 'nfc_code',
  DEVICES = 'paired_devices'
}
export class StorageName {
  id: any = ''
  name: any = ''
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
  public_emergency_contacts = { call_112: false, call_115: false, call_118: false }
  paired_devices = []
  qr_code = []
  nfc_code = []
  status = 'active'
  constructor() { }
  copyFrom(data: UserData) {
    this.emergency_contacts = [];
    this.paired_devices = [];
    this.qr_code = []
    this.nfc_code = []
    var fields = Object.keys(this);
    for (let i = 0; i < fields.length; i++) {
      switch (fields[i]) {
        default: {
          this[fields[i]] = data[fields[i]]
          break;
        }
        case 'disabilities': case 'public_emergency_contacts': {
          Object.keys(this[fields[i]]).forEach((element) => {
            this[fields[i]][element] = data[fields[i]][element]
          })
          break;
        }
        case 'paired_devices': case 'qr_code': case 'nfc_code': {
          for (let j = 0; j < data[fields[i]].length; j++)
            this[fields[i]][j] = data[fields[i]][j]
          break;
        }
        case 'emergency_contacts': {
          for (let j = 0; j < data[fields[i]].length; j++) {
            this[fields[i]].push(new Emergency_Contact(data[fields[i]][j].name, data[fields[i]][j].surname, data[fields[i]][j].number))
          }
        }
      }
    }
  }
  isEqualTo(data: UserData) {
    var equal = true
    var fields = Object.keys(this);
    for (let i = 0; equal && i < fields.length; i++) {
      switch (fields[i]) {
        default: {
          if (this[fields[i]] != data[fields[i]])
            equal = false
          break;
        }
        case 'disabilities': case 'public_emergency_contacts': {
          Object.keys(this[fields[i]]).forEach((element) => {
            if (this[fields[i]][element] != data[fields[i]][element])
              equal = false;
          })
          break;
        }
        case 'paired_devices': case 'qr_code': case 'nfc_code': {
          var found = true
          if (this[fields[i]].length != data[fields[i]].length)
            equal = false;
          else
            for (let j = 0; found && j < this[fields[i]].length; j++) {
              if (this[fields[i]].indexOf(data[fields[i]][j]) == -1) {
                found = false
                equal = false
              }
            }
          break;
        }
        case 'emergency_contacts': {
          var found = true
          if (this[fields[i]].length != data[fields[i]].length)
            equal = false;
          else
            for (let j = 0; found && j < this[fields[i]].length; j++) {
              var index = this[fields[i]].findIndex((obj) => {
                var ok = true;
                var array_element_contact = Object.keys(obj);
                let equal_contact_field = true;
                for (let k = 0; equal_contact_field && k < array_element_contact.length; k++) {
                  if (this[fields[i]][j][array_element_contact[k]] != data[fields[i]][j][array_element_contact[k]]) {
                    ok = false;
                    equal_contact_field = false
                  }
                }
                return ok;
              })
              if (index == -1)
                equal = false
            }
          break;
        }
      }
    }
    return equal
  }
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
  latitude = -1
  longitude = -1
  dateObserved = new Date().toISOString();
  constructor(qridNfc, id, action, latitude, longitude) {
    this.QRIDorNFC = qridNfc;
    this.identifier = id;
    this.action = action;
    this.latitude = latitude;
    this.longitude = longitude
  }
}
@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  /**List of StorageNameType */
  readonly MAX_NFCs = 4;
  readonly MAX_QRs = 4;
  readonly MAX_EMERGENCY_CONTACTs = 5;
  readonly MAX_DEVICEs = 2;
  public accessToken;
  checkPermissionDone=false;
  localStorage = {}
  old_user_data: UserData = new UserData();
  public user_data: UserData = new UserData();
  enabled_test_battery_mode = new BehaviorSubject(false);
  constructor(private locationAccuracy: LocationAccuracy, private ble: BLE, private geolocation: Geolocation, private localNotifications: LocalNotifications, private androidPermissions: AndroidPermissions, private device: Device, private loadingController: LoadingController, private backgroundMode: BackgroundMode, private storage: Storage, private toastCtrl: ToastController, private router: Router, private platform: Platform, private nativeAudio: NativeAudio) {
    this.platform.ready().then(() => {
      this.storage.create();
      console.log('StorageNameType')
      Object.keys(StorageNameType).forEach(element => {
        console.log(StorageNameType[element])
        this.localStorage[StorageNameType[element]] = []
      })
      this.nativeAudio.preloadSimple('alert', 'assets/sounds/alert.mp3').then(() => { }, (err) => console.log(err));
      this.nativeAudio.preloadSimple('sendData', 'assets/sounds/send_data.mp3').then(() => { }, (err) => console.log(err));
    })
  }
  async createToast(header, time = 3500) {
    let toast = await this.toastCtrl.create({
      header: header,
      duration: time
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
    await this.loading.dismiss()
  }
  async setTextLoading(text) {
    $('.loading-content').html(text);
  }
  showAlert(id) {
    console.log(id)
    let navigationExtras: NavigationExtras = {
      state: {
        deviceID: id
      },
      replaceUrl: true
    };
    this.nativeAudio.play('alert');
    this.router.navigate(['/show-alert'], navigationExtras)
  }
  enableAllBackgroundMode() {
    console.log('enableBackgroundMode')
    this.backgroundMode.configure({text:'Ampere is working'})
    this.backgroundMode.enable();
    this.backgroundMode.disableWebViewOptimizations();
    this.backgroundMode.disableBatteryOptimizations();
    this.backgroundMode.on('activate').subscribe(() => {
      console.log('ActivateBackground')
      this.checkPermissionDone=false;
      if (this.enabled_test_battery_mode.getValue())
        this.enabled_test_battery_mode.next(false)
    })
  }
  setNameDevice(device, type: StorageNameType, name = '') {
    var app = { id: '', name: '' };
    app.id = device;
    app.name = name === '' ? device : name;
    var check = true;
    if (this.localStorage[type] === null)
      this.localStorage[type] = []
    this.localStorage[type].forEach(element => {
      if (element.id === device) {
        element.name = name;
        check = false;
      }
    })
    if (check)
      this.localStorage[type].push(app)
    this.storage.set(type, this.localStorage[type])
  }
  deleteDeviceFromLocalStorage(device, type: StorageNameType) {
    var index = this.localStorage[type].indexOf(device);
    this.localStorage[type].splice(index, 1)
    this.storage.set(type, this.localStorage[type])
  }
  getNameDevices(type: StorageNameType) {
    this.storage.get(type).then((result) => {
      this.localStorage[type] = result;
      if (this.localStorage[type] == null) {
        this.user_data[type].forEach(element => {
          this.setNameDevice(element, type)
        })
      }
    })
  }
  setUserValueFromData(data) {
    Object.keys(this.user_data).forEach((element) => {
      switch (element) {
        case 'id': case 'paired_devices': case 'emergency_contacts': case 'nfc_code': case 'qr_code': case 'status':
          break;
        case 'dateObserved': {
          this.user_data[element] = new Date().toISOString();
          break;
        }
        case 'allergies': case 'medications': {
          this.user_data[element] = data[element].value;
          break
        }
        case 'public_emergency_contacts': {
          Object.keys(this.user_data[element]).forEach((number) => {
            this.user_data[element][number] = data[number].value === "true" ? true : false;
          })
          break;
        }
        case 'disabilities': {
          Object.keys(this.user_data[element]).forEach((dis) => {
            this.user_data[element][dis] = data[dis].value === "true" ? true : false
          })
          break;
        }
        default: {
          this.user_data[element] = data[element].value
          break
        }
      }
    })
    for (var i = 0; i < this.MAX_DEVICEs; i++)
      if (data['jewel' + (i + 1) + 'ID'].value != '')
        this.user_data.paired_devices.push(data['jewel' + (i + 1) + 'ID'].value)
    for (var i = 0; i < this.MAX_EMERGENCY_CONTACTs; i++) {
      var name = data['emergencyContact' + (i + 1) + 'Name'].value;
      var surname = data['emergencyContact' + (i + 1) + 'Surname'].value;
      var number = data['emergencyContact' + (i + 1) + 'Number'].value;
      if (name != '' && surname != '' && number != '')
        this.user_data.emergency_contacts.push(new Emergency_Contact(name, surname, number))
    }
    for (var i = 0; i < this.MAX_QRs; i++) {
      var qrcode = data['QR' + (i + 1)].value;
      if (qrcode != '')
        this.user_data.qr_code.push(qrcode)
    }
    for (var i = 0; i < this.MAX_NFCs; i++) {
      var nfccode = data['NFC' + (i + 1)].value;
      if (nfccode != '')
        this.user_data.nfc_code.push(nfccode)
    }
    //this.user_data.public_emergency_contacts = { call_112: data.call_112.value, call_115: data.call_115.value, call_118: data.call_118.value }
    this.old_user_data.copyFrom(this.user_data)
  }
  getUserFromLocalToServer() {
    console.log(this.user_data)
    var newUser = {}
    Object.keys(this.user_data).forEach((field_name) => {
      switch (field_name) {
        case 'id': { break; }
        case 'dateObserved': {
          newUser[field_name] = { value: new Date().toISOString() }
          break;
        }
        case 'emergency_contacts': {
          for (var i = 0; i < this.MAX_EMERGENCY_CONTACTs; i++) {
            newUser['emergencyContact' + (i + 1) + 'Name'] = { value: this.user_data.emergency_contacts[i]?.name === undefined ? '' : this.user_data.emergency_contacts[i]?.name }
            newUser['emergencyContact' + (i + 1) + 'Surname'] = { value: this.user_data.emergency_contacts[i]?.surname === undefined ? '' : this.user_data.emergency_contacts[i]?.surname }
            newUser['emergencyContact' + (i + 1) + 'Number'] = { value: this.user_data.emergency_contacts[i]?.number === undefined ? '' : this.user_data.emergency_contacts[i]?.number }
          }
          break;
        }
        case 'disabilities': {
          console.log('disabilities')
          Object.keys(this.user_data.disabilities).forEach((dis) => {
            newUser[dis] = { value: this.user_data.disabilities[dis] + '' }
          })
          break;
        }
        case 'qr_code': {
          for (var i = 0; i < this.MAX_QRs; i++)
            newUser['QR' + (i + 1)] = { value: this.user_data.qr_code[i] === undefined ? '' : this.user_data.qr_code[i] }
          break;
        }
        case 'nfc_code': {
          for (var i = 0; i < this.MAX_NFCs; i++)
            newUser['NFC' + (i + 1)] = { value: this.user_data.nfc_code[i] === undefined ? '' : this.user_data.nfc_code[i] }
          break;
        }
        case 'public_emergency_contacts': {
          Object.keys(this.user_data.public_emergency_contacts).forEach((element) => {
            newUser[element] = { value: this.user_data.public_emergency_contacts[element] + '' }
          })
          break;
        }
        case 'paired_devices': {
          for (var i = 0; i < this.MAX_DEVICEs; i++)
            newUser['jewel' + (i + 1) + 'ID'] = { value: this.user_data.paired_devices[i] === undefined ? '' : this.user_data.paired_devices[i] }
          break;
        }
        default: {
          console.log('default-> ' + field_name)
          console.log(newUser)
          newUser[field_name] = { value: this.user_data[field_name] === undefined ? '' : this.user_data[field_name] }
          break;
        }
      }
    })
    console.log('RETURN_NEW_USER')
    return newUser;
  }
  enableBluetooth() {
    return new Promise((resolve, reject) => {
      this.ble.isEnabled().then(() => {
        resolve(true)
      }, err => {
        this.ble.enable().then(() => resolve(true), err => reject(err))
      })
    })
  }
  askForegroundService() {
    return new Promise((resolve, reject) => {
      this.androidPermissions.checkPermission("android.permission.FOREGROUND_SERVICE").then((enabled) => {
        console.log('ForegroundService')
        if (!enabled.hasPermission)
          this.androidPermissions.requestPermission("android.permission.FOREGROUND_SERVICE").then(() => {
            resolve(true)
          }, err => reject(err))
        else
          resolve(true)
      }, err => reject(err))
    })
  }
  enableAllPermission() {
    return new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        this.enableAllBackgroundMode();
        console.log('enableAllPermission')
        this.askForegroundService().then(()=>{
          this.checkLocationEnabled().then(() => {
            this.enableBluetooth().then(() => {
              this.askGeoPermission().then(() => {
                //this.enableAllBackgroundMode();
                console.log('ASK_PERMISSION')
                this.localNotifications.hasPermission().then(result => {
                  if (!result.valueOf())
                    this.localNotifications.requestPermission().then(() => {
                      resolve(true)
                    }).catch(err => reject(err))
                  else
                    resolve(true)
                }, (err) => reject(err))
              }, err => { reject(err) })
            }, err => reject(err))
          }, err => reject(err + '. App can\'t work properly!'))
        },err=>reject(err))
      }, err => reject(err))
    })
  }
  askGeoPermission() {
    return new Promise((resolve, reject) => {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then((fineLocation) => {
        this.androidPermissions.checkPermission("android.permission.ACCESS_BACKGROUND_LOCATION").then((backgroundLocation) => {
          this.androidPermissions.checkPermission("android.permission.ACCESS_COARSE_LOCATION").then((coarseLocation) => {
            console.log(fineLocation)
            console.log(backgroundLocation)
            console.log(coarseLocation);
            if (!fineLocation.hasPermission || !backgroundLocation.hasPermission || !coarseLocation.hasPermission) {
              console.log('GetPosition')
              this.geolocation.getCurrentPosition({ timeout: 3500 }).then((position) => {
                this.dismissLoading().catch(err => console.log(err));
                this.askGeoLocationPermissions().then(() => resolve(true), err => resolve(false))
              }, err => {
                this.dismissLoading().catch(err => console.log(err));
                this.askGeoLocationPermissions().then(() => resolve(true), err => resolve(false))
              })
            }
            else {
              this.dismissLoading().catch(err => console.log(err))
              resolve(true)
            }
          }, err => reject(err))
        }, err => reject(err))
      }, err => reject(err))
    })
  }
  askGeoLocationPermissions() {
    return new Promise((resolve, reject) => {
      console.log(this.device.version)
      if (parseInt(this.device.version) >= 10) {
        alert('This app needs location access for all the time. Allow it so this app can work properly')
        this.androidPermissions.requestPermissions([
          "android.permission.ACCESS_BACKGROUND_LOCATION",
          "android.permission.ACCESS_COARSE_LOCATION",
          this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
        ]).then((response) => {
          console.log('ReusltResponse')
          console.log(response)
          resolve(true)
        }, err => reject(err))
      }
      else
        resolve(true)
    })
  }
  enableGPS() {
    return new Promise((resolve, reject) => {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          resolve(true)
        }, error => {
          alert(JSON.stringify(error))
          reject(false)
        })
    })
  }
  locationAccPermission() {
    return new Promise((resolve, reject) => {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
          resolve(true)
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
            .then(
              () => {
                this.enableGPS().then(() => {
                  resolve(true)
                }, err => reject(err));
              },
              error => {
                reject(error)
              }
            );
        }
      }, err => reject(err));
    })
  }
  checkLocationEnabled() {
    return new Promise((resolve, reject) => {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        result => {
          if (result.hasPermission) {
            this.enableGPS().then(() => {
              console.log('hasPermission')
              resolve(true)
            });
          } else {
            console.log('requestPermission')
            this.locationAccPermission().then(() => {
              console.log('requestPermissionDone')
              resolve(true)
            });
          }
        },
        error => {
          console.log(error)
          reject(error)
        }
      );
    })
  }

}