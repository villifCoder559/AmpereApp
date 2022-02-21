import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-save',
  templateUrl: './dialog-save.component.html',
  styleUrls: ['./dialog-save.component.scss'],
})
export class DialogSaveComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogSaveComponent>) { }
  close(resp){
    this.dialogRef.close({value:resp});
  }
  ngOnInit() { }

}
