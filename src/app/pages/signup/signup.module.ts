import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignupPageRoutingModule } from './signup-routing.module';
import { SignupPage } from './signup.page';
import { MaterialModule } from '../../material-module'
//import { HttpClientModule } from '@angular/common/http';
import { Contacts } from '@ionic-native/contacts/ngx'
import { DialogScanBluetoothComponent } from './dialog-scan-bluetooth/dialog-scan-bluetooth.component';
import { BLE } from '@ionic-native/ble/ngx'
import { DialogAddEmergencyContactComponent } from './dialog-add-emergency-contact/dialog-add-emergency-contact.component';
import { DialogSaveComponent } from './dialog-save/dialog-save.component'
import { DialogModifyNameComponent } from './dialog-modify-name/dialog-modify-name.component';
import { DialogImportContactsComponent } from './dialog-import-contacts/dialog-import-contacts.component';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignupPageRoutingModule,
    MaterialModule,
    //HttpClientModule,
    TranslateModule.forChild()

  ],
  declarations: [SignupPage, DialogModifyNameComponent, DialogImportContactsComponent, DialogScanBluetoothComponent, DialogAddEmergencyContactComponent, DialogSaveComponent],
  providers: [Contacts, BLE,Geolocation],
  //entryComponents: [DialogExampleComponent, DialogScanBluetoothComponent,DialogSaveComponent]
})
export class SignupPageModule { }
