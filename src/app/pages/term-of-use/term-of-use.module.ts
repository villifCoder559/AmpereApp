import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermOfUsePageRoutingModule } from './term-of-use-routing.module';

import { TermOfUsePage } from './term-of-use.page';
import { MaterialModule } from '../../material-module'
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermOfUsePageRoutingModule,
    MaterialModule,
    TranslateModule.forChild()

  ],
  declarations: [TermOfUsePage]
})
export class TermOfUsePageModule {}
