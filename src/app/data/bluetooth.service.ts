import { Component, Injectable, NgModule } from '@angular/core';
import { SharedDataService } from '../data/shared-data.service'
import { Beacon, IBeacon, Region } from '@ionic-native/ibeacon/ngx'
import { BLE } from '@ionic-native/ble/ngx';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// import * as crypto from 'crypto'
import * as  hexToUuid from 'hex-to-uuid';

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
    //this.startRegisterBeacon();
  }
  /*52414449-5553-4e45-5457-4f524b53434f */
  beacon_regions = [];
  detectedValue = new BehaviorSubject(null);
  // java_kind_hash(input) {
  //   input = "";
  //   var md5Bytes = crypto.createHash('md5').update(input).digest()
  //   md5Bytes[6] &= 0x0f;  // clear version 
  //   md5Bytes[6] |= 0x30;  // set to version 3 
  //   md5Bytes[8] &= 0x3f;  // clear variant 
  //   md5Bytes[8] |= 0x80;  // set to IETF variant
  //   console.log(hexToUuid(md5Bytes.toString('hex')))
  //   return hexToUuid(md5Bytes.toString('hex'));
  // }
  // javaHash(input) {
  //   input = '';
  //   let md5Bytes = crypto.createHash('md5').update(input).digest();
  //   md5Bytes[6] &= 0x0f;  /* clear version        */
  //   md5Bytes[6] |= 0x30;  /* set to version 3     */
  //   md5Bytes[8] &= 0x3f;  /* clear variant        */
  //   md5Bytes[8] |= 0x80;  /* set to IETF variant  */
  //   return md5Bytes.toString('hex');
  // }
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
  toHexString(byteArray) {
    return Array.from(byteArray, function (byte: number) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }
  connectDevice(id) {
    return new Promise((resolve, reject) => {
      this.ble.connect(id).subscribe((peripheralData) => {
        console.log('enable connection')
        console.log('HEX DATA')
        var int8View = new Int8Array(peripheralData.advertising);
        var hex = this.toHexString(int8View);
        var uuid = hex.substring(18, 26) + '-' + hex.substring(26, 30) + '-' + hex.substring(30, 34) + '-' + hex.substring(34, 38) + '-' + hex.substring(38, 50);
        console.log(hex)
        console.log('uuid-> ' + uuid);
        this.startRegisterBeacon(uuid);
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
    this.shared_data.saveData();
  }
  enableAllUserBeacon() {
    this.shared_data.user_data.paired_devices.forEach((element) => {
      //this.startRegisterBeacon()
    })
  }
  startRegisterBeacon(uuid) {
    this.ibeacon.requestAlwaysAuthorization();
    // create a new delegate and register it with the native layer
    let delegate = this.ibeacon.Delegate();
    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion()//this can detects beacon in region
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
    let beaconRegion = this.ibeacon.BeaconRegion('Beacon_' + uuid, uuid);
    // this.ibeacon.startAdvertising(beaconRegion).then((obj) => {
    //   console.log(obj)
    //   console.log('startAdvertisment');
    // })
    // this.ibeacon.startRangingBeaconsInRegion(beaconRegion).then((obj) => {
    //   console.log(obj)
    //   console.log('startRangingBeaconsInRegion');
    // })
    // this.ibeacon.startMonitoringForRegion(beaconRegion)
    //   .then(
    //     () => console.log('Native layer received the request to monitoring'),
    //     error => console.error('Native layer failed to begin monitoring: ', error)
    //   );
  }
  detectAllBeacon() {
    let delegate = this.ibeacon.Delegate();
    delegate.didRangeBeaconsInRegion().subscribe((data) => {
      this.beaconList = data.beacons;
      console.log(data)//this
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
          ///this.shared_data.showAlert();
          alert('Alert detected')
          console.log('didEnterRegion: ', data);
        }
      );
  }
  private beaconEnterRegion(data) {
    console.log('Beacon ', data, ' detected');
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
