import { Component, Injectable, NgModule } from '@angular/core';
import { Beacon, IBeacon, Region } from '@ionic-native/ibeacon/ngx'
import { BLE } from '@ionic-native/ble/ngx';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// import * as crypto from 'crypto'
import { SharedDataService } from './shared-data.service';
import { AuthenticationService } from '../services/authentication.service'
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
  constructor(private authService: AuthenticationService, private ble: BLE, private ibeacon: IBeacon, private shared_data: SharedDataService,) {
  }
  /*52414449-5553-4e45-5457-4f524b53434f*/
  beacon_regions = [];
  detectedValue = new BehaviorSubject(null);
  stopScan(){
    this.ble.stopScan().then(()=>{
      console.log('stop scan')
    })
  }
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
  toHexString(byteArray) {
    return Array.from(byteArray, function (byte: number) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }
  connectDevice(id) {
    return new Promise((resolve, reject) => {
      this.ble.stopScan();
      this.ble.connect(id).subscribe((peripheralData) => {
        console.log(peripheralData)
        console.log('enable connection')
        console.log('HEX DATA')
        var int8View = new Int8Array(peripheralData.advertising);
        var hex = this.toHexString(int8View);
        console.log(hex)
        var manufacturer_id = hex[10] + hex[11] + hex[12] + hex[13];
        if (manufacturer_id != '4c00') {//4c00->manufacturer Apple
          peripheralData.protocol = 'ble';
          this.ble.autoConnect(peripheralData.id, () => {
            console.log('detected ')
            if (this.authService.isAuthenticated.value)
              this.shared_data.showAlert();
          }, (err) => {
            console.log(err)
          })
        }
        else {
          peripheralData.protocol = 'ibeacon'
          console.log(hex);
          var uuid = hex.substring(18, 26) + '-' + hex.substring(26, 30) + '-' + hex.substring(30, 34) + '-' + hex.substring(34, 38) + '-' + hex.substring(38, 50);
          peripheralData.uuid = uuid;
          console.log('uuid-> ' + uuid);
          this.startRegisterBeacon(uuid);
          console.log(id)
        }
        this.addPairedDeviceANDregister(peripheralData)
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
    else {
      this.shared_data.user_data.paired_devices[1] = device;
      this.shared_data.user_data.paired_devices[1]['name'] = 'Device2'
      alert('Successfully paired');
    }
    this.shared_data.saveData();
  }
  enableAllUserBeacon() {
    console.log('enableUserBeacon')
    console.log(this.shared_data.user_data)
    this.shared_data.user_data.paired_devices.forEach((element) => {
      console.log(element)
      if (element != null) {
        if (element.protocol == 'ibeacon') {
          console.log('ibeacon');
          console.log(element)
          this.startRegisterBeacon(element.uuid);
        }
        else {
          console.log('ble');
          console.log(element)
          this.ble.autoConnect(element.id, () => {
            console.log('autoconnection')
            if (this.authService.isAuthenticated.value)
              this.shared_data.showAlert();
          }, (err) => {
            console.log(err);
          })
        }
      }
      // console.log('elemento')
      // console.log(element)
      // if (element != null) {
      //   console.log('enable userBeacon')
      //   console.log(element)
      //   this.startRegisterBeacon(element.uuid)
      // }
    }, err => console.log(err))
  }
  checkRangeBeaconsInRegion(index) {
    this.ibeacon.requestAlwaysAuthorization();
    // create a new delegate and register it with the native layer
    let delegate = this.ibeacon.Delegate();
    //Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion() //this can detect beacon in region
      .subscribe(
        data => {
          console.log('didRangeBeaconsInRegion: ', data)
          this.shared_data.user_data.paired_devices[index].inRegion = true;
          let beaconRegion = this.ibeacon.BeaconRegion('Beacon_' + this.shared_data.user_data.paired_devices[index].uuid, this.shared_data.user_data.paired_devices[index].uuid);
          this.ibeacon.stopRangingBeaconsInRegion(beaconRegion);
        },
        error => console.error()
      );
  }
  startRegisterBeacon(uuid) {
    this.ibeacon.requestAlwaysAuthorization();
    // create a new delegate and register it with the native layer
    let delegate = this.ibeacon.Delegate();
    let beaconRegion = this.ibeacon.BeaconRegion('Beacon_' + uuid, uuid);
    //let beaconRegion = this.ibeacon.BeaconRegion('test', null, null, null);
    console.log(beaconRegion)
    //console.log('uuid-> ' + uuid)
    //Subscribe to some of the delegate's event handlers
    // delegate.didRangeBeaconsInRegion()//this can detect beacon in region
    //   .subscribe(
    //     data => console.log('didRangeBeaconsInRegion: ', data),
    //     error => console.error()
    //   );
    delegate.didStartMonitoringForRegion()
      .subscribe(
        data => console.log('didStartMonitoringForRegion: ', data),
        error => console.error()
      );
    delegate.didEnterRegion()
      .subscribe(
        data => {
          console.log('didEnterRegion: ', data);
          if (this.authService.isAuthenticated.value) {
            console.log(data.region.identifier)
            console.log(this.shared_data.user_data.paired_devices)
            if (data.region.identifier == 'Beacon_' + this.shared_data.user_data.paired_devices[0].uuid || data.region.identifier == 'Beacon_' + this.shared_data.user_data.paired_devices[1].uuid) {
              console.log('Detected uuid ' + data.region.identifier);
              this.shared_data.showAlert();
            }
          }
        }, err => console.log(err)
      );
    console.log("created beaconRegion")
    this.ibeacon.startAdvertising(beaconRegion).then((obj) => {
      console.log(obj)
      console.log('startAdvertisment');
    }, err => console.log(err))
    this.ibeacon.startRangingBeaconsInRegion(beaconRegion).then((obj) => {
      console.log(obj)
      console.log('startRangingBeaconsInRegion');
    }, err => console.log(err))
    this.ibeacon.startMonitoringForRegion(beaconRegion)
      .then(
        () => console.log('Native layer received the request to monitoring'),
        error => console.error('Native layer failed to begin monitoring: ', error)
      );
  }
  // detectAllBeacon() {
  //   let delegate = this.ibeacon.Delegate();
  //   delegate.didRangeBeaconsInRegion().subscribe((data) => {
  //     this.beaconList = data.beacons;
  //     console.log(data)//this
  //     console.log('didRangeBeaconsInRegion: ')
  //   }, (err) => console.log(err))
  //   delegate.didStartMonitoringForRegion()
  //     .subscribe(
  //       data => console.log('didStartMonitoringForRegion: ', data),
  //       error => console.error()
  //     );
  //   delegate.didEnterRegion()
  //     .subscribe(
  //       data => {
  //         ///this.shared_data.showAlert();
  //         alert('Alert detected')
  //         console.log('didEnterRegion: ', data);
  //       }
  //     );
  // }
  // private beaconEnterRegion(data) {
  //   console.log('Beacon ', data, ' detected');
  // }
  disableAll() {
    this.shared_data.user_data.paired_devices.forEach((element) => {
      if (element.protocol != 'ble') {
        this.ibeacon.Delegate();
        console.log('Stop monitoring ' + element.uuid);
        this.ibeacon.stopMonitoringForRegion(element);
        this.ibeacon.stopRangingBeaconsInRegion(element);
        this.ibeacon.stopAdvertising(element);
        console.log('disconnected ibeacon');
      }
      else {
        //this.ble.disconnect(element.id);
        console.log('disconnected ble')
      }
    })
  }
}
