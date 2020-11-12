import { Component, OnInit } from '@angular/core';
import { DataAPIServiceService } from 'src/app/services/data-apiservice.service';
import { GlobalDataSummary } from 'src/app/Global-Data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeath = 0;
  totalRecovered = 0;
  datatable = [];
  loading = true;
  dataTill;

  globalData: GlobalDataSummary[];

  constructor(private dataAPIService: DataAPIServiceService) { }

  chart = {
    PieChart: "PieChart",
    ColumnChart: "ColumnChart",
    height: 400,
    width: 400,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      }
    },
  }

  initChart(caseType: string) {

    this.datatable = [];
    // this.datatable.push(["country", "Cases"])

    this.globalData.forEach(cs => {
      let value: number;
      if (caseType == 'c') {
        if (cs.confirmed > 100000)
          value = cs.confirmed
      } else if (caseType == 'a') {
        if (cs.active > 100000)
          value = cs.active
      } else if (caseType == 'r') {
        if (cs.recovered > 100000)
          value = cs.recovered
      } else if (caseType == 'd') {
        if (cs.deaths > 10000)
          value = cs.deaths
      }

      this.datatable.push([
        cs.country, value
      ])
    })


  }





  ngOnInit(): void {
    this.dataAPIService.getGlobalData().subscribe({
      next: (result) => {
        this.globalData = result;
        result.forEach(cs => {
          if (!Number.isNaN(cs.confirmed)) {
            this.totalActive += cs.active
            this.totalConfirmed += cs.confirmed
            this.totalDeath += cs.deaths
            this.totalRecovered += cs.recovered
          }
        })
        this.initChart('r');
      },
      complete: () => {
        this.loading = false;
      }
    });
    this.dataTill = this.dataAPIService.getDate();
    let newDate =  new Date((this.dataTill))
    this.dataTill = newDate.toDateString();
    // console.log(newDate.toDateString());
    
    // // newDate.split(' ')
    // console.log(this.dataTill);
    

  }

  updateChart(input: HTMLInputElement) {
    this.initChart(input.value)
  }




}
