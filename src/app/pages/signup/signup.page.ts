import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
/*TODO List:
  1)Enable scroll page OK
  2)Fix validator foreach textarea OK
  3)Import contact from contacts of device TEST OK
  3.1)Improve html of Contacts tab 
  4)Make the connection device page
*/

export interface DialogData {
  number: string;
  name: string;
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  posNumberContacts = [false, false, false, false, false];
  countNumberContactsDone = 0;
  name;
  number;
  data = {
    name: '',
    number: ''
  }
  user_data = {
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    birthdate: '',
    gender: '',
    address: '',
    locality: '',
    city: '',
    height: '',
    weight: '',
    etnicity: '',
    description: '',
    purpose: '',
    pin: '',
    allergies: '',
    medications: ''
  }
  constructor(public dialog: MatDialog, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver, private ngZone: NgZone, private contacts: Contacts) {
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({ matches }) => matches ? 'horizontal' : 'vertical'));
  }
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  required = Validators.required;
  @ViewChild('tooltip') tooltip: MatTooltip;
  firstFormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', Validators.email],
    phoneNumber: ['', Validators.required],
    password: ['', Validators.required],
    confirm_psw: ['', Validators.required],
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
    contact0name: ['', Validators.required],
    contact0number: ['', Validators.required],
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
  ngOnInit() {
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
  add_Contact() {
    if (this.countNumberContactsDone < 5) {
      if (this.countNumberContactsDone > 0) {
        var mat_card_number = "contact" + (this.countNumberContactsDone) + "number";
        var mat_card_name = "contact" + (this.countNumberContactsDone) + "name";
      }
      var go = true
      for (var i = 0; i < this.posNumberContacts.length; i++) {
        if (this.posNumberContacts[i]) {
          var mat_card_number = "contact" + (i) + "number";
          var mat_card_name = "contact" + (i) + "name";
          if (this.thirdFormGroup.get(mat_card_name).hasError('required') || this.thirdFormGroup.get(mat_card_number).hasError('required'))
            go = false;
        }
      }
      if (go) {
        this.countNumberContactsDone++;
        var i = 0;
        var stop = false
        while (!stop && i < 5) {
          if (!this.posNumberContacts[i]) {
            this.posNumberContacts[i] = true;
            var mat_card_number = "contact" + (i) + "number";
            var mat_card_name = "contact" + (i) + "name";
            this.thirdFormGroup.get(mat_card_name).setValidators(Validators.required);
            this.thirdFormGroup.get(mat_card_number).setValidators(Validators.required);
            console.log(mat_card_name + " aggiunto required")
            console.log(mat_card_number + " aggiunto required")
            this.thirdFormGroup.updateValueAndValidity();
            console.log('add_card')
            stop = true;
          }
          i++;
        }
      }
    }
  }
  remove_contact(id) {
    this.posNumberContacts[id] = false;
    var mat_card_number = "contact" + (id) + "number";
    var mat_card_name = "contact" + (id) + "name";
    this.thirdFormGroup.get(mat_card_name).setValue("");
    this.thirdFormGroup.get(mat_card_number).setValue(undefined);
    this.thirdFormGroup.get(mat_card_name).clearAsyncValidators();
    this.thirdFormGroup.get(mat_card_number).clearAsyncValidators();
    this.thirdFormGroup.get(mat_card_name).setErrors(null);
    this.thirdFormGroup.get(mat_card_number).setErrors(null);
    this.thirdFormGroup.updateValueAndValidity();
    console.log(mat_card_name + " tolto required " + id)
    console.log(mat_card_number + " tolto required " + id)
    this.countNumberContactsDone--;
    if (this.countNumberContactsDone == 0)
      this.thirdFormGroup.setErrors(Validators.required)
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
      this.thirdFormGroup.get(app).setValue(result.name)
      var app = 'contact' + id + 'number';
      this.thirdFormGroup.get(app).setValue(result.number)
    });
  }
  click_next() {
    for (var i = 0; i < 5; i++) {
      var name = 'contact' + i + 'name';
      var number = 'contact' + i + 'number';
      if (this.thirdFormGroup.get(name).hasError('required') || this.thirdFormGroup.get(number).hasError('required')) {
        console.log(this.thirdFormGroup.get(name).hasError('required'))
        console.log(i)
      }
    }
  }
  show_tooltip() {
    this.tooltip.show();
    interval(2000).subscribe(() => { this.tooltip.hide(); })
  }
}
