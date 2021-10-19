import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignupPageRoutingModule } from './signup-routing.module';
import { SignupPage } from './signup.page';
import { MaterialModule } from '../../material-module'
import { DialogExampleComponent } from './dialog-example/dialog-example.component';
import { HttpClientModule } from '@angular/common/http';
import {Contacts} from '@ionic-native/contacts/ngx'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignupPageRoutingModule,
    MaterialModule,
    HttpClientModule
  ],
  declarations: [SignupPage,DialogExampleComponent],
  providers:[Contacts],
  entryComponents:[DialogExampleComponent]
})
export class SignupPageModule {}
