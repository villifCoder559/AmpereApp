import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Emergency_Contact, SharedDataService } from '../../../data/shared-data.service';
import { SpecialCharValidator } from '../signup.page';
import { DialogImportContactsComponent } from '../dialog-import-contacts/dialog-import-contacts.component'
@Component({
  selector: 'app-dialog-add-emergency-contact',
  templateUrl: './dialog-add-emergency-contact.component.html',
  styleUrls: ['./dialog-add-emergency-contact.component.scss'],
})
export class DialogAddEmergencyContactComponent implements OnInit {
  contactCard = this._formBuilder.group({
    contactName: ['', Validators.compose([Validators.required,SpecialCharValidator.specialCharValidator])],
    contactSurname: ['', Validators.compose([Validators.required,SpecialCharValidator.specialCharValidator])],
    contactNumber: ['', Validators.compose([SpecialCharValidator.specialCharValidator,Validators.required, Validators.minLength(7), Validators.pattern('[- + 0-9]+')])]
  });
  contact = {
    name: '',
    surname: '',
    number: ''
  }
  getContactFromForm() {
    this.contact.name = this.contactCard.get('contactName').value;
    this.contact.surname = this.contactCard.get('contactSurname').value;
    this.contact.number = this.contactCard.get('contactNumber').value;
  }
  setContact(contact) {
    this.contactCard.get('contactName').setValue(contact.name);
    this.contactCard.get('contactSurname').setValue(contact.surname);
    this.contactCard.get('contactNumber').setValue(contact.number);
    this.contact.name = contact.name;
    this.contact.surname = contact.surname;
    this.contact.number = contact.number;
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogAddEmergencyContactComponent>, private _formBuilder: FormBuilder, public dialog: MatDialog, private shared_data: SharedDataService) {

  }
  openDialogFromContacts(): void {
    const dialogRef = this.dialog.open(DialogImportContactsComponent, {
      maxWidth: '90vw',
      minWidth: '40vw',
      data: {
        contact: { name: '', surname: '', number: '' }
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('RESULT_FROM_CONTACTS')
      console.log(result)
      if (result.contact?.name != undefined && result.contact?.surname != undefined && result.contact?.number != undefined)
        this.setContact(result.contact)
    });
  }
  save() {
    var ok = true
    Object.keys(this.contactCard.controls).forEach((key) => {
      var controlErrors = this.contactCard.get(key).errors;
      if (controlErrors)
        ok = false;
    })
    if (ok) {
      console.log('VALUE_CONFIRM')
      console.log(this.data)
      this.getContactFromForm()
      this.dialogRef.close({ data: this.contact, index: this.data.index });
    }
  }
  ngOnInit() {
    console.log('DATA_FROM_SIGNUP')
    console.log(this.data)
    if (this.data.index != -1) {
      this.setContact(this.data.contact)
    }
  }
}