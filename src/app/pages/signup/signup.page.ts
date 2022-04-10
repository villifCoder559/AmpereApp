import { Component, OnInit, ChangeDetectorRef, Input, ElementRef, Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors, ValidatorFn, FormControl } from '@angular/forms';
import { MatStep, MatStepper, MatStepperIntl, StepperOrientation } from '@angular/material/stepper';
import { interval, Observable, timer } from 'rxjs';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgZone, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import * as bcrypt from 'bcryptjs';
import { AlertController, AngularDelegate, IonContent, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService, UserData, Emergency_Contact, typeChecking, DeviceType, StorageNameType } from '../../data/shared-data.service'
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import * as moment from 'moment';
import { DialogScanBluetoothComponent } from './dialog-scan-bluetooth/dialog-scan-bluetooth.component';
import { NGSIv2QUERYService } from '../../data/ngsiv2-query.service'
import { BluetoothService } from '../../data/bluetooth.service'
import { Snap4CityService } from '../../data/snap4-city.service'
import { AuthenticationService } from '../../services/authentication.service'
import { DialogAddEmergencyContactComponent } from './dialog-add-emergency-contact/dialog-add-emergency-contact.component';
import { DialogSaveComponent } from './dialog-save/dialog-save.component';
import { DialogModifyNameComponent } from './dialog-modify-name/dialog-modify-name.component';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { TranslateService } from '@ngx-translate/core';
import { v4 as uuidv4 } from 'uuid';
import { SendAuthService } from 'src/app/data/send-auth.service';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { LanguageService } from 'src/app/data/language.service';
declare var window;
@Injectable()
export class StepperIntl extends MatStepperIntl {
  // the default optional label text, if unspecified is "Optional
  optionalLabel = 'OPTIONAL';
}


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  providers: [{ provide: MatStepperIntl, useClass: StepperIntl }],
})
export class SignupPage implements OnInit {
  StorageNameType = StorageNameType
  hide;
  hideold;
  hidepsw;
  countNumberContactsDone = 0;
  psw_editable = false;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild('tooltip_pin') tooltip_pin: MatTooltip;
  @ViewChild('tooltip_allergies') tooltip_allergies: MatTooltip;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('content') content: IonContent;

  //add native-langauage field
  //fix dimension when resize the screen
  firstFormGroup = this._formBuilder.group({
    name: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator])],
    surname: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator])],
    nickname: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator])],
    //email: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator, Validators.email])],
    phoneNumber: ['', Validators.compose([SpecialCharValidator.specialCharValidator, Validators.required, Validators.pattern("^[0-9]*$")])],
    dateofborn: ['', Validators.compose([SpecialCharValidator.specialCharValidator, DateValidator.dateVaidator])],
    gender: [''],
    language: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator])],
    address: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator])],
    locality: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator])],
    city: ['', Validators.compose([Validators.required, SpecialCharValidator.specialCharValidator])],
    height: ['', Validators.compose([Validators.maxLength(3), Validators.pattern("^[0-9]*$")])],
    weight: ['', Validators.compose([Validators.maxLength(3), Validators.pattern("^[0-9]*$")])],
    ethnicity: [''],
    description: ['', Validators.compose([Validators.maxLength(200), SpecialCharValidator.specialCharValidator])],
    purpose: ['', Validators.compose([Validators.maxLength(200), SpecialCharValidator.specialCharValidator])],
    pin: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(4), Validators.pattern("^[0-9]*$")])]
  });
  secondFormGroup = this._formBuilder.group({
    allergies: ['', Validators.compose([Validators.required, Validators.maxLength(200), SpecialCharValidator.specialCharValidator])],
    medications: ['', Validators.compose([Validators.maxLength(200), SpecialCharValidator.specialCharValidator])],
    visionImpaired: false,
    wheelchairUser: false
  });
  fourthFormGroup = this._formBuilder.group({
    call_112: [null, Validators.required],
    call_115: [null, Validators.required],
    call_118: [null, Validators.required]
  });
  readonly arrayFormGroup = [this.firstFormGroup, this.secondFormGroup, this.fourthFormGroup]
  constructor(private languageService: LanguageService, private nativeGeocoder: NativeGeocoder, private _matStepperIntl: MatStepperIntl, public endAuth: SendAuthService, private translate: TranslateService, public authService: AuthenticationService, private geoLocation: Geolocation, private snap4CityService: Snap4CityService, private bluetoothService: BluetoothService, public NGSIv2QUERY: NGSIv2QUERYService, public http: HttpClient, private router: Router, public dialog: MatDialog, private _formBuilder: FormBuilder, public shared_data: SharedDataService, private changeDetection: ChangeDetectorRef) {
    console.log('From signup')
    console.log(this.shared_data.user_data)
  }
  findErrorsAllFormsGroup() {
    console.log(this.arrayFormGroup.length)
    if (this.shared_data.user_data.emergency_contacts.length > 0) {
      var error = false;
      for (var i = 0; i < this.arrayFormGroup.length && !error; i++) {
        var result = this.getFormValidationErrors(this.arrayFormGroup[i]);
        if (result.length != 0) {
          return i + 1;
        }
      }
      return error;
    }
    else
      return 5;
  }
  setDefaultNativeLanguage(){
    let lng = this.languageService.selected_language.text;
    if (lng != 'Italiano' && lng != 'English')
      lng = "Others"
    console.log(lng)
    this.firstFormGroup.get('language').setValue(lng);
  }
  readPhoneNumber(){
    
  }
  ngOnInit() {
    this._matStepperIntl.optionalLabel = this.translate.instant('SIGNUP.form.optional')
    console.log(this.shared_data.user_data.email)
    if (this.authService.isAuthenticated.getValue()) {
      var index = this.router.getCurrentNavigation().extras?.state?.page;
      if (index !== undefined) {
        setTimeout(() => {
          this.stepper.selectedIndex = index;
          this.stepper.animationDone.subscribe(() => {
            this.content.scrollToBottom(500)
          })
        }, 350);
      }
      this.shared_data.presentLoading(this.translate.instant('ALERT.retrive_info')).then(() => {
        this.NGSIv2QUERY.getEntity('ampereuser' + this.shared_data.user_data.uuid + DeviceType.PROFILE, DeviceType.PROFILE).then((data: any) => {
          this.authService.isAuthenticated.next(true);
          this.shared_data.user_data.paired_devices = [];
          this.shared_data.user_data.qr_code = [];
          this.shared_data.user_data.nfc_code = [];
          this.shared_data.user_data.emergency_contacts = [];
          this.shared_data.setUserValueFromData(data)
          console.log(this.shared_data.user_data)
          this.setFormGroupFromUser();
          Object.keys(this.shared_data.localStorage).forEach((element: StorageNameType) => {
            this.shared_data.getNameDevices(element);
          })
          this.changeDetection.detectChanges();
          this.shared_data.dismissLoading();
        }, err => {
          this.shared_data.dismissLoading();
          this.shared_data.createToast(this.translate.instant('ALERT.retrive_information'))
          this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
        })
      })
    }
    else {
      //alert(this.translate.instant('ALERT.permission_creating_device'));
      this.setDefaultNativeLanguage();
      // window.plugins.sim.hasReadPermission((permission => {
      //   if (!permission)
      //     window.plugins.sim.requestReadPermission(() => {
      //       window.plugins.sim.getSimInfo((info) => {
      //         console.log(info)
      //         this.firstFormGroup.get('phoneNumber').setValue(info.phoneNumber);
      //       }, (err) => console.log(err));
      //     }, (err) => { console.log(err) });
      //   else
      //     window.plugins.sim.getSimInfo((info) => {
      //       console.log(info)
      //       this.firstFormGroup.get('phoneNumber').setValue(info.phoneNumber);
      //     }, (err) => console.log(err));
      // }), (err) => console.log(err))
      this.shared_data.checkLocationEnabled().then(() => {
        this.getPosition().then((position) => {
          if (position != [])
            this.nativeGeocoder.reverseGeocode(position[0], position[1], { maxResults: 1, useLocale: true })
              .then((result: NativeGeocoderResult[]) => {
                // this.firstFormGroup.controls['locality'].setValue(result[0].locality);
                // this.firstFormGroup.controls['locality'].setValue(result[0].locality);
                console.log(JSON.stringify(result[0]))
              })
              .catch((error: any) => console.log(error));
        })
      }, err => console.log(err))
    }
  }
  checkDate(ev) {
    console.log(ev)
    //if(backspace) delete 2 chars
    if (ev.inputType != 'deleteContentBackward') {
      var value: string = ev.target.value;
      var split = value.split('-');
      var year = (split[0]);
      var month = (split[1]);
      var day = (split[2]);
      var date: string = '';
      if (value.length > 3) {
        date = year + '-'
        if (!isNaN(parseInt(month))) {
          if (month.length < 2)
            if (parseInt(month) > 1)
              date += '0' + month + '-';
            else {
              date += month
              console.log(date)
            }
          else
            date += month + '-'
        }
        if (!isNaN(parseInt(day))) {
          if (day.toString().length < 2)
            if (parseInt(day) > 3)
              date += '0' + day
            else
              date += day
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
    this.changeDetection.detectChanges();
    if (this.authService.isAuthenticated.getValue()) {
      this.shared_data.presentLoading(this.translate.instant('ALERT.send_data')).then(() => {
        this.NGSIv2QUERY.sendUserProfile().then(() => {
          this.shared_data.dismissLoading();
          this.shared_data.old_user_data.copyFrom(this.shared_data.user_data)
          this.shared_data.createToast(this.translate.instant('ALERT.data_success'))
        }, err => {
          this.shared_data.dismissLoading();
          this.shared_data.user_data.copyFrom(this.shared_data.old_user_data)
          this.shared_data.createToast(this.translate.instant('ALERT.error') + err + '. ' + this.translate.instant('ALERT.data_fail'));
        });
      })
    }
  }
  openDialogEmergencyContact(value, index): void {
    var ok = true;
    console.log('pass');
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
        console.log(result)
        if (result != undefined) {
          //console.log(result);
          console.log(result.index == -1)
          if (result.index == -1) //new element
            this.shared_data.user_data.emergency_contacts.push(new Emergency_Contact(result.data.name, result.data.surname, result.data.number))
          else //old element modified
            this.shared_data.user_data.emergency_contacts[result.index] = new Emergency_Contact(result.data.name, result.data.surname, result.data.number);
          this.changeDetection.detectChanges()
          console.log(this.shared_data.user_data.emergency_contacts)
          if (this.authService.isAuthenticated.getValue())
            this.saveUserProfile().then(() => {
              this.shared_data.createToast(this.translate.instant('ALERT.data_success'))
            }, err => {
              console.log(err)
              this.shared_data.createToast(this.translate.instant('ALERT.data_fail'))
            })
        }
      });
    }
    else
      this.shared_data.createToast(this.translate.instant('ALERT.limit_upper_contacts'))
  }
  saveUserProfile() {
    return new Promise((resolve, reject) => {
      this.shared_data.presentLoading(this.translate.instant('ALERT.update_data')).then(() => {
        this.NGSIv2QUERY.sendUserProfile().then(() => {
          this.shared_data.old_user_data.copyFrom(this.shared_data.user_data)
          this.shared_data.dismissLoading();
          resolve(true)
        }, err => {
          this.shared_data.user_data.copyFrom(this.shared_data.old_user_data)
          this.shared_data.dismissLoading();
          reject(err)
        })
      })
    })

  }
  click_next() {
    console.log(this.shared_data.user_data.emergency_contacts.length)
    if (this.shared_data.user_data.emergency_contacts.length > 0)
      this.stepper.next()
    else
      this.shared_data.createToast(this.translate.instant('ALERT.limit_lower_contacts'));
  }
  show_tooltip(name) {
    var tooltip = this.tooltip_pin;
    console.log(name == 'pin')
    if (name == 'pin')
      tooltip = this.tooltip_pin;
    else
      tooltip = this.tooltip_allergies;
    tooltip.show();
    interval(4000).subscribe(() => { tooltip.hide(); })
  }
  getUserFromFormGroup() {
    var error = this.findErrorsAllFormsGroup()
    if (!error)
      Object.keys(this.shared_data.user_data).forEach((element) => {
        console.log(element)
        switch (element) {
          case 'uuid': case 'email': case 'dateObserved': case 'paired_devices': case 'emergency_contacts': case 'nfc_code': case 'qr_code': case 'status':
            break;
          case 'allergies': case 'medications': {
            this.shared_data.user_data[element] = this.secondFormGroup.get(element)?.value;
            break
          }
          case 'public_emergency_contacts': {
            Object.keys(this.shared_data.user_data[element]).forEach((number) => {
              console.log(typeof (number))
              console.log(this.shared_data.user_data[element][number])
              this.shared_data.user_data[element][number] = this.fourthFormGroup.get(number)?.value;
            })
            break;
          }
          case 'disabilities': {
            console.log('DISABILITIES')
            Object.keys(this.shared_data.user_data[element]).forEach((dis) => {
              this.shared_data.user_data[element][dis] = this.secondFormGroup.get(dis)?.value
            })
            break;
          }
          default:
            if (this.shared_data.user_data[element] === 'phoneNumber') {
              console.log(this.shared_data.user_data[element])
              console.log(typeof (this.shared_data.user_data[element]))
            }
            this.shared_data.user_data[element] = this.firstFormGroup.get(element)?.value
        }
      })
    else
      if (error == 5)
        this.shared_data.createToast(this.translate.instant('ALERT.limit_lower_contacts'))
      else
        this.shared_data.createToast(this.translate.instant('ALERT.error_step') + (error));
    return error
  }
  setFormGroupFromUser() {
    console.log('FormGroupFromUser')
    Object.keys(this.shared_data.user_data).forEach((element) => {
      switch (element) {
        case 'uuid': case 'email': case 'dateObserved': case 'emergency_contacts': case 'paired_devices': case 'qr_code': case 'nfc_code': case 'status':
          break;
        case 'allergies': case 'medications': {
          this.secondFormGroup.get(element).setValue(this.shared_data.user_data[element])
          break
        }
        case 'public_emergency_contacts': {
          Object.keys(this.shared_data.user_data[element]).forEach((number) => {
            this.fourthFormGroup.get(number).setValue(this.shared_data.user_data[element][number]);
            console.log(this.shared_data.user_data[element][number])
            console.log(number)
            console.log(this.fourthFormGroup.get(number).value)
          })
          break;
        }
        case 'disabilities': {
          Object.keys(this.shared_data.user_data[element]).forEach((dis) => {
            console.log(dis)
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
    var error = this.getUserFromFormGroup();
    if (!error) {
      this.shared_data.presentLoading(this.translate.instant('ALERT.update_data')).then(() => {
        this.NGSIv2QUERY.sendUserProfile().then((value) => {
          this.shared_data.old_user_data.copyFrom(this.shared_data.user_data)
          this.shared_data.dismissLoading();
          this.shared_data.createToast(this.translate.instant('ALERT.data_success'));
        }, (err) => {
          this.shared_data.user_data.copyFrom(this.shared_data.old_user_data)
          this.setFormGroupFromUser();
          this.changeDetection.detectChanges();
          this.shared_data.dismissLoading();
          this.shared_data.createToast(this.translate.instant('ALERT.error') + err + '. ' + this.translate.instant('ALERT.data_fail'))
        })
      })
    }
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
  getPosition() {
    /**{"latitude":43.7992279,"longitude":11.2432775,"countryCode":"IT","countryName":"Italia","postalCode":"50134"
 * ,"administrativeArea":"Toscana",
 * "subAdministrativeArea":"Città Metropolitana di Firenze","locality":"Firenze",
 * "subLocality":"",
 * "thoroughfare":"Viale Giovanni Battista Morgagni","subThoroughfare":"150","areasOfInterest":["33"]} */
    return new Promise((resolve) => {
      this.geoLocation.getCurrentPosition({ timeout: 7000 }).then((position) => {
        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
        this.nativeGeocoder.reverseGeocode(this.lat, this.lon, { maxResults: 1, useLocale: true })
          .then((result: NativeGeocoderResult[]) => {
            console.log(JSON.stringify(result[0]))
            this.firstFormGroup.get('city').setValue(result[0].locality);
            this.firstFormGroup.get('address').setValue(result[0].thoroughfare + ' ' + result[0].subThoroughfare);
            this.firstFormGroup.get('locality').setValue(result[0].administrativeArea);
            resolve([position.coords.latitude, position.coords.longitude])
          })
          .catch((error: any) => console.log(error));
      }, err => { console.log(err); resolve([]) })
    })
  }
  lat = 43.7;
  lon = 11.2;

  register_user() {
    var error = this.getUserFromFormGroup();
    if (!error) {
      this.shared_data.user_data.uuid = uuidv4();
      this.shared_data.presentLoading(this.translate.instant('ALERT.create_device') + '1/3').then(() => {
        this.snap4CityService.createDevice(DeviceType.PROFILE, this.lat, this.lon).then(() => {
          this.shared_data.setTextLoading(this.translate.instant('ALERT.create_device') + '2/3')
          this.snap4CityService.createDevice(DeviceType.ALERT_EVENT, this.lat, this.lon).then(() => {
            this.shared_data.setTextLoading(this.translate.instant('ALERT.create_device') + '3/3')
            this.snap4CityService.createDevice(DeviceType.QR_NFC_EVENT, this.lat, this.lon).then(() => {
              this.shared_data.setTextLoading(this.translate.instant('ALERT.storing_data'))
              this.NGSIv2QUERY.sendUserProfile().then(() => {
                this.shared_data.dismissLoading();
                this.shared_data.createToast(this.translate.instant('ALERT.data_success'))
                this.authService.isAuthenticated.next(true);
                this.bluetoothService.enableAllBeaconFromSnap4City();
                this.shared_data.old_user_data.copyFrom(this.shared_data.user_data)
                this.router.navigateByUrl('profile/menu/homepage', { replaceUrl: true })
              }, err => {
                alert(this.translate.instant('ALERT.error') + err.msg);
                this.shared_data.setTextLoading(this.translate.instant('ALERT.deleting_device') + ' 1/3')
                // this.snap4CityService.deleteDevice(DeviceType.PROFILE).catch((err)=>console.log(err))
                // this.snap4CityService.deleteDevice(DeviceType.ALERT_EVENT).catch((err)=>console.log(err))
                // this.snap4CityService.deleteDevice(DeviceType.QR_NFC_EVENT).catch((err)=>console.log(err))
                this.snap4CityService.deleteDevice(DeviceType.PROFILE).then(() => {
                  this.shared_data.setTextLoading(this.translate.instant('ALERT.deleting_device') + ' 2/3')
                  this.snap4CityService.deleteDevice(DeviceType.ALERT_EVENT).then(() => {
                    this.shared_data.setTextLoading(this.translate.instant('ALERT.deleting_device') + ' 3/3')
                    this.snap4CityService.deleteDevice(DeviceType.QR_NFC_EVENT).then(() => {
                      this.shared_data.dismissLoading();
                    }, err => { alert('ERROR_DELETING_QRNFCEVENT. ' + err.msg); this.shared_data.dismissLoading() })
                  }, err => { alert('ERROR_DELETING_ALERTEVENT. ' + err.msg); this.shared_data.dismissLoading() })
                }, err => { alert('ERROR_DELETING_PROFILE. ' + err.msg); this.shared_data.dismissLoading() })
              })
            }, err => {
              alert(this.translate.instant('ALERT.error') + err.msg);
              this.shared_data.setTextLoading(this.translate.instant('ALERT.deleting_device') + ' 1/2')
              this.snap4CityService.deleteDevice(DeviceType.PROFILE).then(() => {
                this.shared_data.setTextLoading(this.translate.instant('ALERT.deleting_device') + ' 2/2')
                this.snap4CityService.deleteDevice(DeviceType.ALERT_EVENT).then(() => {
                  this.shared_data.dismissLoading();
                }, err => { alert('ERROR_DELETING_ALERTEVENT. ' + err.msg); this.shared_data.dismissLoading() })
              }, err => { alert('ERROR_DELETING_PROFILE. ' + err.msg); this.shared_data.dismissLoading() })
            })
          }, (err) => {
            alert(this.translate.instant('ALERT.error') + err.msg);
            this.shared_data.setTextLoading(this.translate.instant('ALERT.deleting_device') + ' 1/1')
            this.snap4CityService.deleteDevice(DeviceType.PROFILE).then(() => {
              this.shared_data.dismissLoading();
            }, err => { alert('ERROR_DELETING_PROFILE. ' + err.msg); this.shared_data.dismissLoading() })
            this.shared_data.dismissLoading();
          })
        }, err => {
          this.shared_data.dismissLoading();
          alert(this.translate.instant('ALERT.registration.error') + err.msg);
        })
      })
    }
  }
  go_back() {
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
  askSave() {
    var error = this.getUserFromFormGroup();
    console.log('ASK_SAVE_USER')
    console.log(this.shared_data.user_data)
    console.log('ASK_SAVE_OLD')
    console.log(this.shared_data.old_user_data)
    if (!error) {
      if (!this.shared_data.user_data.isEqualTo(this.shared_data.old_user_data)) {
        const dialog = this.dialog.open(DialogSaveComponent, {
          maxWidth: '90vw',
          minWidth: '40vw'
        })
        dialog.afterClosed().subscribe(result => {
          console.log(result)
          if (result !== undefined) {
            if (result.value == 'yes')
              this.saveUserProfile().then(() => {
                this.shared_data.createToast(this.translate.instant('ALERT.data_success'))
              }, err => {
                console.log(err)
                this.shared_data.createToast(this.translate.instant('ALERT.data_fail'))
              })
            else {
              this.shared_data.user_data.copyFrom(this.shared_data.old_user_data)
              console.log('USER_DATA_AFTER_COPY')
              console.log(this.shared_data.user_data)
              console.log('OLD_USER_DATA')
              console.log(this.shared_data.old_user_data)
            }
          }
          this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })
        })
      }
      else
        this.router.navigateByUrl('/profile/menu/homepage', { replaceUrl: true })

    }
  }
  modifyNameDevice(i) {
    const dialogRef = this.dialog.open(DialogModifyNameComponent, {
      maxWidth: '90vw',
      minWidth: '40vw',
      panelClass: 'custom-dialog-container',
      data: {
        id: this.shared_data.user_data.paired_devices[i],
        name: '',
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.shared_data.setNameDevice(result.value.id, StorageNameType.DEVICES, result.value.name);
      const slidingItem = document.getElementById('slidingItem' + i) as any;
      slidingItem.close();
      this.changeDetection.detectChanges();
    });
  }
  delete(device, index) {
    console.log('delete pos ' + index + " -> " + device.uuid)
    var a = $('#device' + index).hide(400, () => {
      //var data_to_send = this.NGSIv2QUERY.getEmergencyContactsToSend(newContacts);
      var el_deleted = this.shared_data.user_data.paired_devices.splice(index, 1);
      this.shared_data.deleteRememberTestNotification(el_deleted);
      this.changeDetection.detectChanges()
      console.log(this.shared_data.user_data.paired_devices)
      //this.bluetoothservice.disableRegion(deviceDeleted)
      if (this.authService.isAuthenticated.getValue())
        this.NGSIv2QUERY.sendUserProfile().then(() => {
          this.shared_data.deleteDeviceFromLocalStorage(el_deleted, StorageNameType.DEVICES);
          this.shared_data.old_user_data.copyFrom(this.shared_data.user_data)
          this.shared_data.createToast(this.translate.instant('ALERT.data_success'))
        }, err => {
          console.log(err)
          this.shared_data.createToast(this.translate.instant('ALERT.data_fail'))
          this.shared_data.user_data.copyFrom(this.shared_data.old_user_data)
          this.changeDetection.detectChanges()
        })
    })
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
        if (result != '' && result != undefined)
          this.addPairedDeviceANDregister(result);
      }, err => (console.log(err)));
    }
    else
      this.shared_data.createToast(this.translate.instant('ALERT.already_paired'));
  };
  addPairedDeviceANDregister(device) {
    var indexOf = this.shared_data.user_data.paired_devices.indexOf(device);
    this.shared_data.user_data.paired_devices.push(device);
    console.log(this.shared_data.user_data.paired_devices.length)
    if (indexOf == -1) {
      this.shared_data.setRememberTestNotification(device)
      this.shared_data.presentLoading(this.translate.instant('ALERT.update_data')).then(() => {
        if (this.authService.isAuthenticated.getValue())
          this.NGSIv2QUERY.sendUserProfile().then(() => {
            console.log('SetNAmeDevice')
            this.shared_data.dismissLoading();
            this.shared_data.setNameDevice(device, device);
            console.log('Set old data')
            this.shared_data.old_user_data.copyFrom(this.shared_data.user_data)
            this.shared_data.enableAllBackgroundMode()
            this.shared_data.createToast(this.translate.instant('ALERT.data_success'))
          }, err => {
            console.log(err)
            this.shared_data.dismissLoading();
            this.shared_data.user_data.paired_devices.pop();
            this.shared_data.createToast(this.translate.instant('ALERT.data_fail'))
          })
      })
    }
    else
      alert(this.translate.instant('ALERT.device_connected_err'))
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