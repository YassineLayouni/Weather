import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { City } from './Classes/City';
import maplibregl,{GeolocateControl} from 'maplibre-gl';

@Injectable({
  providedIn: 'root'
})
export class CityService implements OnInit {


  constructor(private http : HttpClient) { }

  ngOnInit(): void {
    


      let geolocate = new GeolocateControl({});
      geolocate.on('geolocate',function(e) {
        console.log(e.coords.longitude, e.coords.latitude);
      }
      //this._getCityWeather(e.coords.longitude, e.coords.latitude);
      );
  }

  followedCitiesSubject = new BehaviorSubject<City | undefined>(undefined);
  
  numberOfAutocomple : number = 2;

  _searchCity(cityName : string){
    return this.http.get<City>(`https://nominatim.openstreetmap.org/search/${cityName}?format=json&addressdetails=1&limit=${this.numberOfAutocomple}`);
  }

  _getCityWeather(lat : number,lon : number){
    return this.http.get<City>(`http://localhost:5002/weather/${lat}/${lon}`);
  }

  selectedCity : City | undefined;

  _getCurrentCity(){
    if(this.selectedCity == undefined){
      navigator.geolocation.getCurrentPosition((position) => {
        this.selectedCity = new City({lat : position.coords.latitude, lon : position.coords.longitude});
        console.log(this.selectedCity);
      });
    }
  }


}
