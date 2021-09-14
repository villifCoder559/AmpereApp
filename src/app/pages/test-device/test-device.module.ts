import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestDevicePageRoutingModule } from './test-device-routing.module';

import { TestDevicePage } from './test-device.page';
import { MaterialModule } from '../../material-module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestDevicePageRoutingModule,
    MaterialModule
  ],
  declarations: [TestDevicePage]
})
export class TestDevicePageModule {}
