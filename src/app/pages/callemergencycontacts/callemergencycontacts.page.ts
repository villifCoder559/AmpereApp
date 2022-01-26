import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/data/shared-data.service';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx'
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-callemergencycontacts',
  templateUrl: './callemergencycontacts.page.html',
  styleUrls: ['./callemergencycontacts.page.scss'],
})
export class CallemergencycontactsPage implements OnInit {
  formGroup = this._formBuilder.group({
    contact0name: [''],
    contact0number: [''],
    contact1name: [''],
    contact1number: [''],
    contact2name: [''],
    contact2number: [''],
    contact3name: [''],
    contact3number: [''],
    contact4name: [''],
    contact4number: [''],
  });
  constructor(public shared_data:SharedDataService,private callNumber: CallNumber,private _formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(this.shared_data.user_data)
  }
  call(contact){
    this.callNumber.callNumber(contact.number,true).then(()=>{
      console.log('launch dialer')
    },err=>alert('error launching dialer'))
  }
}
