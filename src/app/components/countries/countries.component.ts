import { Component, OnInit } from '@angular/core';
import { DataAPIServiceService } from 'src/app/services/data-apiservice.service';
import { GlobalDataSummary } from 'src/app/Global-Data';
import { DateWiseData } from 'src/app/date-wise-data';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {

  data: GlobalDataSummary[];
  countries: string[] = [];

  totalConfirmed = 0;
  totalActive = 0;
  totalDeath = 0;
  totalRecovered = 0;
  dateWiseData;
  datatable = [];
  selectedCountry;
  selectedCountryData: DateWiseData[];
  loading = true;

  globalData: GlobalDataSummary[];

  constructor(private dataAPIService: DataAPIServiceService) { }

  chart = {
    LineChart: "LineChart",
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      }
    },
  }

  initChart() {

    this.datatable = [];
    // this.datatable.push(["country", "Cases"])

    this.selectedCountryData.forEach(cs => {
      this.datatable.push([
        cs.date, cs.cases
      ])
    })


  }

  ngOnInit() {
    merge(
      this.dataAPIService.getDateWiseData().pipe(map(result => {
        this.dateWiseData = result;
      })),
      this.dataAPIService.getGlobalData().pipe(map(result => {
        this.data = result;
        this.data.forEach(cs => {
          this.countries.push(cs.country)
        })
      }))
    ).subscribe({
      complete: () => {
        this.updateValues('US');

        this.loading = false;
      }
    })



    //   this.dataAPIService.getGlobalData().subscribe(result => {
    //     this.data = result;
    //     this.data.forEach(cs => {
    //       this.countries.push(cs.country)
    //     })
    //   })

    // this.dataAPIService.getDateWiseData().subscribe(result => {
    //   // console.log(result)
    //   this.dateWiseData = result;
    //   // this.updateChart();
    // })
  }



  updateValues(country: string) {
    // console.log(country);
    this.selectedCountry = country;
    this.data.forEach(cs => {
      if (cs.country == country) {
        this.totalActive = cs.active
        this.totalDeath = cs.deaths
        this.totalConfirmed = cs.confirmed
        this.totalRecovered = cs.recovered
      }
    })

    this.selectedCountryData = this.dateWiseData[country];
    // this.updateChart();
    this.initChart();

  }

  updateChart() {
    let datatable = [];
    datatable.push(['Cases', 'Date']);
    this.selectedCountryData.forEach(cs => {
      datatable.push([cs.cases, cs.date]);
    })
  }



}
