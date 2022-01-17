import { Component, Injectable, NgModule } from '@angular/core';
import { SharedDataService } from '../data/shared-data.service'
import { BLE } from '@ionic-native/ble/ngx';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
//import { Device } from '../data/shared-data.service';
import { Platform } from '@ionic/angular';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx'
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
  constructor(private bluetoothLE: BluetoothLE, private platform: Platform, private ibeacon: IBeacon, private localNotification: LocalNotifications, private ble: BLE, private sharedData: SharedDataService) {
    this.platform.ready().then(() => {
      this.bluetoothLE.initialize()
    })
  }
  bluetoothLEScan(scanningTime = 10000) {
    return new Promise((resolve, reject) => {
      this.bluetoothLE.initialize().subscribe((status) => {
        console.log(status);
      });
      var array = []
      this.bluetoothLE.isEnabled().then(
        () => { }
        , (err) => {
          this.bluetoothLE.enable()
        }).then(() => {
          this.bluetoothLE.startScan({ allowDuplicates: false }).subscribe(device => {
            if (array.findIndex((dev) => dev.address == device.address) == -1) {
              var adv = device.advertisement;
              array.push(device)
              //console.log(this.bluetoothLE.encodedStringToBytes('AwNv/RcWb/1nFJSQPeFo1Vf3Y3mCWEKQEpJyJgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='));
              console.log(device.name + ' ' + device.address)
              //console.log('adv-> '+this.bluetoothLE.encodedStringToBytes('AgEFBP9NRgEJCXNhZmVkb21lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='))
              console.log(JSON.stringify(device));
            }
          }, (err) => console.log(err));
        }, (err) => {
          console.log(err);
          reject(err)
        });
      setTimeout(() => {
        this.bluetoothLE.stopScan();
        resolve(array);
      }, scanningTime);
    })
  }
  BeaconLibrary() {
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
          alert('Connected');
        }
      );

    let beaconRegion = this.ibeacon.BeaconRegion('Beacon', '52414449-5553-4e45-5457-4f524b53434f');
    this.ibeacon.startMonitoringForRegion(beaconRegion)
      .then(
        () => console.log('Native layer received the request to monitoring'),
        error => console.error('Native layer failed to begin monitoring: ', error)
      );
  }
  enableNotificationTurnOffBluetooth() {
    this.ble.startStateNotifications().subscribe((state) => {
      if (state == 'turningOff') {
        this.localNotification.schedule({
          id: 3,
          text: 'App can\'t work properly with bluetooth off, turn it on!'
        })
      }
      else if (state == 'turningOn') {
        this.autoConnectBluetooth();
      }
    }, (err) => console.log(err))
  }
  disableNotificationTurnOffBluetooth() {
    this.ble.stopStateNotifications();
  }
  checkBluetooth() {
    if (!this.ble.isEnabled())
      this.ble.enable();
  }
  connectDevice(id) {
    return new Promise((resolve, reject) => {
      this.ble.connect(id).subscribe((peripheralData) => {
        console.log('enable connection')
        console.log(id)
        resolve(peripheralData)
      }, (err) => { reject(err) })
    })
  }
  bluetoothLEconnectDevice(id) {
    return new Promise((resolve, reject) => {
      this.bluetoothLE.connect({ address: id, autoConnect: true }).subscribe((peripheralData) => {
        console.log('autoConnect Enabled')
        resolve(peripheralData)
      }, (err) => { console.log('Disconected ' + id); reject(err) })
    })
  }
  autoConnectBluetooth() {
    this.checkBluetooth();
    console.log(this.sharedData.user_data.paired_devices)
    this.sharedData.user_data.paired_devices.forEach(element => {
      if (element?.id != '-1') {
        this.ble.autoConnect(element.id, this.onConnected.bind(this), this.onDisconnectd.bind(this));
      }
    }, (err) => console.log(err));
  }
  timeConnected = 0;
  timeDisconnected = 0;
  onConnected(peripheralData) {
    console.log('detect ' + peripheralData.id);
    //console.log('start timer');
    //this.timeConnected = new Date().getTime();
    // this.sharedData.showAlert();
    //console.log(peripheralData)
  }
  onDisconnectd(peripheralData) {
    //alert('Disconnected device')
    //this.timeDisconnected = new Date().getTime();
    console.log('Disconnected ' + peripheralData.id);
    //console.log('stop timer')
    //console.log('total time -> ' + (this.timeDisconnected - this.timeConnected) + ' milliseconds')
  }
  disconnectAllDevices() {
    this.sharedData.user_data.paired_devices.forEach((element) => {
      if (element.id != '-1')
        this.ble.disconnect(element.id)
    }, (err) => console.log(err))
  }
  disconnectDevice(id) {
    this.ble.disconnect(id).then(() => {
    }, (err) => { })
  }
  scanBLE(scanningTime: number = 10000) {
    return new Promise((resolve, reject) => {
      var array = []
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
            array.push(device);
            console.log(JSON.stringify(device));
          }, (err) => console.log(err));
        });
      setTimeout(() => {
        this.ble.stopScan();
        resolve(array);
      }, scanningTime);
    })
  }
  stopScan() {
    this.ble.stopScan()
  }
}
