import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { Platform } from '@ionic/angular';
import { SharedDataService } from '../app/data/shared-data.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  count_emergency_click = 0;
  constructor() {
    /* if logged enbale bluetooth */
  }
}
