import { Component, Injectable, NgModule } from '@angular/core';
import { SharedDataService } from '../data/shared-data.service'
import { BLE } from '@ionic-native/ble/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Device } from '../data/shared-data.service';
@NgModule({
  imports: [],
  providers: [BLE]
})
@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  constructor(private localNotification: LocalNotifications, private ble: BLE, private sharedData: SharedDataService) {

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
        resolve(peripheralData)
      }, (err) => { reject(err) })
    })
  }
  startNotificationDevice(device: Device) {
    this.ble.startNotification(device.id, '', '').subscribe((buffer) => {
      console.log(buffer)
    })
  }
  autoConnectBluetooth() {
    this.checkBluetooth();
    this.sharedData.user_data.paired_devices.forEach(element => {
      if (element.id != '-1') {
        this.ble.autoConnect(element.id, (peripheralData) => {
          element.connected = true;
          this.ble.startNotification(peripheralData.id, '', '').subscribe((buffer) => {
            console.log(buffer)
          })
          console.log(peripheralData)
        }, () => {
          alert('Disconnected device')
          element.connected = false
        })
        // this.ble.connect(element.id).subscribe((peripheralData) => {
        //   console.log(peripheralData)
        //   this.count_devices_connected++;
        // }, (peripheralData) => {
        //   alert('Disconnected device')
        //   this.count_devices_connected--;
        // })
      }
    }, (err) => alert(err));
  }
  disconnectAllDevices() {
    this.sharedData.user_data.paired_devices.forEach((element) => {
      if (element.id != '-1')
        this.ble.disconnect(element.id)
    }, (err) => alert(err))
  }
  disconnectDevice(id) {
    this.ble.disconnect(id).then(() => {
    }, (err) => { })
  }
  scan(scanningTime: number = 10000) {
    return new Promise((resolve, reject) => {
      var array = []
      this.ble.isEnabled().then(
        () => { }
        , (err) => {
          this.ble.enable().then(() => { },
            (err) => {
              alert('Scan not working if bluetooth is off');
              reject(array)
            })
        }).then(() => {
          this.ble.startScanWithOptions([], { reportDuplicates: false }).subscribe(device => {
            array.push(device)
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
