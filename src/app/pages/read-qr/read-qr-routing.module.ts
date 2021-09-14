import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadQRPage } from './read-qr.page';

const routes: Routes = [
  {
    path: '',
    component: ReadQRPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadQRPageRoutingModule {}
