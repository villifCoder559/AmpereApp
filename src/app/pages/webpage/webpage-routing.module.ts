import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebpagePage } from './webpage.page';

const routes: Routes = [
  {
    path: '',
    component: WebpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebpagePageRoutingModule {}
