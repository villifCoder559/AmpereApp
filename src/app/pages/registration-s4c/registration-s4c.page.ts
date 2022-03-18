import { Component, OnInit } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { SpecialCharValidator } from '../signup/signup.page';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx'
import { Router } from '@angular/router';
import { SharedDataService } from '../../data/shared-data.service'
@Component({
  selector: 'app-registration-s4c',
  templateUrl: './registration-s4c.page.html',
  styleUrls: ['./registration-s4c.page.scss'],
})
export class RegistrationS4cPage implements OnInit {

  registrationGroup = this._formBuilder.group({
    name: ['', Validators.compose([SpecialCharValidator.specialCharValidator])],
    email: ['', Validators.email]
  })
  list_checkbox = {
    termsOfUseCheckbox: false,
    privacyPolicyCheckbox: false,
    cookiesPolicyCheckbox: false
  }
  constructor(private sharedData: SharedDataService, private _formBuilder: FormBuilder, private inAppBrowser: InAppBrowser, private router: Router) { }

  ngOnInit() {
  }
  validCheckBox() {
    var ok = true;
    Object.keys(this.list_checkbox).forEach(element => {
      if (!this.list_checkbox[element])
        ok = false;
    })
    return ok;
  }
  validForm() {
    var ok = true;
    Object.keys(this.registrationGroup.controls).forEach(element => {
      console.log(element)
      const controlErrors:ValidationErrors=this.registrationGroup.get(element).errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach((key) => {
          console.log(element+' '+key+' '+controlErrors[key])
          if (controlErrors[key])
            ok = false;
        })
      }
    })
    return ok;
  }
  sendRegistration() {
    var checkbox = this.validCheckBox();
    console.log(checkbox)
    var form = this.validForm();
    console.log(form)
    if (checkbox && form)
    this.sharedData.presentLoading('Asking for registration').then(()=>{
      $.ajax({
        url: "https://www.snap4city.org/drupal/api/user/register",
        method: "POST",
        async: true,
        contentType: "application/json",
        timeout: 3000,
        data: JSON.stringify({
          "name": this.registrationGroup.get('name').value,
          "mail": this.registrationGroup.get('email').value,
          "legal_accept": "true",
          "extras-1": "true",
          "extras-2": "true",
          "og_user_node": {
            "und": [{
              "default": 765 //AMPERE
            }]
          }
        }),
        success: (data) => {
          alert('Check your email with your credentials')
          this.sharedData.createToast('Successfully registred')
          console.log('SUCCESS_REGISTATION')
          this.router.navigateByUrl('/login', { replaceUrl: true })
          console.log(data);
        },
        error: (err) => {
          this.sharedData.createToast('Error in registration')
          console.log('ERROR_REGISTRATION')
          console.log(err)
        },
        complete:()=>{
          this.sharedData.dismissLoading();
        }
      });
    })
    else {
      var txt = '';
      if (!checkbox)
        txt = ('You must accept all policy to sign-up ')
      if (!form) {
        var app = 'Insert valid name and email'
        if (txt !== '')
          txt += ' and ' + app.toLowerCase();
        else
          txt = app;
      }
      this.sharedData.createToast(txt);
    }
  }
  openPage(url) {
    this.inAppBrowser.create(url, '_blank', { location: 'yes', hideurlbar: 'yes' })
  }

}
