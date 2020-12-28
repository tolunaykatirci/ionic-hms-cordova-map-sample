import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HMSMap, HuaweiMap, LatLng, MarkerOptions, Color, PatternItemType, CircleOptions, PolylineOptions, MapEvent } from '@ionic-native/hms-map/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private map: HuaweiMap;

  constructor(private hmsMap: HMSMap, public alertController: AlertController, private router: Router) { }

  ionViewDidEnter() {
    console.log("ionViewDidEnter: HomePage");
    if(this.map)
      this.hmsMap.showMap('hms-map');
    else
      this.initMap();
  }

  ionViewDidLeave() {
    console.log("ionViewDidLeave: HomePage");
    if(this.map)
      this.map.hideMap();
  }

  ngOnDestroy() {
    console.log("ngOnDestroy: HomePage");
    if(this.map)
      this.map.destroyMap();
  }

  initMap() {
    this.hmsMap.requestPermission();
    const mapOptions = {
      cameraPosition: {
        target: {
          lat: 41.015137,
          lng: 28.979530
        },
        zoom: 7
      }
    }
    this.hmsMap.getMap('hms-map', mapOptions).then((map) => {
      this.map = map;
      console.log('Map Initialized!');

      this.addEvents();
    
      this.map.setInfoWindowAdapter({"file":"www/assets/marker-info.html","width":100,"height":45});

      this.addMarker(this.map, { lat: 41.1146480, lng: 29.0150539 }, "Marker 1");
      this.addMarker(this.map, { lat: 41.0048489, lng: 28.9573845 }, "Marker 2");
      this.addMarker(this.map, { lat: 40.9159842, lng: 29.2235740 }, "Marker 3");

      this.drawMap();

    }).catch(e => console.log('Map Initialize error: ' + JSON.stringify(e)));

  }

  addMarker(map: HuaweiMap, location: LatLng, extraInfo) {
    const options: MarkerOptions = {
      position: location,
      clusterable: true,
      icon: {
        asset: {
          fileName: "www/assets/icon/custom_marker.png",
          scaledSize: {
            width: 110,
            height: 110
          }
        }
      }
    };
    map.addMarker(options).then((marker) => {
      marker.setTag(extraInfo);
    });
  }

  drawMap() {
    const circleOptions: CircleOptions = {
      center: { lat:41.028878, lng:29.117293 }, 
      radius: 10000
    }
    this.map.addCircle(circleOptions).then((circle) => {
      //circle.setFillColor(Color.GREEN);
    });

    const polylineOptions: PolylineOptions = {
        points: [
          {lat: 41.295336, lng: 28.726243}, 
          {lat: 41.098922, lng: 30.117667},
          {lat: 40.201871, lng: 28.925484},
        ],
        color: Color.RED,
        width: 5.0
    }
    this.map.addPolyline(polylineOptions).then((polyline) => {
      const linePattern = [
        {type: PatternItemType.TYPE_DASH, length: 30},
        {type: PatternItemType.TYPE_GAP,  length: 10},
        {type: PatternItemType.TYPE_DOT,  length: 10},
        {type: PatternItemType.TYPE_GAP,  length: 10}
      ]; 
      // -- . -- . -- . -- . -- . -- .  
      polyline.setPattern(linePattern);
    });
  }

  addEvents() {
    this.map.on(MapEvent.ON_MAP_CLICK, (res) => {
      console.log("Map Clicked: " + JSON.stringify(res));
    });

    this.map.on(MapEvent.ON_MARKER_CLICK, (marker) => {
      console.log("Marker Clicked: " + JSON.stringify(marker));
      if(marker.isInfoWindowShown()) 
          marker.showInfoWindow();
    });
  }

  clickElement() {
    console.log('Map overlapping element clicked.');
    //this.presentAlert();
    this.navigateDetails();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'map-overlap',
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }

  navigateDetails() {
    this.router.navigate(['/details'])
  }

}
