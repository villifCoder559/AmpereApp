import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Emergency_Contact } from '../../../data/shared-data.service'
import { Contacts, ContactName, ContactField } from '@ionic-native/contacts';
import { LoadingController } from '@ionic/angular';

/*fix search name 
  fix view list of contact */

interface Contact {
  name: string,
  number: string
}
@Component({
  selector: 'app-dialog-example',
  templateUrl: './dialog-example.component.html',
  styleUrls: ['./dialog-example.component.scss'],
})

export class DialogExampleComponent implements OnInit {
  loadedContacts = [];
  /*{
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
  }*/
  myContacts = [];
  selectedOptions;
  enableMatSpinner = true;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Contact, private contacts: Contacts, private changeDetection: ChangeDetectorRef, private loadingController: LoadingController) {
    this.import_from_addressBook();
    // this.loadedContacts.forEach(element => {
    //   this.myContacts.push(element)
    // });
    // this.myContacts = this.loadedContacts;    
  }
  import_from_addressBook() {
    let options = {
      filter: '',
      hasPhoneNumber: true,
      multiple: true
    }
    this.contacts.find(['*'], options).then((contacts) => {
      contacts.forEach(element => {
        var app: Contact = {
          name: '',
          number: ''
        }
        app.name = element?.displayName?.toString();
        var phoneNumbers_noDuplicates = [Array.from(new Set(element.phoneNumbers))]
        phoneNumbers_noDuplicates.forEach(number => {
          app.number = number[0]?.value;
          this.myContacts.push(app)
          this.loadedContacts.push(app)
        });
      });
      $('#matSpinner').hide();
      $('.mat-dialog-content').css('justify-content', 'flex-start')
      console.log(this.myContacts);
    }, (err) => {
      $('#matSpinner').hide();
      alert(err);
    });
  }
  intervall = null;
  find_contact(ev) {
    if (this.intervall != null)
      clearTimeout(this.intervall);
    $('#spinnerInput').css('visibility', 'visible')
    this.intervall = setTimeout(() => {
      if (ev == '') {
        this.myContacts = this.loadedContacts;
      }
      else {
        this.myContacts = []
        this.loadedContacts.every((a, b, c) => {
          c.forEach(element => {
            var split_displayName = element?.name?.split(' ');
            //console.log(split_displayName)
            var found = false;
            for (var i = 0; !found && i < split_displayName?.length; i++) {
              if (split_displayName[i]?.toLocaleLowerCase().startsWith(ev.toLocaleLowerCase())) {
                this.myContacts.push(element)
                found = true;
              }
            }
          });
        })
      }
      $('#spinnerInput').css('visibility', 'hidden');
    }, 1200)

  }
  ngOnInit() {
  }
  save_data() {
    this.data = this.selectedOptions[0];
    console.log(this.data)
  }
}
