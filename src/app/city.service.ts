import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { City } from './Classes/City';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http : HttpClient) { }

  followedCitiesSubject = new BehaviorSubject<City | undefined>(undefined);
  
  numberOfAutocomple : number = 2;

  _searchCity(cityName : string){
    return this.http.get<City>(`https://nominatim.openstreetmap.org/search/${cityName}?format=json&addressdetails=1&limit=${this.numberOfAutocomple}`);
  }
}
