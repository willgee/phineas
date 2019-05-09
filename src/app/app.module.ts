import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DataComponent } from './data/data.component';
import { VizComponent } from './viz/viz.component';
import { GeoComponent } from './geo/geo.component';
import { SearchComponent } from './search/search.component';
import { NlpComponent } from './nlp/nlp.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    DataComponent,
    VizComponent,
    GeoComponent,
    SearchComponent,
    NlpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
