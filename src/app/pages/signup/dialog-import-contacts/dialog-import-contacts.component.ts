import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Contacts, ContactName, ContactField } from '@ionic-native/contacts';
import { LoadingController } from '@ionic/angular';

/*fix search name 
  fix view list of contact */

interface Contact {
  name: string,
  number: string
}
@Component({
  selector: 'app-dialog-import-contacts',
  templateUrl: './dialog-import-contacts.component.html',
  styleUrls: ['./dialog-import-contacts.component.scss'],
})
export class DialogImportContactsComponent implements OnInit {

  loadedContacts = [];
  myContacts = [];
  selectedOptions;
  enableMatSpinner = true;
  constructor(@Inject(MAT_DIALOG_DATA) public data, private dialog: MatDialogRef<DialogImportContactsComponent>, private contacts: Contacts, private changeDetection: ChangeDetectorRef, private loadingController: LoadingController) {
    console.log(this.data)
    this.import_from_addressBook();
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
      $('.mat-dialog-content').css('justify-content', 'flex-start');
      $('#selectionList').css("width", "100%");
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
    console.log(this.selectedOptions[0])
    var app = this.selectedOptions[0].name.split(' ');
    var value = { name: '', surname: '', number: '' };
    value.name = app.splice(0, 1)[0]
    value.surname = app.join(' ')
    value.number = this.selectedOptions[0].number.replace('(','').replace(')','');
    console.log('value')
    console.log(value)
    this.dialog.close({ contact: value })
  }

}
