import { Component, OnInit, ChangeDetectorRef, Input, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
import { AlertController, IonContent, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService, UserData, Emergency_Contact } from '../../data/shared-data.service'
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import * as moment from 'moment';
import { Contacts, ContactName, ContactField } from '@ionic-native/contacts/ngx';
import { DialogScanBluetoothComponent } from './dialog-scan-bluetooth/dialog-scan-bluetooth.component';
import { Entity, NGSIv2QUERYService } from '../../data/ngsiv2-query.service'
import { BluetoothService } from '../../data/bluetooth.service'
import { Snap4CityService } from '../../data/snap4-city.service'
import { AuthenticationService } from '../../services/authentication.service'
import { DialogAddEmergencyContactComponent } from './dialog-add-emergency-contact/dialog-add-emergency-contact.component';
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
  firstFormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    nickname: ['', Validators.required],
    email: ['', Validators.email],
    phoneNumber: ['', Validators.compose([Validators.required,Validators.pattern('[- +()0-9]+')])],
    birthdate: ['', Validators.compose([DateValidator.dateVaidator])],
    gender: [''],
    address: ['', Validators.required],
    locality: ['', Validators.required],
    city: ['', Validators.required],
    height: ['', [Validators.maxLength(3), Validators.pattern("^[0-9]*$")]],
    weight: ['', [Validators.maxLength(3), Validators.pattern("^[0-9]*$")]],
    ethnicity: ['', Validators.maxLength(15)],
    description: ['', Validators.maxLength(200)],
    purpose: ['', Validators.maxLength(200)],
    pin: ['', Validators.minLength(4)]
  });
  secondFormGroup = this._formBuilder.group({
    allergies: ['', [Validators.required, Validators.maxLength(200)]],
    medications: ['', Validators.maxLength(200)]
  });
  //emergency_Contacts = new Array<Emergency_Contact>(5);
  
  fourthFormGroup = this._formBuilder.group({
    call_112: ['', Validators.required],
    call_115: ['', Validators.required],
    call_118: ['', Validators.required]
  });
  readonly arrayFormGroup = [this.firstFormGroup, this.secondFormGroup, this.fourthFormGroup]
  stepperOrientation: Observable<StepperOrientation>;
  constructor(private platform: Platform, public authService: AuthenticationService, private snap4CityService: Snap4CityService, private bluetoothService: BluetoothService, public NGSIv2QUERY: NGSIv2QUERYService, public http: HttpClient, private toastCtrl: ToastController, private router: Router, private alertController: AlertController, public dialog: MatDialog, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver, private ngZone: NgZone, public shared_data: SharedDataService, private changeDetection: ChangeDetectorRef) {
    // this.stepperOrientation = breakpointObserver.observe('(min-width: 1000px)')
    //   .pipe(map(({ matches }) => matches ? 'horizontal' : 'vertical'));
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
      console.log('data from signup')
      console.log(this.shared_data.user_data)
      //this.firstFormGroup.get('email').setValue(this.shared_data.user_data.email)
      this.firstFormGroup.setValue({
        name: this.shared_data.user_data.name,
        surname: this.shared_data.user_data.surname,
        nickname: this.shared_data.user_data.nickname,
        email: this.shared_data.user_data.email,
        phoneNumber: this.shared_data.user_data.phoneNumber,
        birthdate: this.shared_data.user_data.birthdate,
        gender: this.shared_data.user_data.gender,
        address: this.shared_data.user_data.address,
        locality: this.shared_data.user_data.locality,
        city: this.shared_data.user_data.city,
        height: this.shared_data.user_data.height,
        weight: this.shared_data.user_data.weight,
        ethnicity: this.shared_data.user_data.ethnicity,
        description: this.shared_data.user_data.description,
        purpose: this.shared_data.user_data.purpose,
        pin: this.shared_data.user_data.pin
      });
      // this.user_data.disabilities saved thanks toogle_checkbox(i)
      this.secondFormGroup.setValue({
        allergies: this.shared_data.user_data.allergies,
        medications: this.shared_data.user_data.medications
      })
      this.fourthFormGroup.setValue({
        call_112: this.shared_data.user_data.public_emergency_contacts[112],
        call_115: this.shared_data.user_data.public_emergency_contacts[115],
        call_118: this.shared_data.user_data.public_emergency_contacts[118]
      })
      console.log(this.shared_data.user_data.paired_devices)
      this.changeDetection.detectChanges();
      var index=this.router.getCurrentNavigation().extras.state?.page;
      if (this.router.getCurrentNavigation().extras.state?.page) {
        setTimeout(() => {
          this.stepper.selectedIndex = index-1;
          this.stepper.animationDone.subscribe(() => {
            this.content.scrollToBottom(500)
          })
        }, 350);
      }
    }
  }
  checkData(ev) {
    console.log(ev)
    //if(backspace) delete 2 chars
    if (ev.inputType != 'deleteContentBackward') {
      var value: string = ev.target.value;
      var split = value.split('/');
      var year = parseInt(split[0]);
      var month = parseInt(split[1]);
      var day = parseInt(split[2]);
      var date: string = '';
      if (value.length > 3) {
        date = year + '/'
        if (!isNaN(month)) {
          if (month.toString().length < 2)
            if (month > 1)
              date += '0' + month.toString() + '/';
            else {
              date += month.toString()
              console.log(date)
            }
          else
            date += month + '/'
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
        this.firstFormGroup.controls['birthdate'].setValue(date);
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
  }
  openDialogEmergencyContact(value, index): void {
    var ok = true;
    console.log('pass')
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
        console.log(result);
        if (result.index == -1)
          this.shared_data.user_data.emergency_contacts.push(new Emergency_Contact(result.data.name, result.data.surname, result.data.number))
        else
          this.shared_data.user_data.emergency_contacts[result.index] = new Emergency_Contact(result.data.name, result.data.surname, result.data.number);
        console.log(this.shared_data.user_data.emergency_contacts)
      });
    }
    else
      this.shared_data.createToast('You can register max 5 people!')
  }
  openBeaconDialog(): void {
    console.log(this.shared_data.user_data.paired_devices)
    if (this.shared_data.user_data.paired_devices[0] == null || this.shared_data.user_data.paired_devices[1] == null) {
      const dialogRef = this.dialog.open(DialogScanBluetoothComponent, {
        maxWidth: '90vw',
        minWidth: '40vw'
      });
    }
    else
      this.shared_data.createToast('You have already 2 paired devices!');
  };
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
      this.shared_data.user_data.paired_devices.splice(index, 1);
      //this.shared_data.user_data.paired_devices[index] = null;
      this.shared_data.saveData();
      console.log(this.shared_data.user_data.paired_devices)
    })
  }
  getAllDataFromForm(){
    this.shared_data.user_data.email = this.firstFormGroup.get('email')?.value;
    this.shared_data.user_data.name = this.firstFormGroup.get('name')?.value;
    this.shared_data.user_data.surname = this.firstFormGroup.get('surname')?.value;
    this.shared_data.user_data.nickname=this.firstFormGroup.get('nickname')?.value;
    this.shared_data.user_data.phoneNumber = this.firstFormGroup.get('phoneNumber')?.value;
    this.shared_data.user_data.birthdate = this.firstFormGroup.get('birthdate')?.value;
    this.shared_data.user_data.gender = this.firstFormGroup.get('gender')?.value;
    this.shared_data.user_data.address = this.firstFormGroup.get('address')?.value;
    this.shared_data.user_data.locality = this.firstFormGroup.get('locality')?.value;
    this.shared_data.user_data.city = this.firstFormGroup.get('city')?.value;
    this.shared_data.user_data.height = this.firstFormGroup.get('height')?.value;
    this.shared_data.user_data.weight = this.firstFormGroup.get('weight')?.value;
    this.shared_data.user_data.ethnicity = this.firstFormGroup.get('ethnicity')?.value;
    this.shared_data.user_data.description = this.firstFormGroup.get('description')?.value;
    this.shared_data.user_data.purpose = this.firstFormGroup.get('purpose')?.value;
    this.shared_data.user_data.pin = this.firstFormGroup.get('pin')?.value;
    this.shared_data.user_data.allergies = this.secondFormGroup.get('allergies')?.value;
    this.shared_data.user_data.medications = this.secondFormGroup.get('medications')?.value;
    this.shared_data.user_data.public_emergency_contacts[112] = this.fourthFormGroup.get('call_112')?.value;
    this.shared_data.user_data.public_emergency_contacts[115] = this.fourthFormGroup.get('call_115')?.value;
    this.shared_data.user_data.public_emergency_contacts[118] = this.fourthFormGroup.get('call_118')?.value;
  }
  save_data() {
    //conyrollo
    // console.log(this.zeroFormGroup.errors);
    // console.log(this.getFormValidationErrors(this.zeroFormGroup))
    var error = this.findErrorsAllFormsGroup();
    if (!error)      //check if change is registred in db
    {
      this.NGSIv2QUERY.sendUserProfile(new Date().toISOString()).then((value) => {
        this.getAllDataFromForm();
        console.log(value);
        this.shared_data.saveData();
        this.shared_data.createToast('Data updated!');
      }, (err) => this.shared_data.createToast(err))
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
    if(this.shared_data.user_data.paired_devices.length>0){
      this.getAllDataFromForm();
      // this.snap4CityService.registerUser().then(() => {
    //   this.shared_data.createToast('Successfull registered')
    // }, (err) => this.shared_data.createToast(err));
    }
    else
      this.shared_data.createToast('You must pair at least one device!')
  }
  toggle_checkbox_disabilities(index) {
    this.shared_data.user_data.disabilities[index] = !this.shared_data.user_data.disabilities[index];
  }
  toggle_checkbox_public_emergency_contacts(id) {
    this.shared_data.user_data.public_emergency_contacts[id] = !this.shared_data.user_data.public_emergency_contacts[id];
  }
  go_back() {
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
  modifyNameDevice(i) {
    const dialogRef = this.dialog.open(DialogModifyNameComponent, {
      maxWidth: '90vw',
      minWidth: '40vw',
      data: {
        name: ''
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result != undefined && result != '') {
        console.log(i)
        console.log(this.shared_data.user_data.paired_devices[i])
        this.shared_data.user_data.paired_devices[i].name = result;
        //this.save_data()
      }
      console.log(this.shared_data.user_data.paired_devices)
    });
  }

}

class DateValidator {
  static dateVaidator(AC: AbstractControl) {
    if (AC && AC.value && (!moment(AC.value, 'YYYY/MM/DD', true).isValid() || (moment().diff(AC.value) < 0 || moment().diff(AC.value, 'day') > 365 * 150))) {
      return { dateValidator: true };
    }
    return null;
  }
}