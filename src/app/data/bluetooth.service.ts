import { Injectable, NgModule } from '@angular/core';
import { IBeacon } from '@ionic-native/ibeacon/ngx'
import { BLE } from '@ionic-native/ble/ngx';
import { BehaviorSubject } from 'rxjs';
import { AlertEvent, SharedDataService } from './shared-data.service';
import { AuthenticationService } from '../services/authentication.service'
import { NGSIv2QUERYService } from './ngsiv2-query.service';
import { TranslateService } from '@ngx-translate/core';
import { EmergencyService } from './emergency.service';
/** save data
 * DD:31:A4:AD:A3:05
 */
@NgModule({
  imports: [],
  providers: [BLE, IBeacon]
})
@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  detectedValue = new BehaviorSubject(null);
  constructor(private translate: TranslateService, private authService: AuthenticationService, private ble: BLE, private ibeacon: IBeacon, private shared_data: SharedDataService, private emergencyService: EmergencyService) {
  }
  /*52414449-5553-4e45-5457-4f524b53434f*/
  //21111994-0000-0000-0000-000000000001
  stopScan() {
    console.log('stop')
    this.ble.stopScan()
  }
  scanBLE(scanningTime: number = 10000) {
    return new Promise((resolve, reject) => {
      this.ble.isEnabled().then(
        () => { }
        , (err) => {
          this.ble.enable().then(() => { },
            (err) => {
              alert(this.translate.instant('ALERT.ble_scan_err'));
              reject(err)
            })
        }).then(() => {
          this.ble.startScanWithOptions([], { reportDuplicates: false }).subscribe(device => {
            this.detectedValue.next(device);
          }, (err) => reject(err));
        });
      setTimeout(() => {
        this.ble.stopScan();
        resolve(true)
      }, scanningTime);
    })
  }
  private toHexString(byteArray) {
    return Array.from(byteArray, function (byte: number) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }
  connectDevice(device) {
    return new Promise((resolve, reject) => {
      this.ble.stopScan();
      this.ble.connect(device.id).subscribe((peripheralData) => {
        var int8View = new Int8Array(peripheralData.advertising);
        var hex = this.toHexString(int8View);
        var uuid = hex.substring(18, 26) + '-' + hex.substring(26, 30) + '-' + hex.substring(30, 34) + '-' + hex.substring(34, 38) + '-' + hex.substring(38, 50);
        console.log('RegisterBeacon')
        this.startRegisterBeacon(uuid);
        resolve(uuid)
      }, (err) => { reject(err) })
    })
  }
  enableAllBeaconFromSnap4City() {
    this.shared_data.user_data.paired_devices.forEach((element) => {
      this.startRegisterBeacon(element);
      console.log('enabled ' + element)
    }, err => console.log(err))
  }
  private startRegisterBeacon(uuid) {
    var delegate = this.ibeacon.Delegate()
    let beaconRegion;
    beaconRegion = this.ibeacon.BeaconRegion(uuid, uuid);
    delegate.didRangeBeaconsInRegion()
      .subscribe(
        data => {
          //  console.log(data)
          //   if (this.authService.isAuthenticated.value) {
          //     var found = false;
          //     for (var index = 0; index < this.shared_data.user_data.paired_devices.length && !found; index++) {
          //       if (this.shared_data.user_data.paired_devices[index] === data.region.identifier)
          //         found = true;
          //     }
          //     if (found)
          //       this.shared_data.showAlert(this.shared_data.user_data.paired_devices[index - 1]);
          //   }
          // }, err => alert(err)
        });
    delegate.didStartMonitoringForRegion()
      .subscribe(() => { });
    delegate.didEnterRegion()
      .subscribe(
        data => {
          if (this.authService.isAuthenticated.value) {
            var found = false;
            for (var index = 0; index < this.shared_data.user_data.paired_devices.length && !found; index++) {
              if (this.shared_data.user_data.paired_devices[index] === data.region.identifier)
                found = true;
            }
            if (found) {
              this.emergencyService.details_emergency.deviceID = data.region.identifier;
              if (!this.shared_data.enabled_test_battery_mode.getValue()){
                this.shared_data.playSound();
                this.emergencyService.sendEmergency()}
              else
                this.emergencyService.sendTestBattery();
            }
            //this.shared_data.showAlert(this.shared_data.user_data.paired_devices[index - 1]);
          }
        }, err => console.log(err)
      );
    //enables beacon detection
    this.ibeacon.startRangingBeaconsInRegion(beaconRegion).then((obj) => { }, err => console.log(err))
    this.ibeacon.startMonitoringForRegion(beaconRegion).then(() => { }, error => console.error('Native layer failed to begin monitoring: ', error));
  }
}
