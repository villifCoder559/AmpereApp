import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowAlertPage } from './show-alert.page';

const routes: Routes = [
  {
    path: '',
    component: ShowAlertPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowAlertPageRoutingModule {}
