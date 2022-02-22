import { Component, OnInit } from '@angular/core';
import { SharedDataService, UserData } from '../../data/shared-data.service'
import { NavigationExtras, Router } from '@angular/router'
import { BluetoothService } from 'src/app/data/bluetooth.service';
@Component({
  selector: 'app-test-device',
  templateUrl: './test-device.page.html',
  styleUrls: ['./test-device.page.scss'],
})
export class TestDevicePage implements OnInit {

  constructor(public shared_data: SharedDataService, private router: Router, private bluetoothService: BluetoothService) {
  }
  ngOnInit() {
  }
  go_to_deviceSettings() {

    var param: NavigationExtras = {
      state: {
        page: 4
      }
    }
    this.router.navigate(['/profile/menu/profile'], param)
  }
  isBeaconInRegion(index) {
    this.bluetoothService.checkRangeBeaconsInRegion(index);
  }
}
