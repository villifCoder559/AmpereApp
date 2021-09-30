import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NumericValueAccessor } from '@ionic/angular';
export class Emergency_Contact {
  number: string = '';
  name: string = '';
}
export class Device {
  name: string = '';
  id: string = '';
  rssi: string = '';
  battery: number = 100;
  connected: boolean = false;
}

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

  constructor(private router: Router) {
    console.log('constructor')
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
    //save data on database
  }
  getUserData() {
    return this.user_data
  }
  loadDataUser(){
    const data: UserData = {
      address: 'Viale Morgagni 87',
      allergies: 'gluten',
      birthdate: '1947-10-25',
      city: 'Florence',
      description: 'brown hair, blue eyes',
      disabilities: [false, true],
      email: 'email@mail.com',
      emergency_contacts: [{ number: '8541254732', name: 'Paul Rid' }],
      ethnicity: 'white',
      gender: 'male',
      height: '185',
      locality: 'Careggi',
      medications: '',
      name: 'Wayne',
      weight: '85',
      surname: 'Richards',
      phoneNumber: '2587436910',
      public_emergency_contacts: { 113: false, "115": false, "118": true },
      paired_devices: [{ name: 'necklace', battery: 50, connected: true, id: '78542', rssi: 'ADC456' }],
      password: '',
      pin: '0258',
      purpose: 'Personal safety'
    }
    this.setUserData(data)
    this.setIs_logged(true);

  }
  goHomepage() {
    //load user data from database
    this.loadDataUser();
    this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true });
  }
}
