import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { GeoComponent } from './geo/geo.component';
import { DataComponent } from './data/data.component';
import { NlpComponent } from './nlp/nlp.component';
import { VizComponent } from './viz/viz.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: WelcomeComponent },
  { path: 'geo', component: GeoComponent },
  { path: 'data', component: DataComponent },
  { path: 'nlp', component: NlpComponent },
  { path: 'viz', component: VizComponent },
  { path: 'search', component: SearchComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
