import { Component, OnInit } from '@angular/core';
import { SharedDataService, UserData } from '../../data/shared-data.service'
import { Router } from '@angular/router'
import { BluetoothService } from 'src/app/data/bluetooth.service';
@Component({
  selector: 'app-test-device',
  templateUrl: './test-device.page.html',
  styleUrls: ['./test-device.page.scss'],
})
export class TestDevicePage implements OnInit {
  
  constructor(public shared_data: SharedDataService, private router: Router,private bluetoothService:BluetoothService) {
  }
  ngOnInit() {
  }
  go_to_deviceSettings() {
    this.router.navigateByUrl('/profile/menu/profile', { replaceUrl: true, state: { page: 5 } })
  }
  isBeaconInRegion(index){
    this.bluetoothService.checkRangeBeaconsInRegion(index);
  }
}
