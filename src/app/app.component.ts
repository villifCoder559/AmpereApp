import { Component } from '@angular/core';
import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { LottieSplashScreen } from '@awesome-cordova-plugins/lottie-splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { LanguageService } from './data/language.service';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private lottieSplashScreen:LottieSplashScreen,private plt: Platform, private language: LanguageService, private router: Router) {
    this.initializeApp().then(()=>console.log('EndInit'))
  }
  initializeApp() {
    return new Promise((resolve) => {
      this.plt.ready().then(() => {
        this.language.setInitialAppLanguage().then(() => {
         // this.router.navigateByUrl('/login').then(() => {
            this.lottieSplashScreen.hide();
            resolve(true)
        //  })
        });
      })
    })
  }
}
