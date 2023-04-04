import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { City } from './Classes/City';
import maplibregl,{GeolocateControl} from 'maplibre-gl';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class CityService implements OnInit {

  selectedCity : City | undefined;
  selectedDate : Date = new Date();
  currentDate : Date = new Date();
  selectedCityForecast : any;
  maxTemp : number = 0;
  minTemp : number = 0;

  chanceOfRain : any[] = [];
  temp : any[] = [
  {"name": "Temperature","series" : []},
];

pressure : any[] = [
  {"name": "Pressure","series" : []},
];

humidity : any[] = [
  {"name": "Humidity","series" : []},
];

speed : any[] = [
  {"name": "Wind Speed","series" : []},
];

deg : any[] = [
  {"name": "Wind Direction","series" : []}
];

  days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]

  forecastDays : any = [];

  constructor(private http : HttpClient, public globalService : GlobalService) { }

  ngOnInit(): void {}

  searchedCity = new BehaviorSubject<City | undefined>(undefined);
  
  numberOfAutocomple : number = 2;

  _searchCity(cityName : string){
    return this.http.get<City>(`https://nominatim.openstreetmap.org/search/${cityName}?format=json&addressdetails=1&limit=${this.numberOfAutocomple}`);
  }

  _getCityWeather(lat : number,lon : number){
    return this.http.get<City>(`http://localhost:5002/weather/${lat}/${lon}`);
  }

  _getCityForecast(lat : number,lon : number){
    return this.http.get<any>(`http://localhost:5002/forecast/${lat}/${lon}`);
  }

  _getCityImage(country : String){
    //4xadNkf603ll4Wug2RCpUJd0j9GL4XslFsysCvCae8lAhnGpUpcr79QR
    return this.http.get<any>(`https://api.pexels.com/v1/search?query=${country} Landmark Horizontal&per_page=1`)
  }

  _getCityDate(lat : number,lon : number){
    return this.http.get<any>(`https://api.api-ninjas.com/v1/worldtime?lat=${lat}&lon=${lon}`,{headers : {
      "x-api-key" : "fmjDaOP1c1d3sLyIh+dkyw==kVVXalSoAIefHlm0"
    }})
  }

  getCurrentDate(lat : number, lon : number){
    this._getCityForecast(lat, lon).subscribe((data:any)=>{
      //this.selectedDate = new Date(Date.parse(data.dateTime));
      console.log(this.selectedCity);
      console.log(data);
    });
  }


  getCurrentCity(){
    if(this.selectedCity == undefined){
      navigator.geolocation.getCurrentPosition((position) => {
        this.getCity(position.coords.latitude, position.coords.longitude);
      });
    }
  }

  getCity(lat : number, lon : number){
    this.selectedCity = undefined;
    this.selectedCityForecast = undefined;
    this._getCityWeather(lat, lon).subscribe((data:any)=>{
      this.selectedCity = new City({
        name : data.City,
        lat : data.Corrd.lat,
        lon : data.Corrd.lon,
        country : data.Country,
        humidity : data.Humidity,
        temp : data.Temp,
        windDirection : data.Wind_Dir,
        windSpeed : data.Wind_Speed,
        pressure : data.Pressure
      })
    });
    this._getCityDate(lat,lon).subscribe((data:any)=>{
      this.selectedDate, this.currentDate = new Date(Date.parse(data.datetime));
      this._getCityForecast(lat,lon).subscribe((data:any)=>{
        this.selectedCityForecast = data;
        this.refreshForecast();
      });
    });
  }

  checkDayExist(date : Date){
    for(let i = 0; i < this.forecastDays.length; i++){
      if(this.forecastDays[i]["date"].getDate() == date.getDate())
      return i;
    }
    return -1;
  }

  refreshForecast(){
      this.chanceOfRain = [];
      this.temp[0].series = [];
      this.pressure[0].series = [];
      this.humidity[0].series = [];
      this.speed[0].series = [];
      this.deg[0].series = [];
      this.forecastDays = [];
      this.minTemp, this.maxTemp = Math.round(this.selectedCityForecast[`${0}`].temp - 273.15);
      for(let i = 0;`${i}`in this.selectedCityForecast; i++){
        let date : Date = new Date(Date.parse(this.selectedCityForecast[`${i}`].dt_txt));
        let temp : number = Math.round(this.selectedCityForecast[`${i}`].temp - 273.15);
        if(this.checkDayExist(date) == -1 && this.forecastDays.length < 5){
          this.forecastDays.push({"date" : date,"minTemp" : temp, "maxTemp" : temp});
        }
        let index = this.checkDayExist(date);
        if(index < 5){
          if(temp > this.forecastDays[index].maxTemp)
          this.forecastDays[index].maxTemp = temp
  
          if(temp < this.forecastDays[index].minTemp)
          this.forecastDays[index].minTemp = temp
        }
        if(date.getDate() == this.selectedDate?.getDate()){
          this.chanceOfRain.push({"name" : date.getHours().toString().length > 1 ? date.getHours().toString() + " pm" : date.getHours().toString() + " am" , "value" : this.selectedCityForecast[`${i}`].pop * 100});
          this.temp[0].series.push({"name" : date.getHours().toString().length > 1 ? date.getHours().toString() + " pm" : date.getHours().toString() + " am" , "value" : Math.round(this.selectedCityForecast[`${i}`].temp - 273.15)});
          this.pressure[0].series.push({"name" : date.getHours().toString().length > 1 ? date.getHours().toString() + " pm" : date.getHours().toString() + " am" , "value" : Math.round(this.selectedCityForecast[`${i}`].pressure)});
          this.humidity[0].series.push({"name" : date.getHours().toString().length > 1 ? date.getHours().toString() + " pm" : date.getHours().toString() + " am" , "value" : Math.round(this.selectedCityForecast[`${i}`].humidity)});
          this.speed[0].series.push({"name" : date.getHours().toString().length > 1 ? date.getHours().toString() + " pm" : date.getHours().toString() + " am" , "value" : Math.round(this.selectedCityForecast[`${i}`].speed)});
          this.deg[0].series.push({"name" : date.getHours().toString().length > 1 ? date.getHours().toString() + " pm" : date.getHours().toString() + " am" , "value" : Math.round(this.selectedCityForecast[`${i}`].deg)});
        }
      }
  }
}
