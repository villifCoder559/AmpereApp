import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CallemergencycontactsPageRoutingModule } from './callemergencycontacts-routing.module';
import { CallemergencycontactsPage } from './callemergencycontacts.page';
import { MaterialModule } from '../../material-module'
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx'
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    ReactiveFormsModule,
    CallemergencycontactsPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [CallemergencycontactsPage],
  providers:[CallNumber]
})
export class CallemergencycontactsPageModule {}
