import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-modify-name',
  templateUrl: './dialog-modify-name.component.html',
  styleUrls: ['./dialog-modify-name.component.scss'],
})
export class DialogModifyNameComponent implements OnInit {
  name;
  constructor(@Inject(MAT_DIALOG_DATA) public dato) {
    console.log(dato)
  }
  log(value){
    this.dato=value
  }
  ngOnInit() {

  }

}
