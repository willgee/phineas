import { Component, OnInit, AfterContentInit } from '@angular/core';
import { loadModules } from 'esri-loader';

@Component({
  selector: 'app-geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.css']
})
export class GeoComponent implements OnInit, AfterContentInit {

  constructor() { }

  generateMap() {
    loadModules(['esri/views/MapView', 'esri/WebMap'])
      .then(([MapView, WebMap]) => {
        // then we load a web map from an id
        var webmap = new WebMap({
          portalItem: { // autocasts as new PortalItem()
            id: 'f2e9b762544945f390ca4ac3671cfa72'
          }
        });
        // and we show that map in a container w/ id #viewDiv
        var view = new MapView({
          map: webmap,
          container: 'map-view'
        });
      })
      .catch(err => {
        // handle any errors
        console.error(err);
      });
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.generateMap();
  }

}
