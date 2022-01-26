import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WebpagePageRoutingModule } from './webpage-routing.module';

import { WebpagePage } from './webpage.page';

import { MaterialModule } from '../../material-module'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebpagePageRoutingModule,
    MaterialModule
  ],
  declarations: [WebpagePage]
})
export class WebpagePageModule {}
