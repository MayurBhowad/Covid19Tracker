import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent implements OnInit {

  @Input('totalConfirmed') totalConfirmed;
  @Input('totalActive') totalActive;
  @Input('totalDeath') totalDeath;
  @Input('totalRecovered') totalRecovered;

  constructor() { }

  ngOnInit() {
  }

}
