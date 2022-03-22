import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LanguagePopoverPageRoutingModule } from './language-popover-routing.module';

import { LanguagePopoverPage } from './language-popover.page';
import { MaterialModule } from 'src/app/material-module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LanguagePopoverPageRoutingModule,
    MaterialModule
  ],
  declarations: [LanguagePopoverPage]
})
export class LanguagePopoverPageModule {}
