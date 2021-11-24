import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BLE } from '@ionic-native/ble/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { BluetoothService } from '../../../data/bluetooth.service'
import { SharedDataService } from '../../../data/shared-data.service'

@Component({
  selector: 'app-dialog-scan-bluetooth',
  templateUrl: './dialog-scan-bluetooth.component.html',
  styleUrls: ['./dialog-scan-bluetooth.component.scss'],
})
export class DialogScanBluetoothComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any ,public bluetoothService: BluetoothService, private ble: BLE, private dialogRef: MatDialogRef<DialogScanBluetoothComponent>, private platform: Platform, private ngZone: NgZone) {
    this.platform.ready().then(() => {
      this.scan();
      this.dialogRef.afterClosed().subscribe(() => {
        this.ble.stopScan();
        console.log('stopScanning')
      })
    })
  }
  scan() {
    var bs = new BehaviorSubject(this.bluetoothService.beaconList).subscribe(() => {
      $('#matSpinner').hide();
      bs.unsubscribe();
    })
    this.bluetoothService.detectAllBeacon();
  }
  closeDialog() {
    this.ngZone.run(() => {
      this.dialogRef.close(this.data);
      console.log('closeDIalog')
    })
  }
  connect(device) {
    this.bluetoothService.addPairedDeviceANDregister(device);
    this.closeDialog();
  }
  ngOnInit() { }

}
