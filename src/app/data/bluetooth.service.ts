import { Component, Injectable, NgModule } from '@angular/core';
import { SharedDataService } from '../data/shared-data.service'
import { Beacon, IBeacon, Region } from '@ionic-native/ibeacon/ngx'
/** save data
 * DD:31:A4:AD:A3:05
 */
@NgModule({
  imports: [],
  providers: [IBeacon]
})
@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  beaconList: Beacon[] = [];
  constructor(private ibeacon: IBeacon, private shared_data: SharedDataService) {

  }
  /*52414449-5553-4e45-5457-4f524b53434f*/
  beacon_regions = [];
  addPairedDeviceANDregister(device) {
    var result = this.startRegisterBeacon(device.uuid);
    if (result) {
      if (this.shared_data.user_data.paired_devices[0] == null) {
        this.shared_data.user_data.paired_devices[0] = device;
        this.shared_data.user_data.paired_devices[0]['name'] = 'Device1'
        alert('Successfully paired');
      }
      else
        if (this.shared_data.user_data.paired_devices[1] == null) {
          this.shared_data.user_data.paired_devices[1] = device
          this.shared_data.user_data.paired_devices[1]['name'] = 'Device2'
          alert('Successfully paired');
        }
        else
          this.shared_data.createToast('You have already 2 paired devices!');
    }
    else
      alert('Error ' + result)
  }
  enableAllUserBeacon() {
    this.shared_data.user_data.paired_devices.forEach((element) => {
      this.startRegisterBeacon(element)
    })
  }
  startRegisterBeacon(device: Beacon) {
    // //create a new delegate and register it with the native layer
    let delegate = this.ibeacon.Delegate();
    var ok;
    // // Subscribe to some of the delegate's event handlers
    this.ibeacon.BeaconRegion('BeaconDevice_' + device.uuid, device.uuid);
    delegate.didEnterRegion().subscribe(
      data => {
        this.beaconEnterRegion(data);
        ok = true
      }, err => { ok = err }
    );
    return ok;
  }
  detectAllBeacon() {
    let delegate = this.ibeacon.Delegate();
    delegate.didRangeBeaconsInRegion().subscribe((data) => {
      this.beaconList = data.beacons;
    }, (err) => console.log(err))
  }
  private beaconEnterRegion(data) {
    console.log('Beacon ', data, ' detected');
    this.shared_data.showAlert();
  }
  stopDetectBeacon() {
    this.shared_data.user_data.paired_devices.forEach((element) => {
      if (element != null) {
        console.log('Stop monitoring ' + element.uuid)
        this.ibeacon.stopMonitoringForRegion(element)
        this.ibeacon.stopRangingBeaconsInRegion(element);
        this.ibeacon.stopAdvertising(element);
      }
    })
  }
}
