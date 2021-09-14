import { Component, OnInit } from '@angular/core';
import { SharedDataService, UserData } from '../../data/shared-data.service'
import { Router } from '@angular/router'
@Component({
  selector: 'app-test-device',
  templateUrl: './test-device.page.html',
  styleUrls: ['./test-device.page.scss'],
})
export class TestDevicePage implements OnInit {
  paired_devices: any;
  constructor(private shared_data: SharedDataService, private router: Router) {
    var user_data: UserData = this.shared_data.getUserData();
    this.paired_devices = user_data.paired_devices;
    console.log(this.paired_devices)
  }
  delete(device, index) {
    console.log('delete pos ' + index + " -> " + device.id)
    //this.paired_devices.splice(index,1);
  }
  simulate() {
    this.router.navigateByUrl('/show-alert', { replaceUrl: false })
  }
  ngOnInit() {
  }

}
