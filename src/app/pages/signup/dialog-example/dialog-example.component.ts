import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from'@angular/material/dialog'
interface Contact{
  name:'',
  number:''
}
@Component({
  selector: 'app-dialog-example',
  templateUrl: './dialog-example.component.html',
  styleUrls: ['./dialog-example.component.scss'],
})
export class DialogExampleComponent implements OnInit {
  myContacts=[
    {
      name:'pol',
      number:'12345555'
    },{
      name:'Aliss',
      number:'1249855'
    },{
      name:'sdgf',
      number:'7654123'
    },{
      name:'Pasq',
      number:'129852185'
    }
  ];
  selectedOptions;
  constructor(@Inject(MAT_DIALOG_DATA) public data:Contact) { 
    console.log(this.data);
  }

  ngOnInit() {
  }
  save_data(){
    this.data=this.selectedOptions[0];
    console.log(this.data)
  }
}
