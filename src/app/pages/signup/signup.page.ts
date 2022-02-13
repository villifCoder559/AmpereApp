import { Component, OnInit, ChangeDetectorRef, Input, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors, ValidatorFn, FormControl } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStep, MatStepper, StepperOrientation } from '@angular/material/stepper';
import { interval, Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgZone, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogExampleComponent } from './dialog-example/dialog-example.component';
import { DialogModifyNameComponent } from './dialog-modify-name/dialog-modify-name.component'
import { MatTooltip } from '@angular/material/tooltip';
import { BLE } from '@ionic-native/ble/ngx';
import * as bcrypt from 'bcryptjs';
import { AlertController, AngularDelegate, IonContent, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService, UserData, Emergency_Contact, typeChecking, DeviceType } from '../../data/shared-data.service'
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import * as moment from 'moment';
import { Contacts, ContactName, ContactField } from '@ionic-native/contacts/ngx';
import { DialogScanBluetoothComponent } from './dialog-scan-bluetooth/dialog-scan-bluetooth.component';
import { NGSIv2QUERYService } from '../../data/ngsiv2-query.service'
import { BluetoothService } from '../../data/bluetooth.service'
import { Snap4CityService } from '../../data/snap4-city.service'
import { AuthenticationService } from '../../services/authentication.service'
import { DialogAddEmergencyContactComponent } from './dialog-add-emergency-contact/dialog-add-emergency-contact.component';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  hide;
  hideold;
  hidepsw;
  countNumberContactsDone = 0;
  psw_editable = false;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  required = Validators.required;
  @ViewChild('tooltip') tooltip: MatTooltip;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('content') content: IonContent;
  //add native-langauage field
  //fix dimension when resize the screen
  firstFormGroup = this._formBuilder.group({
    name: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator])],
    surname: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator])],
    nickname: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator])],
    email: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator, Validators.email])],
    phoneNumber: ['', Validators.compose([SpecialCharValidator.specialCharValidator, Validators.required, Validators.pattern('[- +()0-9]+')])],
    dateofborn: ['', Validators.compose([SpecialCharValidator.specialCharValidator, DateValidator.dateVaidator])],
    gender: [''],
    language: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator])],
    address: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator])],
    locality: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator])],
    city: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator])],
    height: ['', Validators.compose([Validators.maxLength(3), Validators.pattern("^[0-9]*$")])],
    weight: ['', Validators.compose([Validators.maxLength(3), Validators.pattern("^[0-9]*$")])],
    ethnicity: ['', Validators.compose([Validators.maxLength(15), SpecialCharValidator.specialCharValidator])],
    description: ['', Validators.compose([Validators.maxLength(200), SpecialCharValidator.specialCharValidator])],
    purpose: ['', Validators.compose([Validators.maxLength(200), SpecialCharValidator.specialCharValidator])],
    pin: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(4), Validators.pattern("^[0-9]*$")])]
  });
  secondFormGroup = this._formBuilder.group({
    allergies: ['', Validators.compose([Validators.required, Validators.maxLength(200), SpecialCharValidator.specialCharValidator])],
    medications: ['', Validators.compose([Validators.maxLength(200), SpecialCharValidator.specialCharValidator])],
    visionImpaired: [false],
    wheelchairUser: [false]
  });
  //emergency_Contacts = new Array<Emergency_Contact>(5);
  fourthFormGroup = this._formBuilder.group({
    112: ['', Validators.required],
    115: ['', Validators.required],
    118: ['', Validators.required]
  });
  readonly arrayFormGroup = [this.firstFormGroup, this.secondFormGroup, this.fourthFormGroup]
  stepperOrientation: Observable<StepperOrientation>;
  constructor(private platform: Platform, public authService: AuthenticationService, private snap4CityService: Snap4CityService, private bluetoothService: BluetoothService, public NGSIv2QUERY: NGSIv2QUERYService, public http: HttpClient, private toastCtrl: ToastController, private router: Router, private alertController: AlertController, public dialog: MatDialog, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver, private ngZone: NgZone, public shared_data: SharedDataService, private changeDetection: ChangeDetectorRef) {
    console.log('From signup')
    console.log(this.shared_data.user_data)
  }
  findErrorsAllFormsGroup() {
    console.log(this.arrayFormGroup.length)
    var error = false;
    for (var i = 0; i < this.arrayFormGroup.length && !error; i++) {
      var result = this.getFormValidationErrors(this.arrayFormGroup[i]);
      if (result.length != 0) {
        return i + 1;
      }
    }
    return error;
  }
  ngOnInit() {
    if (this.authService.isAuthenticated.getValue()) {
      this.NGSIv2QUERY.getEntity(DeviceType.PROFILE, DeviceType.PROFILE).then((data: any) => {
        this.authService.isAuthenticated.next(true);
        this.shared_data.user_data.paired_devices = [];
        this.shared_data.user_data.qr_code = [];
        this.shared_data.user_data.nfc_code = [];
        this.shared_data.user_data.emergency_contacts = [];
        this.shared_data.user_data.nickname = data.nickname.value
        this.shared_data.user_data.address = data.address.value
        this.shared_data.user_data.allergies = data.allergies.value
        this.shared_data.user_data.dateofborn = data.dateofborn.value
        this.shared_data.user_data.city = data.city.value
        this.shared_data.user_data.description = data.description.value
        this.shared_data.user_data.disabilities.visionImpaired = data.visionImpaired.value
        this.shared_data.user_data.disabilities.wheelchairUser = data.wheelchairUser.value
        this.shared_data.user_data.email = data.email.value
        this.shared_data.user_data.ethnicity = data.ethnicity.value
        this.shared_data.user_data.gender = data.gender.value
        this.shared_data.user_data.height = data.height.value
        this.shared_data.user_data.locality = data.locality.value
        this.shared_data.user_data.medications = data.medications.value
        this.shared_data.user_data.name = data.name.value
        this.shared_data.user_data.weight = data.weight.value
        this.shared_data.user_data.surname = data.surname.value
        this.shared_data.user_data.phoneNumber = data.phoneNumber.value
        this.shared_data.user_data.status = data.status.value
        this.shared_data.user_data.pin = data.pin.value
        this.shared_data.user_data.purpose = data.purpose.value
        this.shared_data.user_data.public_emergency_contacts = { 112: data.call_112.value, 115: data.call_115.value, 118: data.call_118.value }
        if (data.jewel1ID.value != '')
          this.shared_data.user_data.paired_devices.push(data.jewel1ID.value)
        if (data.jewel2ID.value != '')
          this.shared_data.user_data.paired_devices.push(data.jewel2ID.value)
        for (var i = 0; i < 5; i++) {
          var name = data['emergencyContact' + (i + 1) + 'Name'].value;
          var surname = data['emergencyContact' + (i + 1) + 'Surname'].value;
          var number = data['emergencyContact' + (i + 1) + 'Number'].value;
          console.log('contact ' + i);
          console.log(name + surname + number)
          if (name != '' && surname != '' && number != '')
            this.shared_data.user_data.emergency_contacts.push(new Emergency_Contact(name, surname, number))
        }
        for (var i = 0; i < 4; i++) {
          var qrcode = data['QR' + (i + 1)].value;
          if (qrcode != '')
            this.shared_data.user_data.qr_code.push(qrcode)
        }
        for (var i = 0; i < 4; i++) {
          var nfccode = data['NFC' + (i + 1)].value;
          if (nfccode != '')
            this.shared_data.user_data.nfc_code.push(nfccode)
        }
        this.setAllFromData();
        this.shared_data.old_user_data = JSON.parse(JSON.stringify(this.shared_data.user_data))
        //this.bluetoothService.enableAllUserBeaconFromSnap4City();
        // this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true });
      }, err => {
        console.log(err)
        if (err.status == '401' || err.status == '404') {
          this.router.navigateByUrl('/signup', { replaceUrl: true })
        }
      })
      this.changeDetection.detectChanges();
      var index = this.router.getCurrentNavigation().extras.state?.page;
      if (this.router.getCurrentNavigation().extras.state?.page) {
        setTimeout(() => {
          this.stepper.selectedIndex = index - 1;
          this.stepper.animationDone.subscribe(() => {
            this.content.scrollToBottom(500)
          })
        }, 350);
      }
    }
  }
  checkDate(ev) {
    console.log(ev)
    //if(backspace) delete 2 chars
    if (ev.inputType != 'deleteContentBackward') {
      var value: string = ev.target.value;
      var split = value.split('-');
      var year = parseInt(split[0]);
      var month = parseInt(split[1]);
      var day = parseInt(split[2]);
      var date: string = '';
      if (value.length > 3) {
        date = year + '-'
        if (!isNaN(month)) {
          if (month.toString().length < 2)
            if (month > 1)
              date += '0' + month.toString() + '-';
            else {
              date += month.toString()
              console.log(date)
            }
          else
            date += month + '-'
        }
        if (!isNaN(day)) {
          if (day.toString().length < 2)
            if (day > 3)
              date += '0' + day.toString()
            else
              date += day.toString()
          else
            date += day
        }
      }
      if (date != '') {
        this.firstFormGroup.controls['dateofborn'].setValue(date);
        console.log(date)
      }
    }
  }
  triggerResize() {
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  onlyNumbersAllowed(input, id) {
    console.log(input)
    console.log(parseInt(input.data) === NaN)
    if (isNaN(parseInt(input.data)) && input.inputType != 'deleteContentBackward') {
      var txt = this.firstFormGroup.controls[id].value;
      this.firstFormGroup.controls[id].setValue(txt.substring(0, txt.length - 1))
    }
  }
  remove_contact(index) {
    //var index = this.shared_data.user_data.emergency_contacts.findIndex((element) => element = contact);
    this.shared_data.user_data.emergency_contacts.splice(index, 1);
    if (this.authService.isAuthenticated.getValue())
      this.NGSIv2QUERY.sendUserProfile();
  }
  openDialogEmergencyContact(value, index): void {
    var ok = true;
    console.log('pass');
    var oldList = this.shared_data.user_data.paired_devices;
    if (value == 0) {
      value = { name: '', surnamne: '', number: '' }
      if (this.shared_data.user_data.emergency_contacts.length > 4)
        ok = false
    }
    if (ok) {
      const dialogRef = this.dialog.open(DialogAddEmergencyContactComponent, {
        maxWidth: '90vw',
        minWidth: '40vw',
        data: {
          contact: value,
          index: index
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        //console.log(result);
        var old_contacts = Object.assign(this.shared_data.user_data.emergency_contacts);
        console.log(result.index == -1)
        if (result.index == -1) //new element
          this.shared_data.user_data.emergency_contacts.push(new Emergency_Contact(result.data.name, result.data.surname, result.data.number))
        else //old element modified
          this.shared_data.user_data.emergency_contacts[result.index] = new Emergency_Contact(result.data.name, result.data.surname, result.data.number);
        //console.log(this.shared_data.user_data.emergency_contacts)
        if (this.authService.isAuthenticated.getValue()) {
          //let i = index == -1 ? this.shared_data.user_data.emergency_contacts.length - 1 : index
          var contacts = this.NGSIv2QUERY.getEmergencyContactsToSend(this.shared_data.user_data.emergency_contacts)
          this.NGSIv2QUERY.updateEntity(contacts, DeviceType.PROFILE).then(() => {
            this.shared_data.createToast('Contact added succesfully')
          }, err => {
            this.shared_data.user_data.emergency_contacts = Object.assign(old_contacts);
            alert(err + 'Recovered last data available')
          })
          console.log(this.shared_data.user_data.emergency_contacts)
        }
      });
    }
    else
      this.shared_data.createToast('You can register max 5 people!')
  }
  openBeaconDialog() {
    //this.shared_data.user_data.paired_devices[0] == null || this.shared_data.user_data.paired_devices[1] == null
    console.log(this.shared_data.user_data.paired_devices)
    if (this.shared_data.user_data.paired_devices.length < 2) {
      const dialogRef = this.dialog.open(DialogScanBluetoothComponent, {
        maxWidth: '90vw',
        minWidth: '40vw',
        data: { result: '' }
      })
      dialogRef.afterClosed().subscribe((result) => {
        console.log('RESULT')
        console.log(result)
        if (result != '' && result !== undefined)
          this.addPairedDeviceANDregister(result);
      }, err => (console.log(err)));
    }
    else
      this.shared_data.createToast('You have already 2 paired devices!');
  };
  addPairedDeviceANDregister(device) {
    var indexOf = this.shared_data.user_data.paired_devices.indexOf(device);
    if (indexOf == -1) {
      var attr = {}
      attr['jewel' + this.shared_data.user_data.paired_devices.length + 'ID'] = device
      this.NGSIv2QUERY.updateEntity(attr, DeviceType.PROFILE).then(() => {
        this.shared_data.user_data.paired_devices.push(device);
        alert('Device registered correctly')
      }, (err) => alert(err))
    }
    else
      alert('Device already registred')
  }
  click_next() {
    for (var i = 0; i < this.countNumberContactsDone; i++) {
      if (this.shared_data.user_data.emergency_contacts[i].name === '')
        this.shared_data.user_data.emergency_contacts.splice(1, i)
    }
  }
  show_tooltip() {
    this.tooltip.show();
    interval(4000).subscribe(() => { this.tooltip.hide(); })
  }
  delete(device, index) {
    console.log('delete pos ' + index + " -> " + device.uuid)
    var a = $('#device' + index).hide(400, () => {
      var newContacts = this.shared_data.user_data.emergency_contacts;
      newContacts.splice(index, 1);
      var data_to_send = this.NGSIv2QUERY.getEmergencyContactsToSend(newContacts);
      this.NGSIv2QUERY.updateEntity(data_to_send, DeviceType.PROFILE).then(() => {
        this.shared_data.user_data.paired_devices.splice(index, 1);
        this.shared_data.createToast('Successfully deleted')
      }, err => {
        alert('Error ' + err);
      })
      //.then(()=>{ alert('Successfully updated)},err=>aler('Update error' + err))
      //this.shared_data.user_data.paired_devices[index] = null;
      //this.shared_data.saveData();
      console.log(this.shared_data.user_data.paired_devices)
    })
  }
  getAllDataFromForm() {
    Object.keys(this.shared_data.user_data).forEach((element) => {
      console.log(element)
      switch (element) {
        case 'id': case 'paired_devices': case 'emergency_contacts': case 'nfc_code': case 'qr_code': case 'status':
          break;
        case 'allergies': case 'medications': {
          this.shared_data.user_data[element] = this.secondFormGroup.get(element)?.value;
          break
        }
        case 'public_emergency_contacts': {
          Object.keys(this.shared_data.user_data[element]).forEach((number) => {
            console.log(number)
            console.log(this.shared_data.user_data[element][number])
            this.shared_data.user_data[element][number] = this.fourthFormGroup.get(number)?.value;
          })
          break;
        }
        case 'disabilities': {
          console.log('DISABILITIES')
          //console.log(this.shared_data.user_data[element])
          Object.keys(this.shared_data.user_data[element]).forEach((dis) => {
            this.shared_data.user_data[element][dis] = this.secondFormGroup.get(dis)?.value
          })
          break;
        }
        default:
          this.shared_data.user_data[element] = this.firstFormGroup.get(element)?.value
      }
    })
    // this.shared_data.user_data.email = this.firstFormGroup.get('email')?.value;
    // this.shared_data.user_data.name = this.firstFormGroup.get('name')?.value;
    // this.shared_data.user_data.surname = this.firstFormGroup.get('surname')?.value;
    // this.shared_data.user_data.nickname = this.firstFormGroup.get('nickname')?.value;
    // this.shared_data.user_data.phoneNumber = this.firstFormGroup.get('phoneNumber')?.value;
    // this.shared_data.user_data.dateofborn = this.firstFormGroup.get('dateofborn')?.value;
    // this.shared_data.user_data.gender = this.firstFormGroup.get('gender')?.value;
    // this.shared_data.user_data.address = this.firstFormGroup.get('address')?.value;
    // this.shared_data.user_data.locality = this.firstFormGroup.get('locality')?.value;
    // this.shared_data.user_data.city = this.firstFormGroup.get('city')?.value;
    // this.shared_data.user_data.height = this.firstFormGroup.get('height')?.value;
    // this.shared_data.user_data.weight = this.firstFormGroup.get('weight')?.value;
    // this.shared_data.user_data.ethnicity = this.firstFormGroup.get('ethnicity')?.value;
    // this.shared_data.user_data.description = this.firstFormGroup.get('description')?.value;
    // this.shared_data.user_data.purpose = this.firstFormGroup.get('purpose')?.value;
    // this.shared_data.user_data.pin = this.firstFormGroup.get('pin')?.value;
    // this.shared_data.user_data.allergies = this.secondFormGroup.get('allergies')?.value;
    // this.shared_data.user_data.medications = this.secondFormGroup.get('medications')?.value;
  }
  setAllFromData() {
    Object.keys(this.shared_data.user_data).forEach((element) => {
      console.log(element)
      switch (element) {
        case 'id': case 'emergency_contacts': case 'paired_devices': case 'qr_code': case 'nfc_code': case 'status':
          break;
        case 'allergies': case 'medications': {
          this.secondFormGroup.get(element).setValue(this.shared_data.user_data[element])
          break
        }
        case 'public_emergency_contacts': {
          Object.keys(this.shared_data.user_data[element]).forEach((number) => {
            this.fourthFormGroup.get(number).setValue(this.shared_data.user_data[element][number] === 'true' ? true : false);
          })
          break;
        }
        case 'disabilities': {
          Object.keys(this.shared_data.user_data[element]).forEach((dis) => {
            this.secondFormGroup.get(dis).setValue(this.shared_data.user_data[element][dis])
          })
          break;
        }
        default:
          this.firstFormGroup.get(element).setValue(this.shared_data.user_data[element])
      }
    })
  }
  save_data() {
    //conyrollo
    // console.log(this.zeroFormGroup.errors);
    // console.log(this.getFormValidationErrors(this.zeroFormGroup))
    var error = this.findErrorsAllFormsGroup();
    console.log('OLD DATA')
    console.log(this.shared_data.old_user_data)
    console.log('STANDARD DATA')
    console.log(this.shared_data.user_data)
    if (!error) {      //check if changes it is registred in db
      this.getAllDataFromForm();
      console.log(this.shared_data.user_data)
      this.NGSIv2QUERY.sendUserProfile().then((value) => {
        this.shared_data.old_user_data = JSON.parse(JSON.stringify(this.shared_data.user_data))
        this.shared_data.createToast('Data updated!');
      }, (err) => {
        console.log(this.shared_data.old_user_data)
        this.shared_data.user_data = JSON.parse(JSON.stringify(this.shared_data.old_user_data))
        console.log('AFTER OBJECT')
        console.log(this.shared_data.user_data)
        this.setAllFromData();
        this.changeDetection.detectChanges()
        alert('Error ' + err + '. Recovered old data available')
      })
      // this.NGSIv2QUERY.sendUserProfile(new Date().toISOString()).then((value) => {
      //   this.getAllDataFromForm();
      //   console.log(value);
      //   this.shared_data.saveData();
      //   this.shared_data.createToast('Data updated!');
      // }, (err) => this.shared_data.createToast(err))
    }
    else
      this.shared_data.createToast('Error in step number ' + (error));
  }
  getFormValidationErrors(form: FormGroup) {
    const result = [];
    Object.keys(form.controls).forEach(key => {
      const controlErrors: ValidationErrors = form.get(key).errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push({
            'control': key,
            'error': keyError,
            'value': controlErrors[keyError]
          });
        });
      }
    });
    return result;
  }
  register_user() {
    // var error = this.findErrorsAllFormsGroup();
    // if (!error)
    if (this.shared_data.user_data.paired_devices.length > -1) {
      this.getAllDataFromForm();
      console.log(this.shared_data.user_data)
      this.snap4CityService.createDevice(DeviceType.PROFILE).then(() => {
        console.log('Device created')
        this.NGSIv2QUERY.sendUserProfile().then(() => {
          this.shared_data.createToast('Successfully registered')
          this.authService.isAuthenticated.next(true);
          this.shared_data.old_user_data = JSON.parse(JSON.stringify(this.shared_data.user_data))
          this.router.navigateByUrl('profile/menu/homepage', { replaceUrl: true })
        }, (err) => console.log(err))
      }, err => {
        console.log(err)
        this.snap4CityService.deleteDevice(DeviceType.PROFILE).then(() => {
          console.log('Device deleted')
        }, err => console.log(err))
      })

    }
    else
      this.shared_data.createToast('You must pair at least one device!')
  }
  go_back() {
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
  modifyNameDevice(i) {
    // const dialogRef = this.dialog.open(DialogModifyNameComponent, {
    //   maxWidth: '90vw',
    //   minWidth: '40vw',
    //   data: {
    //     name: ''
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result)
    //   if (result != undefined && result != '') {
    //     console.log(i)
    //     console.log(this.shared_data.user_data.paired_devices[i])
    //     this.shared_data.user_data.paired_devices[i].name = result;
    //     //this.save_data()
    //   }
    //   console.log(this.shared_data.user_data.paired_devices)
    // });
  }

}
export class SpecialCharValidator {
  static specialCharValidator(control: FormControl): { [key: string]: boolean } {
    const nameRegexp: RegExp = /[<>"'=;()]/;
    if (control.value && nameRegexp.test(control.value)) {
      return { invalidName: true };
    }
  }
}
class DateValidator {
  static dateVaidator(AC: AbstractControl) {
    if (AC && AC.value && (!moment(AC.value, 'YYYY-MM-DD', true).isValid() || (moment().diff(AC.value) < 0 || moment().diff(AC.value, 'day') > 365 * 150))) {
      return { dateValidator: true };
    }
    return null;
  }
}