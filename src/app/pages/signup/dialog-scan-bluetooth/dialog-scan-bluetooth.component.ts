import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BLE } from '@ionic-native/ble/ngx';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-dialog-scan-bluetooth',
  templateUrl: './dialog-scan-bluetooth.component.html',
  styleUrls: ['./dialog-scan-bluetooth.component.scss'],
})
export class DialogScanBluetoothComponent implements OnInit {
  devices = [];
  selectedOptions
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ble: BLE, private dialogRef: MatDialogRef<DialogScanBluetoothComponent>, private platform: Platform, private ngZone: NgZone) {
    this.platform.ready().then(() => {
      this.scan();
      this.dialogRef.afterClosed().subscribe(()=>{
        this.ble.stopScan();
        console.log('stopScanning')
      })
    })

  }
  // scan(){
  //   this.devices.push({id:'sddfwfsfsfsffgrg',name:'Pippo'})
  //   this.devices.push({id:'sggfgsddsvv',name:'Pluto'})
  //   this.devices.push({id:'fdgdfvd',name:'Pape'})
  //   this.devices.push({id:'ngmgmgmmghm ',name:'Rino'})
  //   this.devices.push({id:'3456ruj2',name:'TOpo'})
  //   $('#matSpinner').hide();
  // }
  scan() {// ble.enale() only supported for android
    this.ble.isEnabled().then(() => { }, (err) => this.ble.enable())
      .then(() => {
        var array = []
        this.ble.startScanWithOptions([], { reportDuplicates: false }).subscribe(device => {
          array.push(device)
          console.log(JSON.stringify(device));
        }, (err) => console.log(err));
        setTimeout(() => {
          this.devices = array;
          this.ble.stopScan();
          $('#matSpinner').hide();
          console.log('stopScan')
        }, 15000);
      });
  }
  connect(i) {
    console.log(i);
    // $('#matSpinner').hide();
    $('#matSpinner' + i).css('display', 'flex')
    this.data = this.devices[i];
    this.ble.connect(this.data.id).subscribe((peripheralData) => {
      $('#matSpinner' + i).hide();
      console.log(peripheralData)
      this.data = peripheralData;
      this.closeDialog();
    }, (err) => {
      console.log(err)
      $('#matSpinner' + i).hide();
    })
  }
  closeDialog() {
    this.ngZone.run(() => {
      this.dialogRef.close(this.data);
      console.log('closeDIalog')
    })

  }
  ngOnInit() { }

}
