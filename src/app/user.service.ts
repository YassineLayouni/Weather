import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public router:Router) { }

  userLogged = false;
  showMenu = false;

  logout(){
    this.userLogged = false;
    this.router.navigate(['Login']);
  }

  login(){
    this.userLogged = true;
    this.router.navigate(['Home']);
  }
}
