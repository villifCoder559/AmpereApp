import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-modify-name',
  templateUrl: './dialog-modify-name.component.html',
  styleUrls: ['./dialog-modify-name.component.scss'],
})
export class DialogModifyNameComponent implements OnInit {
  name;
  constructor(@Inject(MAT_DIALOG_DATA) public dato, public dialogRef: MatDialogRef<DialogModifyNameComponent>) {
    console.log(dato)
  }
  action(action) {
    if (action === 'yes') {
      this.dato.name = this.name;
      this.dialogRef.close({ value: this.dato })
    }
  }
  ngOnInit() {

  }

}
