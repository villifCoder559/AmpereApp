import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermOfUsePage } from './term-of-use.page';

const routes: Routes = [
  {
    path: '',
    component: TermOfUsePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermOfUsePageRoutingModule {}
