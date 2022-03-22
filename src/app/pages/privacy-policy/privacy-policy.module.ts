import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivacyPolicyPageRoutingModule } from './privacy-policy-routing.module';

import { PrivacyPolicyPage } from './privacy-policy.page';
import { MaterialModule } from '../../material-module'
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacyPolicyPageRoutingModule,
    MaterialModule,
    TranslateModule.forChild()
  ],
  declarations: [PrivacyPolicyPage]
})
export class PrivacyPolicyPageModule {}
