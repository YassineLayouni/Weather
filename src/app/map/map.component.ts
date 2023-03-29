import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CityService } from '../city.service';
import { UserService } from '../user.service';
import { MapComponent as Map1 } from '@maplibre/ngx-maplibre-gl';
import maplibregl,{Map,NavigationControl ,Marker, GeolocateControl, FullscreenControl} from 'maplibre-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(public userService:UserService, public cityService : CityService) { 
    this.userService.showMenu = true;
    this.cityService.followedCitiesSubject.subscribe(() => {
      this.addSearchedCities();
  });
  }



  //@ViewChild(`map`) map1: Map1 | undefined;
  @ViewChild(`map`) mapContainer!: ElementRef<HTMLElement>;
  map!: Map;
  initialState = { lng: 139.753, lat: 35.6844, zoom: 14 };

  initMap(){
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets/style.json?key=TQUed2PX6IF7nMlESPX8`,
      center: [this.initialState.lng, this.initialState.lat],
      zoom: this.initialState.zoom
    });

    this.addSearchedCities();

    this.map.addControl(new FullscreenControl({}), 'top-right');
    this.map.addControl(new NavigationControl({}), 'top-right');
    this.map.addControl(new GeolocateControl({}), 'top-right');
  }

  public addSearchedCities(){
    let city = this.cityService.followedCitiesSubject.getValue();
    if(city != undefined){
      new Marker({color: "rgb(235, 81, 129)"})
      .setLngLat([city?.lon!,city?.lat!])
      .addTo(this.map);
  
      this.map.flyTo({
        center: [
          city.lon!,
          city.lat!
        ],
        zoom : 10,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    }
  }

  ngAfterViewInit() : void{
    this.initMap();
  }

  ngOnInit(): void {
    maplibregl.setRTLTextPlugin(
      'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
      ()=>{},
      true// Lazy load the plugin
      );
  }

}
