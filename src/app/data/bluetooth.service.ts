import { Component, Injectable, NgModule } from '@angular/core';
import { SharedDataService } from '../data/shared-data.service'
import { Beacon, IBeacon, Region } from '@ionic-native/ibeacon/ngx'
import { BLE } from '@ionic-native/ble/ngx';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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
  beaconList: Beacon[] = [];
  constructor(private ble: BLE, private ibeacon: IBeacon, private shared_data: SharedDataService,) {
    
  }
  /*52414449-5553-4e45-5457-4f524b53434f */
  beacon_regions = [];
  detectedValue=new BehaviorSubject(null);
  scanBLE(scanningTime: number = 10000) /*milliseconds */ {
    return new Promise((resolve, reject) => {
      //var array = [];
      this.ble.isEnabled().then(
        () => { }
        , (err) => {
          this.ble.enable().then(() => { },
            (err) => {
              alert('Scan not working if bluetooth is off');
              reject(err)
            })
        }).then(() => {
          this.ble.startScanWithOptions([], { reportDuplicates: false }).subscribe(device => {
            this.detectedValue.next(device);
            //array.push(device);
            //console.log(JSON.stringify(device));
          }, (err) => console.log(err));
        });
      setTimeout(() => {
        this.ble.stopScan();
        resolve(true)
      }, scanningTime);
    })
  }
  stopScan() {
    this.ble.stopScan()
  }
  connectDevice(id) {
    return new Promise((resolve, reject) => {
      this.ble.connect(id).subscribe((peripheralData) => {
        console.log('enable connection')
        this.startRegisterBeacon();
        this.addPairedDeviceANDregister(peripheralData)
        console.log(id)
        resolve(peripheralData)
      }, (err) => { reject(err) })
    })
  }
  addPairedDeviceANDregister(device) {
    if (this.shared_data.user_data.paired_devices[0] == null) {
      this.shared_data.user_data.paired_devices[0] = device;
      this.shared_data.user_data.paired_devices[0]['name'] = 'Device1'
      alert('Successfully paired');
    }
    else
      if (this.shared_data.user_data.paired_devices[1] == null) {
        this.shared_data.user_data.paired_devices[1] = device;
        this.shared_data.user_data.paired_devices[1]['name'] = 'Device2'
        alert('Successfully paired');
      }
      else
        this.shared_data.createToast('You have already 2 paired devices!');
  }
  enableAllUserBeacon() {
    this.shared_data.user_data.paired_devices.forEach((element) => {
      this.startRegisterBeacon()
    })
  }
  startRegisterBeacon() {
    this.ibeacon.requestAlwaysAuthorization();
    // create a new delegate and register it with the native layer
    let delegate = this.ibeacon.Delegate();
    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion()
      .subscribe(
        data => console.log('didRangeBeaconsInRegion: ', data),
        error => console.error()
      );
    delegate.didStartMonitoringForRegion()
      .subscribe(
        data => console.log('didStartMonitoringForRegion: ', data),
        error => console.error()
      );
    delegate.didEnterRegion()
      .subscribe(
        data => {
          console.log('didEnterRegion: ', data);
        }
      );

    let beaconRegion = this.ibeacon.BeaconRegion('Beacon', '52414449-5553-4e45-5457-4f524b53434f');
    this.ibeacon.startMonitoringForRegion(beaconRegion)
      .then(
        () => console.log('Native layer received the request to monitoring'),
        error => console.error('Native layer failed to begin monitoring: ', error)
      );
  }
  detectAllBeacon() {
    let delegate = this.ibeacon.Delegate();
    delegate.didRangeBeaconsInRegion().subscribe((data) => {
      this.beaconList = data.beacons;
      console.log(data)
      console.log('didRangeBeaconsInRegion: ')
    }, (err) => console.log(err))
    delegate.didStartMonitoringForRegion()
      .subscribe(
        data => console.log('didStartMonitoringForRegion: ', data),
        error => console.error()
      );
    delegate.didEnterRegion()
      .subscribe(
        data => {
          alert('Alert detected')
          console.log('didEnterRegion: ', data);
        }
      );
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
