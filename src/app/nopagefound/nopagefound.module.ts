import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NopagefoundComponent} from "./nopagefound.component";



@NgModule({
  declarations: [
    NopagefoundComponent,
  ],
  imports: [
    CommonModule
  ],
  exports:[
    NopagefoundComponent
  ]
})
export class NopagefoundModule { }
