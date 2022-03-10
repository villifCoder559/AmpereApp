import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedDataService, StorageNameType } from '../../data/shared-data.service'
import { NavigationExtras, Router } from '@angular/router'
@Component({
  selector: 'app-test-device',
  templateUrl: './test-device.page.html',
  styleUrls: ['./test-device.page.scss'],
})
export class TestDevicePage implements OnInit {
  StorageNameType = StorageNameType
  constructor(public shared_data: SharedDataService, private router: Router) {
    if (this.shared_data.enabled_test_battery_mode.observers.length == 0)
      this.shared_data.enabled_test_battery_mode.subscribe(() => {
        $('#batteryButton').css('background-color', !this.shared_data.enabled_test_battery_mode.getValue() ? '#fff' : '#82b74b')
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
    this.shared_data.enabled_test_battery_mode.next(!this.shared_data.enabled_test_battery_mode.getValue())
  }
}