import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Emergency_Contact } from '../../../data/shared-data.service'
interface Contact {
  name: '',
  number: ''
}
@Component({
  selector: 'app-dialog-example',
  templateUrl: './dialog-example.component.html',
  styleUrls: ['./dialog-example.component.scss'],
})
/* Add loading while search contacts OK*/
export class DialogExampleComponent implements OnInit {
  loadedContacts = [
    {
      name: 'pol',
      number: '12345555'
    }, {
      name: 'Aliss',
      number: '1249855'
    }, {
      name: 'sdgf',
      number: '7654123'
    }, {
      name: 'Pasq',
      number: '129852185'
    },   {
      name: 'pol',
      number: '12345555'
    }, {
      name: 'Aliss',
      number: '1249855'
    }, {
      name: 'sdgf',
      number: '7654123'
    }, {
      name: 'Pasq',
      number: '129852185'
    },   {
      name: 'pol',
      number: '12345555'
    }, {
      name: 'Aliss',
      number: '1249855'
    }, {
      name: 'sdgf',
      number: '7654123'
    }, {
      name: 'Pasq',
      number: '129852185'
    }
  ]
  myContacts= [];
  selectedOptions;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Contact, private changeDetection: ChangeDetectorRef) {
    console.log(this.data);
    this.loadedContacts.forEach(element => {
      this.myContacts.push(element)
    });
    // this.myContacts = this.loadedContacts
  }
  find_contact(ev) {
    console.log(ev);
    this.myContacts=[]
    this.loadedContacts.every((a, b, c)=> {
      console.log("a->", a);
      console.log("b->", b);
      console.log("c->", c);
      c.forEach(element => {
        if (element.name.toLocaleLowerCase().startsWith(ev)) {
          this.myContacts.push(element)
          console.log(element)
        }
      });
    })
  }
  ngOnInit() {
  }
  save_data() {
    this.data = this.selectedOptions[0];
    console.log(this.data)
  }
}
