import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaqPageRoutingModule } from './faq-routing.module';
import {TourMatMenuModule} from 'ngx-ui-tour-md-menu'
import { FaqPage } from './faq.page';
import { MaterialModule } from '../../material-module'
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaqPageRoutingModule,
    MaterialModule,
    TranslateModule.forChild(),
    TourMatMenuModule
  ],
  declarations: [FaqPage]
})
export class FaqPageModule {}
