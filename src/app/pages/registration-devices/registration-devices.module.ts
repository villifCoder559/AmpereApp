import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationDevicesPageRoutingModule } from './registration-devices-routing.module';

import { RegistrationDevicesPage } from './registration-devices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrationDevicesPageRoutingModule
  ],
  declarations: [RegistrationDevicesPage]
})
export class RegistrationDevicesPageModule {}
