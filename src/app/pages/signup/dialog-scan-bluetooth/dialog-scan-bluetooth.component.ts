import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BLE } from '@ionic-native/ble/ngx';
import { Platform } from '@ionic/angular';
import { BluetoothService } from '../../../data/bluetooth.service'
@Component({
  selector: 'app-dialog-scan-bluetooth',
  templateUrl: './dialog-scan-bluetooth.component.html',
  styleUrls: ['./dialog-scan-bluetooth.component.scss'],
})
export class DialogScanBluetoothComponent implements OnInit {
  devices = [];
  selectedOptions
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private bluetoothService: BluetoothService, private ble: BLE, private dialogRef: MatDialogRef<DialogScanBluetoothComponent>, private platform: Platform, private ngZone: NgZone) {
    this.platform.ready().then(() => {
      this.scan();
      this.dialogRef.afterClosed().subscribe(() => {
        this.ble.stopScan();
        console.log('stopScanning')
      })
    })

  }
  scan() {
    //this.bluetoothService.BeaconLibrary();
    this.bluetoothService.scanBLE(25000).then((scanList: []) => {
      $('#matSpinner').hide()
      this.devices = scanList;
      console.log(scanList)
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
      this.bluetoothService.BeaconLibrary();
      alert('Correctly connected')
      this.closeDialog();
    }, (err) => {
      $('#matSpinner' + i).hide();;
      alert('Error' + err)
    });
  }
  closeDialog() {
    this.ngZone.run(() => {
      this.dialogRef.close(this.data);
      console.log('closeDIalog')
    })

  }
  ngOnInit() { }

}
