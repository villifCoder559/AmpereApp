import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadNFCPage } from './read-nfc.page';

const routes: Routes = [
  {
    path: '',
    component: ReadNFCPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadNFCPageRoutingModule {}
