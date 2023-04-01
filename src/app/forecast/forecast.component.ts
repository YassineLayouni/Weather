import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {

  

  constructor(public userService:UserService) { 
    this.userService.showMenu = true;
  }

  ngOnInit(): void {
  }

}
