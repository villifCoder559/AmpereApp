import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MaterialModule} from 'src/app/material-module'
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule} from '@angular/forms';

import { RegistrationS4cPageRoutingModule } from './registration-s4c-routing.module';
import { RegistrationS4cPage } from './registration-s4c.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrationS4cPageRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [RegistrationS4cPage]
})
export class RegistrationS4cPageModule {}
