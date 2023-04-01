import { Component, OnInit } from '@angular/core';
import { CityService } from '../city.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  chanceOfRain = [
    { name: "9 am", value: 90 },
    { name: "12 pm", value: 60 },
    { name: "3 pm", value: 0 },
    { name: "6 pm", value: 12 },
    { name: "9 pm", value: 40 },
    { name: "12 am", value: 70 },
    { name: "3 am", value: 50 },
    { name: "6 am", value: 60 }
  ];

  TempData = [
    {
      "name": "Temperature",
      "series": [
        { name: "9 am", value: 19 },
    { name: "12 pm", value: 13 },
    { name: "3 pm", value: -5 },
    { name: "6 pm", value:  1},
    { name: "9 pm", value: 5 },
    { name: "12 am", value: -6 },
    { name: "3 am", value: 20 },
    { name: "6 am", value: 13 }
      ]
    },
  ]

  customColors = [
    { name: "9 am", value: "#eb5181" },
    { name: "12 pm", value: "#eb5181" },
    { name: "3 pm", value: "#eb5181" },
    { name: "6 pm", value:  "#eb5181"},
    { name: "9 pm", value: "#eb5181" },
    { name: "12 am", value: "#eb5181" },
    { name: "3 am", value: "#eb5181" },
    { name: "6 am", value: "#eb5181" },
    { name: "Temperature", value: "#eb5181" },
];

public colorScheme = "#eb5181"

  constructor(public userSerivce:UserService, public cityService:CityService) { 
    this.userSerivce.showMenu = true;
  }

  ngOnInit(): void {
    this.cityService._getCurrentCity();
  }

}
