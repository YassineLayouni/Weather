import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CityService } from '../city.service';
import { UserService } from '../user.service';
import { MapComponent as Map1 } from '@maplibre/ngx-maplibre-gl';
import maplibregl,{Map,NavigationControl ,Marker, GeolocateControl, FullscreenControl, MapMouseEvent, Popup} from 'maplibre-gl';
import { City } from '../Classes/City';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  loading : Boolean = false;
  selectedCity! : City;
  constructor(public userService:UserService, public cityService : CityService) { 
    this.userService.showMenu = true;
    this.cityService.searchedCity.subscribe(() => {
      this.addSearchedCity();
  });
  }



  //@ViewChild(`map`) map1: Map1 | undefined;
  @ViewChild(`map`) mapContainer!: ElementRef<HTMLElement>;
  @ViewChild(`cityDetails`) cityDetails!: ElementRef<HTMLElement>;
  map!: Map;
  initialState = { lng: 139.753, lat: 35.6844, zoom: 14 };
  


  initMap(){
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets/style.json?key=TQUed2PX6IF7nMlESPX8`,
      center: [this.initialState.lng, this.initialState.lat],
      zoom: this.initialState.zoom
    });

    this.addSearchedCity();

    this.map.addControl(new FullscreenControl({}), 'top-right');
    this.map.addControl(new NavigationControl({}), 'top-right');
    this.map.addControl(new GeolocateControl({}), 'top-right');
  }

  public async addSearchedCity(){
    let city = this.cityService.searchedCity.getValue();
    let popup!: Popup;
    let marker! : Marker;

    this.loading = true;
    if(city != undefined){
      this.cityService._getCityWeather(city?.lat!,city?.lon!).subscribe((data : any)=>{
        this.loading = false;
        this.selectedCity = new City({
          name : city?.name,
          lat : data.Corrd.lat,
          lon : data.Corrd.lon,
          country : city?.country,
          humidity : data.Humidity,
          temp : data.Temp,
          windDirection : data.Wind_Dir,
          windSpeed : data.Wind_Speed,
          pressure : data.Pressure
        })
      })

      popup = new Popup({closeButton : false, closeOnClick : true})
      .setDOMContent(this.cityDetails.nativeElement)


      marker = new Marker({color: "rgb(235, 81, 129)"})
      .setLngLat([city?.lon!,city?.lat!])
      .setPopup(popup)
      .addTo(this.map)
  
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






  popupString(city : City){

  return `<div class="cityName">${city.name}</div> ` +
  '<div class="cityDetails">' +
      '<div class="cityDetail">' +
          `<span class="detail">Country</span>`+
          `<span class="detailValue">${city.country}</span>`+
      '</div>'+
      '<div class="cityDetail">'+
          '<span class="detail">Temp</span>'+
          `<span class="detailValue">${city.temp}˚C</span>`+
      '</div>'+
      '<div class="cityDetail">'+
          '<span class="detail">Clouds</span>'+
          `<span class="detailValue">${city.clouds}%</span>`+
      '</div>'+
      '<div class="cityDetail">'+
          '<span class="detail">Humidity</span>'+
          `<span class="detailValue">${city.humidity}%</span>`+
      '</div>'+
      '<div class="cityDetail">'+
          '<span class="detail">Pressure</span>'+
          `<span class="detailValue">${city.pressure}hPa</span>`+
      '</div>'+
      '<div class="cityDetail">'+
          '<span class="detail">Wind Direction</span>'+
          `<span class="detailValue">${city.windDirection}˚</span>`+
      '</div>'+
      '<div class="cityDetail">'+
          '<span class="detail">Wind Speed</span>'+
          `<span class="detailValue">${city.windSpeed}m/s</span>`+
      '</div>'+
      '<button mat-raised-button color="accent" id="AddCity">Add City</button>'+
  '</div>'

  }

}
