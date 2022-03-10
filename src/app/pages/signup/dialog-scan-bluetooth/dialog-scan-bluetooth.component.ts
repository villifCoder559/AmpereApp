import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BLE } from '@ionic-native/ble/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { BluetoothService } from '../../../data/bluetooth.service'
import { ChangeDetectorRef } from '@angular/core';
import { SharedDataService } from 'src/app/data/shared-data.service';

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
  constructor(@Inject(MAT_DIALOG_DATA) public data: any = '', private sharedData: SharedDataService, private detectChange: ChangeDetectorRef, public bluetoothService: BluetoothService, private ble: BLE, private dialogRef: MatDialogRef<DialogScanBluetoothComponent>, private platform: Platform, private ngZone: NgZone) {
    this.platform.ready().then(() => {
      this.scan();
      console.log('scanning...')
      this.dialogRef.afterClosed().subscribe(() => {
        this.bluetoothService.stopScan();
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
    this.devices = [];
    $('#matSpinner').show()
    this.detectChange.detectChanges();
    console.log(this.devices)
    this.bluetoothService.detectedValue.subscribe((value) => {
      if (value !== null) {
        this.devices.push(value);
        this.detectChange.detectChanges();
      }
    }, (err) => console.log(err))

    this.bluetoothService.scanBLE(15000).then((scanList: []) => {
      $('#matSpinner').hide()
      console.log('LISTA')
      console.log(this.devices)
    });
  }
  connect(i) {
    console.log(i);
    $('#matSpinner' + i).css('display', 'flex')
    this.bluetoothService.connectDevice(this.devices[i]).then((peripheralData) => {
      $('#matSpinner' + i).hide();
      this.data = peripheralData;
      console.log(peripheralData)
      this.closeDialog();
    }, (err) => {
      $('#matSpinner' + i).hide();
      this.data = '';
      console.log(err);
      alert('Error' + err.errorMessage)
    });
  }

  closeDialog() {
    this.ngZone.run(() => {
      this.bluetoothService.stopScan();
      this.dialogRef.close(this.data);
      console.log('closeDIalog')
    })
  }
  ngOnInit() { }

}
