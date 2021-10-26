import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SharedDataService } from '../../data/shared-data.service'
import * as Keycloak from 'keycloak-ionic/keycloak';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  public keycloak: Keycloak.KeycloakInstance;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private sharedData: SharedDataService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['eve.holt@reqres.in', [Validators.required, Validators.email]],
      password: ['cityslickas', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.sharedData.goHomepage()
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.error,
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }
  go_to_signup() {
    this.router.navigateByUrl('/signup');
  }
  async go_to_forgot_psw() {
    if (this.email.hasError('email'))
      this.show_toast('Insert valid email in the field');
    else if (this.email.hasError('required'))
      this.show_toast('Email field is required');
    else {
      const alert = await this.alertController.create({
        header: 'To reset your password follow the instructions sent to your email',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  async show_toast(txt) {
    let toast = this.toastCtrl.create({
      header: txt,
      duration: 2500
    })
      ; (await toast).present();
  }

  autentication() {
    if (this.keycloak == null) {
      console.log('keycloak null')
      this.keycloak = Keycloak({
        clientId: 'js-snap4city-mobile-app',
        realm: 'master',
        url: "https://www.snap4city.org/auth/"
      });
    }
    this.keycloak.init({
      onLoad: 'login-required',
      adapter:'cordova'
    }).then((autentication) => {
      console.log(autentication)
      if(autentication){
        alert("Success Auth")
        this.sharedData.goHomepage()
      }
      else
        this.keycloak.login();
    }, (err) => alert(err));

    // Test if it works, when coming back from this.keycloak.login();
    this.keycloak.onAuthSuccess = () => {
      console.log('authenticated!');
    };
  }
}
