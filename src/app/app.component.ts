import { Component } from '@angular/core';
import { Pipe, PipeTransform} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { LottieSplashScreen } from '@awesome-cordova-plugins/lottie-splash-screen/ngx';
import { Platform } from '@ionic/angular';

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
  constructor(private platform:Platform,private lottieSplashScreen:LottieSplashScreen) {
  }

}
