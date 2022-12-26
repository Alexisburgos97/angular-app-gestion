import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {PagesModule} from "./pages/pages.module";
import {AuthModule} from "./auth/auth.module";
import {NopagefoundModule} from "./nopagefound/nopagefound.module";

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    AuthModule,
    NopagefoundModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
