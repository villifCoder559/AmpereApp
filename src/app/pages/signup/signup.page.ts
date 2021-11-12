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
import { MatTooltip } from '@angular/material/tooltip';
import { BLE } from '@ionic-native/ble/ngx';
import * as bcrypt from 'bcryptjs';
import { AlertController, IonContent, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService, UserData, Device, Emergency_Contact } from '../../data/shared-data.service'
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import * as moment from 'moment';
import { Contacts, ContactName, ContactField } from '@ionic-native/contacts/ngx';
import { DialogScanBluetoothComponent } from './dialog-scan-bluetooth/dialog-scan-bluetooth.component';
import { Entity, NGSIv2QUERYService } from '../../data/ngsiv2-query.service'
import { BluetoothService } from '../../data/bluetooth.service'
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
/*Rivedi invio registrazione utente, evita di inviare dati non compilati tipo NFC o QRcode o emergency contact */
export class SignupPage implements OnInit {
  logged = false;
  hide;
  hideold;
  hidepsw;
  posNumberContacts = [false, false, false, false, false];
  countNumberContactsDone = 0;
  name;
  number;
  editable = false;
  data = {
    name: '',
    number: ''
  }
  user_data: UserData;
  public_emergency_contacts
  paired_devices = [new Device(), new Device()];
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  required = Validators.required;
  @ViewChild('tooltip') tooltip: MatTooltip;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('content') content: IonContent;
  pswValidator: Validators = [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[|!"£/()?@#$%^&+=]).*$')];
  zeroFormGroup = this._formBuilder.group({
    email: ['', Validators.email],
    psw: [''],
    confirm_psw: [''],
    old_psw: ['']
  }, {
    validators: [ValidatePassword.ConfirmValidator('psw', 'confirm_psw')]
  })
  firstFormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    birthdate: ['', Validators.compose([Validators.required, DateValidator.dateVaidator])],
    gender: ['', Validators.required],
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
    allergies: ['', Validators.maxLength(200)],
    medications: ['', Validators.maxLength(200)]
  });
  thirdFormGroup = this._formBuilder.group({
    contact0name: [''],
    contact0number: [''],
    contact1name: [''],
    contact1number: [''],
    contact2name: [''],
    contact2number: [''],
    contact3name: [''],
    contact3number: [''],
    contact4name: [''],
    contact4number: [''],
  });
  fourthFormGroup = this._formBuilder.group({
    fourthCtrl: ['']
  });
  readonly arrayFormGroup = [this.zeroFormGroup, this.firstFormGroup, this.secondFormGroup, this.thirdFormGroup, this.fourthFormGroup]
  stepperOrientation: Observable<StepperOrientation>;
  myContacts = [
    {
      name: 'pol',
      number: '12345555'
    }, {
      name: 'Aliss',
      number: '1249855'
    }, {
      name: 'sdgf',
      number: '7654123'
    }, {
      name: 'Pasq',
      number: '129852185'
    }
  ];
  constructor(private bluetoothService: BluetoothService, public NGSIv2QUERY: NGSIv2QUERYService, public http: HttpClient, private toastCtrl: ToastController, private router: Router, private alertController: AlertController, public dialog: MatDialog, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver, private ngZone: NgZone, private shared_data: SharedDataService, private changeDetection: ChangeDetectorRef) {
    this.user_data = this.shared_data.user_data;
    if (this.user_data == undefined) {
      this.user_data = new UserData();
    }
    this.stepperOrientation = breakpointObserver.observe('(min-width: 1000px)')
      .pipe(map(({ matches }) => matches ? 'horizontal' : 'vertical'));
    this.logged = this.shared_data.is_logged;
  }
  sendPostRequest() {
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let postData = {
      "name": "Customer004",
      "email": "customer004@email.com",
      "tel": "0000252525"
    }
    this.http.post("http://127.0.0.1:1880/home", postData, { headers: headers })
      .subscribe(data => {
      }, error => {
        console.log(error);
      });
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
  /*Create generalised check foreach formGroup field. this specific implementation working fine*/
  change_EmailPassword() {
    this.editable = !this.editable;
    if (!this.editable) {
      this.zeroFormGroup.controls['psw'].setErrors(null);
      this.zeroFormGroup.controls['confirm_psw'].setErrors(null);
      this.zeroFormGroup.controls['old_psw'].setErrors(null);
      console.log('clear')
    }
    else {
      this.zeroFormGroup.controls['psw'].setErrors(this.pswValidator)
      this.zeroFormGroup.controls['confirm_psw'].setErrors([Validators.required])
      this.zeroFormGroup.controls['old_psw'].setErrors([Validators.required])
      this.createToast('If you don\'t want to modify your password, click close Edit psw')
    }
    this.zeroFormGroup.updateValueAndValidity();

  }

  ngOnInit() {
    if (this.logged) {
      // this.user_data.password = bcrypt.hashSync(this.zeroFormGroup.get('password')?.value, 10);
      const user_data: UserData = this.shared_data.user_data;
      this.zeroFormGroup.get('email').setValue(user_data.email)
      console.log(user_data);
      this.firstFormGroup.setValue({
        name: user_data.name,
        surname: user_data.surname,
        phoneNumber: user_data.phoneNumber,
        birthdate: user_data.birthdate,
        gender: user_data.gender,
        address: user_data.address,
        locality: user_data.locality,
        city: user_data.city,
        height: user_data.height,
        weight: user_data.weight,
        ethnicity: user_data.ethnicity,
        description: user_data.description,
        purpose: user_data.purpose,
        pin: user_data.pin
      });
      // this.user_data.disabilities saved thanks toogle_checkbox(i)
      this.user_data.disabilities = user_data.disabilities;
      this.secondFormGroup.setValue({
        allergies: user_data.allergies,
        medications: user_data.medications
      })
      for (var i = 0; i < 5; i++) {
        var mat_card_number = "contact" + (i) + "number";
        var mat_card_name = "contact" + (i) + "name";
        if (user_data.emergency_contacts[i] != undefined && user_data.emergency_contacts[i].number != '') {
          this.emergency_contacts.push(user_data.emergency_contacts[i])
          this.thirdFormGroup.get(mat_card_name).setValue(user_data.emergency_contacts[i].name);
          this.thirdFormGroup.get(mat_card_number).setValue(user_data.emergency_contacts[i].number);
        }
      }
      this.user_data.public_emergency_contacts = user_data.public_emergency_contacts;
      console.log('Paired devices list')
      for (var i = 0; i < this.paired_devices.length; i++)
        if (this.user_data.paired_devices[i] != undefined)
          this.paired_devices[i] = user_data.paired_devices[i]
      console.log(this.paired_devices)
      this.changeDetection.detectChanges();
      if (this.router.getCurrentNavigation().extras.state?.page == 6) {
        setTimeout(() => {
          this.stepper.selectedIndex = 5;
          this.stepper.animationDone.subscribe(() => {
            this.content.scrollToBottom(500)
          })
        }, 250);
      }
    }
  }
  checkData(ev) {
    console.log(ev)
    //if(backspace) delete 2 chars
    if (ev.inputType != 'deleteContentBackward') {
      var value: string = ev.target.value;
      var split = value.split('/');
      console.log(split)
      if (split.length < 3) {
        if (split.length == 2 || split.length == 5) {
          this.firstFormGroup.controls['birthdate'].setValue(ev.target.value + '/');
        }
        else {
          for (var i = 0; i < split.length; i++) {
            if (i == 0) {
              if (parseInt(split[i]) > 1) {//month
                this.firstFormGroup.controls['birthdate'].setValue(ev.target.value + '/');
              }
            }
            else {
              if (i == 1 && parseInt(split[i]) > 3) {//day
                this.firstFormGroup.controls['birthdate'].setValue(ev.target.value + '/');
              }
            }
          }
        }
      }
    }
    else if (ev.inputType == 'deleteContentBackward') {

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

  add_Contact() {
    this.getFormValidationErrors(this.thirdFormGroup)
    if (this.countNumberContactsDone < 5 && !this.thirdFormGroup.hasError('required')) {
      this.countNumberContactsDone++;
      const app = new Emergency_Contact()
      this.emergency_contacts.push(app)
    }
  }
  remove_contact(id) {
    this.emergency_contacts.splice(id, 1)
    this.countNumberContactsDone--;
    var mat_card_number = "contact" + (id) + "number";
    var mat_card_name = "contact" + (id) + "name";
    this.thirdFormGroup.get(mat_card_name).setValue("");
    this.thirdFormGroup.get(mat_card_number).setValue(undefined);
  }

  openDialogContacts(id): void {
    const dialogRef = this.dialog.open(DialogExampleComponent, {
      maxWidth: '90vw',
      minWidth: '40vw',
      data: {
        contact: { name: '', number: '' }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      var app = 'contact' + id + 'name';
      if (result?.name != undefined && result?.number != undefined) {
        this.thirdFormGroup.get(app).setValue(result.name)
        var app = 'contact' + id + 'number';
        this.thirdFormGroup.get(app).setValue(result.number)
      }
    });
  }
  openDialogBLE(): void {
    var count_device_paired = 0;
    this.paired_devices.forEach((element: Device) => {
      if (element?.id != '-1') {
        count_device_paired++;
        console.log(element?.id)
      }
    })
    if (count_device_paired < this.paired_devices.length) {
      const dialogRef = this.dialog.open(DialogScanBluetoothComponent, {
        maxWidth: '90vw',
        minWidth: '40vw'
        //data: { id: '' }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result)
        if (result != null && result != '' && result != undefined) {
          var index;
          if (this.paired_devices[0].id == '-1') {
            index = 0;
          }
          else
            index = 1;
          console.log('save data')
          this.paired_devices[index].advertising = result?.advertising;
          this.paired_devices[index].charateristics = result?.characteristics;
          this.paired_devices[index].id = result.id;
          this.paired_devices[index].name = result.name;
          this.paired_devices[index].rssi = result.rssi;
          this.paired_devices[index].services = result.services;
          this.shared_data.user_data.paired_devices[index] = this.paired_devices[index];
          //this.bluetoothService.startNotificationDevice(result)
          this.bluetoothService.autoConnectBluetooth();
        }
      }, (err) => console.log(err))
    }
    else {
      alert('Max number of devices reached! You have to swipe left a item and delete it')
    }
  };
  click_next() {
    for (var i = 0; i < this.countNumberContactsDone; i++) {
      if (this.emergency_contacts[i].name === '')
        this.emergency_contacts.splice(1, i)
    }
  }
  show_tooltip() {
    this.tooltip.show();
    interval(4000).subscribe(() => { this.tooltip.hide(); })
  }
  emergency_contacts: Emergency_Contact[] = []

  scanInterval = null;
  delete(device: Device, index) {
    console.log('delete pos ' + index + " -> " + device.id)
    var a = $('#device' + index).hide(800, () => {
      this.paired_devices.splice(index, 1);
      this.paired_devices[index] = new Device;
      this.bluetoothService.disconnectDevice(device.id);
      console.log(this.paired_devices)
    })
  }
  save_data() {
    //conyrollo
    console.log(this.zeroFormGroup.errors);
    console.log(this.getFormValidationErrors(this.zeroFormGroup))
    this.register_user();
    var error = this.findErrorsAllFormsGroup();
    if (!error)      //check if change is registred in db
    {
      this.NGSIv2QUERY.updateEntity(Entity.USERID).then((value) => {
        console.log(value);
        this.createToast('Data updated!');
      }, (err) => this.createToast(err))

    }
    else
      this.createToast('Error in step number ' + (error));
  }
  async createToast(header) {
    let toast = await this.toastCtrl.create({
      header: header,
      duration: 3500
    })
    toast.present();
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
    // this.user_data.password = bcrypt.hashSync(this.zeroFormGroup.get('password')?.value, 10);
    this.user_data.email = this.zeroFormGroup.get('email')?.value;
    this.user_data.name = this.firstFormGroup.get('name')?.value;
    this.user_data.surname = this.firstFormGroup.get('surname')?.value;
    this.user_data.phoneNumber = this.firstFormGroup.get('phoneNumber')?.value;
    this.user_data.birthdate = this.firstFormGroup.get('birthdate')?.value;
    this.user_data.gender = this.firstFormGroup.get('gender')?.value;
    this.user_data.address = this.firstFormGroup.get('address')?.value;
    this.user_data.locality = this.firstFormGroup.get('locality')?.value;
    this.user_data.city = this.firstFormGroup.get('city')?.value;
    this.user_data.height = this.firstFormGroup.get('height')?.value;
    this.user_data.weight = this.firstFormGroup.get('weight')?.value;
    this.user_data.ethnicity = this.firstFormGroup.get('ethnicity')?.value;
    this.user_data.description = this.firstFormGroup.get('description')?.value;
    this.user_data.purpose = this.firstFormGroup.get('purpose')?.value;
    this.user_data.pin = this.firstFormGroup.get('pin')?.value;
    // this.user_data.disabilities saved thanks toogle_checkbox(i)
    this.user_data.allergies = this.secondFormGroup.get('allergies')?.value;
    this.user_data.medications = this.secondFormGroup.get('medications')?.value;
    for (var i = 0; i < this.user_data.emergency_contacts.length; i++) {
      var index = i + '';
      var mat_card_name = "contact" + (index) + "name";
      var mat_card_number = "contact" + (index) + "number";
      var contact: Emergency_Contact = { name: '', number: '' };
      contact.name = this.thirdFormGroup.get(mat_card_name)?.value;
      contact.number = this.thirdFormGroup.get(mat_card_number)?.value
      if (contact.name != '' && contact.number != '') {
        this.user_data.emergency_contacts[i] = contact;
      }
    }
    for (var i = 0; i < this.user_data.paired_devices.length; i++) {
      if (this.paired_devices[i].id != '-1')
        this.user_data.paired_devices[i] = this.paired_devices[i];
    }

    this.shared_data.setUserData(this.user_data)
    this.registrationUserSnap4City();
  }
  toggle_checkbox_disabilities(index) {
    this.user_data.disabilities[index] = !this.user_data.disabilities[index];
  }
  toggle_checkbox_public_emergency_contacts(id) {
    this.user_data.public_emergency_contacts[id] = !this.user_data.public_emergency_contacts[id];
  }
  go_back() {
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
  // public trackItem(index: number, item) {
  //   return item.trackId;
  // }

  registrationUserSnap4City(id: number = -1) {
    var query;
    const query_entity = {
      dataObserved: {
        value: new Date().toTimeString(),
        type: 'timestamp'
      },
      name: {
        value: this.user_data.name,
        type: 'name'
      },
      email: {
        value: this.user_data.email,
        type: 'description'
      },
      surname: {
        value: this.user_data.surname,
        type: 'description'
      },
      phoneNumber: {
        value: this.user_data.name,
        type: 'description'
      },
      dateofborn: {
        value: this.user_data.birthdate,
        type: 'date'
      },
      gender: {
        value: this.user_data.gender,
        type: 'status'
      },
      address: {
        value: this.user_data.address,
        type: 'description'
      },
      locality: {
        value: this.user_data.locality,
        type: 'description'
      },
      city: {
        value: this.user_data.city,
        type: 'description'
      },
      height: {
        value: this.user_data.height,
        type: 'height'
      },
      weight: {
        value: this.user_data.weight,
        type: 'weight'
      },
      ethnicity: {
        value: this.user_data.ethnicity,
        type: 'description'
      },
      description: {
        value: this.user_data.description,
        type: 'description'
      },
      purpose: {
        value: this.user_data.purpose,
        type: 'description'
      },
      pin: {
        value: this.user_data.pin,
        type: 'description'
      },
      visionImpaired: {
        value: this.user_data.disabilities[0],
        type: 'description'
      },
      wheelchairUser: {
        value: this.user_data.disabilities[1],
        type: 'description'
      },
      allergies: {
        value: this.user_data.allergies,
        type: 'description'
      },
      medications: {
        value: this.user_data.medications,
        type: 'description'
      },
      emergencyContact1Name: {
        value: this.user_data.emergency_contacts[0]?.name,
        type: 'name'
      },
      emergencyContact1Number: {
        value: this.user_data.emergency_contacts[0]?.number,
        type: 'description'
      },
      emergencyContact2Name: {
        value: this.user_data.emergency_contacts[1]?.name,
        type: 'name'
      },
      emergencyContact2Number: {
        value: this.user_data.emergency_contacts[1]?.number,
        type: 'description'
      },
      emergencyContact3Name: {
        value: this.user_data.emergency_contacts[2]?.name,
        type: 'name'
      },
      emergencyContact3Number: {
        value: this.user_data.emergency_contacts[2]?.number,
        type: 'description'
      },
      emergencyContact4Name: {
        value: this.user_data.emergency_contacts[3]?.name,
        type: 'name'
      },
      emergencyContact4Number: {
        value: this.user_data.emergency_contacts[3]?.number,
        type: 'description'
      },
      emergencyContact5Name: {
        value: this.user_data.emergency_contacts[4]?.name,
        type: 'name'
      },
      emergencyContact5Number: {
        value: this.user_data.emergency_contacts[4]?.number,
        type: 'description'
      },
      call_113: {
        value: this.user_data.public_emergency_contacts[113],
        type: 'description'
      },
      call_115: {
        value: this.user_data.public_emergency_contacts[115],
        type: 'description'
      },
      call_118: {
        value: this.user_data.public_emergency_contacts[118],
        type: 'description'
      },
      jewel1ID: {
        value: this.user_data.paired_devices[0]?.id,
        type: 'identifier'
      },
      jewel2ID: {
        value: this.user_data.paired_devices[1]?.id,
        type: 'identifier'
      },
      QR1: {
        value: this.user_data.qr_code[0].id,
        type: 'identifier'
      },
      QR2: {
        value: this.user_data.qr_code[1].id,
        type: 'identifier'
      },
      QR3: {
        value: this.user_data.qr_code[2].id,
        type: 'identifier'
      },
      QR4: {
        value: this.user_data.qr_code[3].id,
        type: 'identifier'
      },
      NFC1: {
        value: this.user_data.nfc_code[0].id,
        type: 'identifier'
      },
      NFC2: {
        value: this.user_data.nfc_code[1].id,
        type: 'identifier'
      },
      NFC3: {
        value: this.user_data.nfc_code[2].id,
        type: 'identifier'
      },
      NFC4: {
        value: this.user_data.nfc_code[3].id,
        type: 'identifier'
      },
    }
    console.log(query_entity)
    if (id == -1)
      query = this.NGSIv2QUERY.registerEntity(Entity.EVENT, id, this.user_data).then(() => {
        this.createToast('Successfull')
      }, (err) => this.createToast(err))
    else
      query = this.NGSIv2QUERY.updateEntity(Entity.USERID).then(() => {
        this.createToast('Successfull')
      }, (err) => this.createToast(err))
  }
  getUserSnap4City() {
    var id = 0;
    var query = this.NGSIv2QUERY.getEntity(Entity.USERID)
  }
  updateSnap4City() {
    var id = 0;/* get id in some way */
    this.registrationUserSnap4City(id)
  }
}

class DateValidator {
  static dateVaidator(AC: AbstractControl) {
    if (AC && AC.value && (!moment(AC.value, 'MM/DD/YYYY', true).isValid() && !moment(AC.value, 'M/D/YYYY', true).isValid())) {
      return { dateValidator: true };
    }
    return null;
  }
}

class ValidatePassword {
  static ConfirmValidator(name: string, checkName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(name);
      const checkControl = controls.get(checkName);
      if (checkControl.errors && !checkControl.errors.matching) { //avoid errors when confirm_password is not yet insert
        return null;
      }
      if (control.value !== checkControl.value) {
        controls.get(checkName).setErrors({ matching: true });
        return { matching: true }
      }
      else {
        controls.get(checkName).setErrors(null)
        return null
      }
    }
  }
}