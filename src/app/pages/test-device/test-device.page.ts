import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SharedDataService, StorageNameType } from '../../data/shared-data.service'
import { NavigationExtras, Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog';
import { DialogModifyNameComponent } from '../signup/dialog-modify-name/dialog-modify-name.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SendAuthService } from 'src/app/data/send-auth.service';
import { DialogScanBluetoothComponent } from '../signup/dialog-scan-bluetooth/dialog-scan-bluetooth.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-test-device',
  templateUrl: './test-device.page.html',
  styleUrls: ['./test-device.page.scss'],
})
export class TestDevicePage implements OnInit {
  StorageNameType = StorageNameType
  constructor(private translate:TranslateService,public sendAuth:SendAuthService,public authService: AuthenticationService,public shared_data: SharedDataService, private router: Router, public dialog: MatDialog,private changeDetection: ChangeDetectorRef) {
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
  modifyNameDevice(i) {
    const dialogRef = this.dialog.open(DialogModifyNameComponent, {
      maxWidth: '90vw',
      minWidth: '40vw',
      panelClass: 'custom-dialog-container',
      data: {
        id: this.shared_data.user_data.paired_devices[i],
        name: '',
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.shared_data.setNameDevice(result.value.id, StorageNameType.DEVICES, result.value.name);
      const slidingItem = document.getElementById('slidingItem' + i) as any;
      slidingItem.close();
      this.changeDetection.detectChanges();
    });
  }
  delete(device, index) {
    console.log('delete pos ' + index + " -> " + device.uuid)
    var a = $('#device' + index).hide(400, () => {
      //var data_to_send = this.NGSIv2QUERY.getEmergencyContactsToSend(newContacts);
      var el_deleted = this.shared_data.user_data.paired_devices.splice(index, 1);
      this.changeDetection.detectChanges()
      console.log(this.shared_data.user_data.paired_devices)
      //this.bluetoothservice.disableRegion(deviceDeleted)
      if (this.authService.isAuthenticated.getValue())
        this.sendAuth.saveUserProfile().then(() => {
          this.shared_data.deleteDeviceFromLocalStorage(el_deleted, StorageNameType.DEVICES);
          this.shared_data.createToast(this.translate.instant('ALERT.data_success'))
        }, err => {
          //alert(err)
          console.log(this.shared_data.user_data)
          this.shared_data.createToast(this.translate.instant('ALERT.data_fail'))
          this.shared_data.old_user_data.copyFrom(this.shared_data.user_data)
          this.changeDetection.detectChanges()
        })
      //.then(()=>{ alert('Successfully updated)},err=>aler('Update error' + err))
      //this.shared_data.user_data.paired_devices[index] = null;
      //this.shared_data.saveData();
      console.log(this.shared_data.user_data.paired_devices)
    })
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
  openBeaconDialog() {
    //this.shared_data.user_data.paired_devices[0] == null || this.shared_data.user_data.paired_devices[1] == null
    console.log(this.shared_data.user_data.paired_devices)
    if (this.shared_data.user_data.paired_devices.length < 2) {
      const dialogRef = this.dialog.open(DialogScanBluetoothComponent, {
        maxWidth: '90vw',
        minWidth: '40vw',
        data: { result: '' }
      })
      dialogRef.afterClosed().subscribe((result) => {
        if (result != '' && result !== undefined)
          this.addPairedDeviceANDregister(result);
      }, err => (console.log(err)));
    }
    else
      this.shared_data.createToast(this.translate.instant('ALERT.already_paired'));
  };
  addPairedDeviceANDregister(device) {
    var indexOf = this.shared_data.user_data.paired_devices.indexOf(device);
    this.shared_data.user_data.paired_devices.push(device);
    console.log(this.shared_data.user_data.paired_devices.length)
    if (indexOf == -1) {
      alert(this.translate.instant('ALERT.device_connected_succ'))
      if (this.authService.isAuthenticated.getValue())
        this.sendAuth.saveUserProfile().then(() => {
          this.shared_data.setNameDevice(device, device);
          this.shared_data.createToast(this.translate.instant('ALERT.data_success'))
        }, err => {
          alert(err)
          this.shared_data.createToast(this.translate.instant('ALERT.data_fail'))
        })
    }
    else
      alert(this.translate.instant('ALERT.device_connected_err'))
  }
}