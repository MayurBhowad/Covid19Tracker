import { Component, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  @ViewChild('togglebtn') button; 
  element:HTMLElement;
  expanded = false;
  

  ngOnInit() {
    this.element = document.getElementById('togglebtn') as HTMLElement 
  }

  toggleNav(){
    this.expanded = !this.expanded;
  }

  @HostListener("window:scroll", [])
  onWindowScroll(){
    if(this.expanded){
      this.element.click();
    }
  }

}
