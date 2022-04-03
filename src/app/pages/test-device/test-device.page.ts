import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SharedDataService, StorageNameType } from '../../data/shared-data.service'
import { NavigationExtras, Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-test-device',
  templateUrl: './test-device.page.html',
  styleUrls: ['./test-device.page.scss'],
})
export class TestDevicePage implements OnInit {
  StorageNameType = StorageNameType
  constructor(private translate: TranslateService,public authService: AuthenticationService,public shared_data: SharedDataService, private router: Router, public dialog: MatDialog,private changeDetection: ChangeDetectorRef) {
    if (this.shared_data.enabled_test_battery_mode.observers.length == 0)
      this.shared_data.enabled_test_battery_mode.subscribe(() => {
        $('#batteryButton').css('background-color', !this.shared_data.enabled_test_battery_mode.getValue() ? '#4472C4' : '#82b74b')
        $('#testDeviceCard').css('display', !this.shared_data.enabled_test_battery_mode.getValue() ? 'none' : 'flex')
      })
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    console.log('ngDestroyTestDevice')
    if (this.shared_data.enabled_test_battery_mode.getValue())
      this.shared_data.enabled_test_battery_mode.next(false);
  }
  go_to_deviceSettings() {
    var param: NavigationExtras = {
      state: {
        page: 4
      }
    }
    this.router.navigate(['/profile/menu/profile'], param)
  }
  testBattery() {
    if(this.shared_data.user_data.paired_devices.length>0)
      this.shared_data.enabled_test_battery_mode.next(!this.shared_data.enabled_test_battery_mode.getValue())
    else
      this.shared_data.createToast(this.translate.instant('ALERT.no_device_paired'),4500)
  }

}