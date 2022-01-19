import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BLE } from '@ionic-native/ble/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { BluetoothService } from '../../../data/bluetooth.service'
import { ChangeDetectorRef } from '@angular/core';

/* first pair device and then use Ibeacon Library  */
@Component({
  selector: 'app-dialog-scan-bluetooth',
  templateUrl: './dialog-scan-bluetooth.component.html',
  styleUrls: ['./dialog-scan-bluetooth.component.scss'],
})
export class DialogScanBluetoothComponent implements OnInit {
  //bs: any;
  devices = [];
  selectedOptions;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private detectChange:ChangeDetectorRef, public bluetoothService: BluetoothService, private ble: BLE, private dialogRef: MatDialogRef<DialogScanBluetoothComponent>, private platform: Platform, private ngZone: NgZone) {
    this.platform.ready().then(() => {
      //this.bluetoothService.startRegisterBeacon();
      this.scan();
      console.log('scanning...')
      this.dialogRef.afterClosed().subscribe(() => {
        this.ble.stopScan();
        console.log('stopScanning')
      })
    })
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
  scan() {
    this.bluetoothService.detectedValue.subscribe((value) => {
      console.log(value);
      if (value != null){
        this.devices.push(value);
        this.detectChange.detectChanges();
      }
    })
    this.bluetoothService.scanBLE(15000).then((scanList: []) => {
      $('#matSpinner').hide()
      //this.devices = scanList;
      //console.log(scanList)
    });
  }
  connect(i) {
    console.log(i);
    // $('#matSpinner').hide();
    $('#matSpinner' + i).css('display', 'flex')
    this.data = this.devices[i];
    this.bluetoothService.connectDevice(this.data.id).then((peripheralData) => {
      $('#matSpinner' + i).hide();
      this.data = peripheralData;
      console.log(peripheralData)
      alert('Correctly connected');
      this.closeDialog();
    }, (err) => {
      $('#matSpinner' + i).hide();
      console.log(err);
      alert('Error' + err)
    });
  }
  closeDialog() {
    this.ngZone.run(() => {
      this.dialogRef.close(this.data);
      console.log('closeDIalog')
    })
  }
  // connect(device) {
  //   this.bluetoothService.addPairedDeviceANDregister(device);
  //   this.closeDialog();
  // }
  ngOnInit() { }

}
