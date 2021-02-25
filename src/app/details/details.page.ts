import { Component, OnInit } from '@angular/core';
import { HMSMap, HuaweiMap } from '@hmscore/ionic-native-hms-map/ngx';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  detailsMap: HuaweiMap;

  constructor(private hmsMap: HMSMap) { }

  ngOnInit() {
    console.log("ngOnInit: DetailsPage");
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter: DetailsPage");
    if(this.detailsMap)
      this.hmsMap.showMap('hms-map');
    else
      this.initMap();
  }

  ionViewDidLeave() {
    console.log("ionViewDidLeave: DetailsPage");
    if(this.detailsMap)
      this.detailsMap.hideMap();
  }

  ngOnDestroy() {
    console.log("ngOnDestroy: DetailsPage");
    if(this.detailsMap)
      this.detailsMap.destroyMap();
  }

  async initMap() {
    this.hmsMap.requestPermission();
    const mapOptions = {
      cameraPosition: {
        target: {
          lat: 41.015137,
          lng: 28.979530
        },
        zoom: 5
      }
    }
    this.detailsMap = await this.hmsMap.getMap('details-map', mapOptions);
    console.log('Map Initialized!');
  }

  scrollMap() {
    this.detailsMap.scroll();
  }

}
