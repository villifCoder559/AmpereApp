import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallemergencycontactsPageRoutingModule } from './callemergencycontacts-routing.module';

import { CallemergencycontactsPage } from './callemergencycontacts.page';
import { MaterialModule } from '../../material-module'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    CallemergencycontactsPageRoutingModule
  ],
  declarations: [CallemergencycontactsPage]
})
export class CallemergencycontactsPageModule {}
