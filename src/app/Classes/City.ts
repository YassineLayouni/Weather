export class City{
    name : string | undefined; 
    country : string | undefined;
    lat : number | undefined;
    lon : number | undefined;
    temp : number | undefined;
    clouds : number | undefined;
    humidity : number | undefined;
    pressure : number | undefined; 
    windDirection :number | undefined;
    windSpeed : number | undefined; 

    
    constructor({name, 
        country,
        lat,
        lon,
        temp,
        clouds,
        humidity,
        pressure,
        windDirection,
        windSpeed}:{
        
        name? : string, 
        country? : string,
        lat? : number,
        lon? : number,
        temp? : number,
        clouds? : number,
        humidity? : number,
        pressure? : number,
        windDirection? :number,
        windSpeed? : number}){

            this.name = name;
            this.country = country;
            this.lat = lat;
            this.lon = lon;
            this.temp = temp;
            this.clouds = clouds;
            this.humidity = humidity;
            this.pressure = pressure;
            this.windDirection = windDirection;
            this.windSpeed = windSpeed;
        };
}