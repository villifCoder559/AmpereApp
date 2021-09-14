import { Injectable } from '@angular/core';
import { NumericValueAccessor } from '@ionic/angular';
export class Emergency_Contact {
  number: string = '';
  name: string = '';
}
export class Device {
  name: string = '';
  id: string = '';
  rssi: string = '';
  battery: 100;
  connected: boolean = false;
}
// export interface UserData {
//   name: string,
//   surname: string,
//   email: string,
//   phoneNumber: string,
//   birthdate: string,
//   gender: string,
//   address: string,
//   locality: string,
//   city: string,
//   height: string,
//   weight: string,
//   ethnicity: string,
//   description: string,
//   purpose: string,
//   pin: string,
//   allergies: string,
//   medications: string,
//   password: string,
//   disabilities: [boolean, boolean],
//   emergency_contacts: [Emergency_Contact, Emergency_Contact, Emergency_Contact, Emergency_Contact, Emergency_Contact],
//   public_emergency_contacts: { 113: false, 115: false, 118: false },
//   paired_devices: [Device, Device]
// }
export class UserData {
  name: string = '';
  surname: string = ''
  email: string = ''
  phoneNumber: string = ''
  birthdate: string = ''
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
  password: string = ''
  disabilities = [false, false]
  emergency_contacts = [new Emergency_Contact, new Emergency_Contact, new Emergency_Contact, new Emergency_Contact, new Emergency_Contact]
  public_emergency_contacts = { 113: false, 115: false, 118: false }
  paired_devices = [new Device, new Device]

  constructor() { }
}
@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  user_data: UserData;
  private _is_logged = false;

  constructor() {
    console.log('constructor')
    this.user_data = new UserData()
    this.user_data.paired_devices[0] = { id: 'asdf', name: 'tizio', rssi: 'ASD34', battery: 100, connected: false }
    this.user_data.paired_devices[1] = { id: 'pxcv', name: 'caio', rssi: 'ZRE18', battery: 100, connected: true }
    // this.user_data.emergency_contacts[0] = { number: '123456789', name: 'paul'};
    // this.user_data.emergency_contacts[2] = { number: '058745632', name: 'Leo' }
  }
  public getIs_logged() {
    return this._is_logged;
  }
  public setIs_logged(value) {
    this._is_logged = value;
  }
  setUserData(data) {
    this.user_data = data
  }
  getUserData() {
    console.log(this.user_data.emergency_contacts)
    return this.user_data
  }
}
