import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { interval, Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgZone, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { Contacts, ContactName, ContactField, Contact } from '@ionic-native/contacts';
import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogExampleComponent } from './dialog-example/dialog-example.component';
import { MatTooltip } from '@angular/material/tooltip';
import { BLE } from '@ionic-native/ble/ngx';
import * as bcrypt from 'bcryptjs';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SharedDataService, UserData, Device, Emergency_Contact } from '../../data/shared-data.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  logged = false;
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
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  required = Validators.required;
  @ViewChild('tooltip') tooltip: MatTooltip;

  zeroFormGroup = this._formBuilder.group({
    email: ['', Validators.email],
    psw: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[|!"£/()?@#$%^&+=]).*$')]],
    confirm_psw: ['', [Validators.required]],
    old_psw: ['']
  }, {
    validators: [ValidatePassword.ConfirmValidator('psw', 'confirm_psw')]
  })
  firstFormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    birthdate: ['', Validators.required],
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
  constructor(private toastCtrl: ToastController, private router: Router, private alertController: AlertController, public ble: BLE, public dialog: MatDialog, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver, private ngZone: NgZone, private contacts: Contacts, private shared_data: SharedDataService, private changeDetection: ChangeDetectorRef) {
    this.user_data = this.shared_data.getUserData();
    console.log(this.user_data)
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({ matches }) => matches ? 'horizontal' : 'vertical'));
    this.logged = this.shared_data.getIs_logged();
    console.log(this.logged)
    this.user_data = new UserData()
  }
  logErrors() {
    console.log("required->", this.zeroFormGroup.get('psw').hasError('required'))
    console.log("minlength->", this.zeroFormGroup.get('psw').hasError('minlength'))
    console.log("pattern->", this.zeroFormGroup.get('psw').hasError('pattern'))
    console.log("required->", this.zeroFormGroup.get('psw').errors)
  }
  change_EmailPassword() {
    this.editable = !this.editable
  }
  log_data() {
    console.log(this.firstFormGroup.get('birthdate'))
  }
  ngOnInit() {
    if (this.logged) {
      // this.user_data.password = bcrypt.hashSync(this.zeroFormGroup.get('password')?.value, 10);
      const user_data: UserData = this.shared_data.getUserData();
      this.zeroFormGroup.get('email').setValue(user_data.email)
      console.log(user_data.email)
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
      console.log(user_data.disabilities)
      this.user_data.disabilities = user_data.disabilities;
      this.secondFormGroup.setValue({
        allergies: user_data.allergies,
        medications: user_data.medications
      })
      console.log(user_data.emergency_contacts)
      for (var i = 0; i < 5; i++) {
        var mat_card_number = "contact" + (i) + "number";
        var mat_card_name = "contact" + (i) + "name";
        console.log(user_data.emergency_contacts[i])
        if (user_data.emergency_contacts[i] != undefined && user_data.emergency_contacts[i].number != '') {
          this.emergency_contacts.push(user_data.emergency_contacts[i])
          this.thirdFormGroup.get(mat_card_name).setValue(user_data.emergency_contacts[i].name);
          this.thirdFormGroup.get(mat_card_number).setValue(user_data.emergency_contacts[i].number);
        }
      }
      console.log(user_data.paired_devices)
      this.user_data.public_emergency_contacts = user_data.public_emergency_contacts;
      this.paired_devices = user_data.paired_devices;
      this.changeDetection.detectChanges();
    }
  }

  triggerResize() {
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  onlyNumbersAllowed(input) {
    const charCode = input.key;
    console.log(charCode)
    if (input.key >= 0 && input.key <= 9)
      return true
    return false
  }
  getFormValidationErrors() {
    Object.keys(this.thirdFormGroup.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.thirdFormGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }
  add_Contact() {
    this.getFormValidationErrors()
    console.log(this.thirdFormGroup.hasError('required'))
    console.log(this.thirdFormGroup.getError('required'))
    if (this.countNumberContactsDone < 5 && !this.thirdFormGroup.hasError('required')) {
      this.countNumberContactsDone++;
      console.log(this.emergency_contacts)
      const app = new Emergency_Contact()
      this.emergency_contacts.push(app)
    }
    // if (this.countNumberContactsDone < 5) {
    //   if (this.countNumberContactsDone > 0) {
    //     var mat_card_number = "contact" + (this.countNumberContactsDone) + "number";
    //     var mat_card_name = "contact" + (this.countNumberContactsDone) + "name";
    //   }
    //   var go = true
    //   for (var i = 0; i < this.posNumberContacts.length; i++) {
    //     if (this.posNumberContacts[i]) {
    //       var mat_card_number = "contact" + (i) + "number";
    //       var mat_card_name = "contact" + (i) + "name";
    //       if (this.thirdFormGroup.get(mat_card_name).hasError('required') || this.thirdFormGroup.get(mat_card_number).hasError('required'))
    //         go = false;
    //     }
    //   }
    //   if (go) {
    //     this.countNumberContactsDone++;
    //     var i = 0;
    //     var stop = false
    //     while (!stop && i < 5) {
    //       if (!this.posNumberContacts[i]) {
    //         this.posNumberContacts[i] = true;
    //         var mat_card_number = "contact" + (i) + "number";
    //         var mat_card_name = "contact" + (i) + "name";
    //         this.thirdFormGroup.get(mat_card_name).setValidators(Validators.required);
    //         this.thirdFormGroup.get(mat_card_number).setValidators(Validators.required);
    //         console.log(mat_card_name + " aggiunto required")
    //         console.log(mat_card_number + " aggiunto required")
    //         this.thirdFormGroup.updateValueAndValidity();
    //         console.log('add_card')
    //         stop = true;
    //       }
    //       i++;
    //     }
    //   }
    // }
  }
  remove_contact(id) {
    this.emergency_contacts.splice(id, 1)
    this.countNumberContactsDone--;
    var mat_card_number = "contact" + (id) + "number";
    var mat_card_name = "contact" + (id) + "name";
    this.thirdFormGroup.get(mat_card_name).setValue("");
    this.thirdFormGroup.get(mat_card_number).setValue(undefined);
    // this.thirdFormGroup.get(mat_card_name).clearAsyncValidators();
    // this.thirdFormGroup.get(mat_card_number).clearAsyncValidators();
    // this.thirdFormGroup.get(mat_card_name).setErrors(null);
    // this.thirdFormGroup.get(mat_card_number).setErrors(null);
    // this.thirdFormGroup.updateValueAndValidity();
    // console.log(mat_card_name + " tolto required " + id)
    // console.log(mat_card_number + " tolto required " + id)
    // this.countNumberContactsDone--;
    // if (this.countNumberContactsDone == 0)
    //   this.thirdFormGroup.setErrors(Validators.required)
    // if (this.countNumberContactsDone == 1) {
    //   for (var i = 0; i < 5; i++) {
    //     if (this.posNumberContacts[i]) {
    //       var mat_card_number = "contact" + (i) + "number";
    //       var mat_card_name = "contact" + (i) + "name";
    //       this.thirdFormGroup.get(mat_card_name).setValidators(Validators.required);
    //       this.thirdFormGroup.get(mat_card_number).setValidators(Validators.required);
    //       this.thirdFormGroup.updateValueAndValidity();
    //       console.log(this.thirdFormGroup.get(mat_card_number).validator);
    //     }
    //   }
    // }
  }
  import_from_addressBook() {
    let options = {
      filter: '',
      hasPhoneNumber: true,
      multiple: true
    }
    this.contacts.find(['*'], options).then((contacts) => {
      //this.myContacts=contacts;
      console.log(this.myContacts);
    });
  }
  openDialog(id): void {
    const dialogRef = this.dialog.open(DialogExampleComponent, {
      width: '250px',
      data: {
        contact: { name: 'aaa', number: '1234' }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      var app = 'contact' + id + 'name';
      if (result?.name != undefined && result?.number != undefined) {
        this.thirdFormGroup.get(app).setValue(result.name)
        var app = 'contact' + id + 'number';
        this.thirdFormGroup.get(app).setValue(result.number)
      }
    });
  }
  click_next() {
    for (var i = 0; i < this.countNumberContactsDone; i++) {
      if (this.emergency_contacts[i].name === '')
        this.emergency_contacts.splice(1, i)
    }
  }
  show_tooltip() {
    this.tooltip.show();
    interval(2000).subscribe(() => { this.tooltip.hide(); })
  }
  devices: Device[];
  paired_devices: Device[];
  emergency_contacts: Emergency_Contact[] = []
  scan() {
    this.ble.scan([], 10).subscribe(
      device => this.onDeviceDiscovered(device)
    );
  }
  onDeviceDiscovered(device) {
    console.log('Discovered' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device)
      console.log(device)
    })
  }

  async pair_device(device) {
    var free_index = this.pair_device == null ? 0 : 1;
    if (this.paired_devices[free_index] != null) {
      var msg = 'You have already pair 2 smart jewelries, delete once if you want to add a new';
      for (var i = 0; i < this.pair_device.length; i++) {
        if (device.id == this.pair_device[i])
          msg = "This device has already been registred!"
      }
      const alert = await this.alertController.create({
        cssClass: '',
        header: 'Alert',
        subHeader: 'Subtitle',
        message: msg,
        buttons: ['OK']
      });

      await alert.present();
      const { role } = await alert.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
    }
    else
      this.paired_devices[free_index] = device
  }
  delete(device, index) {
    console.log('delete pos ' + index + " -> " + device.id)
    this.paired_devices.splice(index,1);
  }
  async save_data() {
    this.register_user();
    let toast = await this.toastCtrl.create({
      header: 'Data updated!',
      duration: 2000
    })
    toast.present();
  }
  register_user() {
    // this.user_data.password = bcrypt.hashSync(this.zeroFormGroup.get('password')?.value, 10);
    this.user_data.email = this.zeroFormGroup.get('email')?.value;
    this.user_data.name = this.firstFormGroup.get('name')?.value;
    this.user_data.surname = this.firstFormGroup.get('surname')?.value;
    this.user_data.phoneNumber = this.firstFormGroup.get('phoneNumber')?.value;
    this.user_data.birthdate = this.firstFormGroup.get('birthdate')?.value;
    this.user_data.gender = this.firstFormGroup.get('gender')?.value;
    this.user_data.birthdate = this.firstFormGroup.get('birthdate')?.value;
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
    this.user_data.paired_devices = this.paired_devices;
    this.shared_data.setUserData(this.user_data)
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
  public trackItem(index: number, item) {
    return item.trackId;
  }
}



class ValidatePassword {
  static ConfirmValidator(name: string, checkName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(name);
      const checkControl = controls.get(checkName);
      if (checkControl.errors && !checkControl.errors.matching) { //avoid errors when confirm password is not yet insert
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