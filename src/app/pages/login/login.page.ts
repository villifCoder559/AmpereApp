import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SharedDataService } from '../../data/shared-data.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private sharedData:SharedDataService,
    private toastCtrl:ToastController
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
  go_to_signup(){
    this.router.navigateByUrl('/signup');
  }
  async go_to_forgot_psw(){
    if( this.email.hasError('email'))
      this.show_toast('Insert valid email in the field');
    else if(this.email.hasError('required'))
        this.show_toast('Email field is required');
        else{
          const alert = await this.alertController.create({
            header: 'To reset your password follow the instructions sent to your email',
            buttons: ['OK'],
          });
          await alert.present();
        }
  }
  async show_toast(txt){
    let toast = this.toastCtrl.create({
      header: txt,
      duration: 2500
    })
    ;(await toast).present();
  }
}
