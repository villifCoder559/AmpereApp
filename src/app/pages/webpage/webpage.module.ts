import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WebpagePageRoutingModule } from './webpage-routing.module';

import { WebpagePage } from './webpage.page';

import { MaterialModule } from '../../material-module'
import { SafePipe } from 'src/app/app.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebpagePageRoutingModule,
    MaterialModule
  ],
  declarations: [WebpagePage,SafePipe]
})
export class WebpagePageModule {}
