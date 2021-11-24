import { Component, OnInit } from '@angular/core';
import { SharedDataService, UserData } from '../../data/shared-data.service'
import { Router } from '@angular/router'
@Component({
  selector: 'app-test-device',
  templateUrl: './test-device.page.html',
  styleUrls: ['./test-device.page.scss'],
})
export class TestDevicePage implements OnInit {
  
  constructor(public shared_data: SharedDataService, private router: Router) {
  }
  ngOnInit() {
  }
  go_to_deviceSettings() {
    this.router.navigateByUrl('/profile/menu/profile', { replaceUrl: true, state: { page: 6 } })
  }
  testDevice(){
    alert('')
  }
}
