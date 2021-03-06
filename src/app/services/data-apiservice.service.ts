import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalDataSummary } from '../Global-Data';
import { DateWiseData } from '../date-wise-data';

@Injectable({
  providedIn: 'root'
})
export class DataAPIServiceService {

  getDate() {
    var d = new Date();
    
    
    const today = new Date()
    const yesterday = new Date(today)

    yesterday.setDate(yesterday.getDate() - 1)

    today.toDateString()
    yesterday.toDateString()

    // console.log(d);
    // console.log(yesterday);
    
    // var date = d.getDate() ;
    // var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    // var year = d.getFullYear();
    var date = yesterday.getDate() ;
    var month = yesterday.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = yesterday.getFullYear();
    const myDate = `${month<10? '0': ''}${month}-${date<10 ? '0': ''}${date}-${year}`;
    // const myDate = `${month < 10 ? '': ''}-${date<10 ? 0 : ''}${date}-${year}`;
    console.log(myDate);

    return myDate;
  }

  private date = this.getDate();




  private globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${this.date}.csv`;
  // private globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${this.getDate()}.csv`;
  private dateWiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;

  constructor(private http: HttpClient) { }






  getGlobalData() {
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let raw = {};
        let rows = result.split('\n');
        rows.splice(0, 1);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/)

          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10]
          }
          let temp: GlobalDataSummary = raw[cs.country];
          if (temp) {
            temp.active = cs.active + temp.active
            temp.confirmed = cs.confirmed + temp.confirmed
            temp.deaths = cs.deaths + temp.deaths
            temp.recovered = cs.recovered + temp.recovered

            raw[cs.country] = temp;
          } else {
            raw[cs.country] = cs;
          }
        })

        return <GlobalDataSummary[]>Object.values(raw);
      })
    )
  }



  getDateWiseData() {
    return this.http.get(this.dateWiseDataUrl, { responseType: 'text' }).pipe(map(result => {
      let rows = result.split('\n');
      // console.log(rows);
      let mainData = {};
      let header = rows[0];
      let dates = header.split(/,(?=\S)/)
      dates.splice(0, 4)
      // console.log(dates);
      rows.splice(0, 1);
      rows.forEach(row => {
        let cols = row.split(/,(?=\S)/);
        let country = cols[1];
        cols.splice(0, 4);
        // console.log(country, cols)
        mainData[country] = [];
        cols.forEach((value, index) => {
          let dw: DateWiseData = {
            cases: +value,
            country: country,
            date: new Date(Date.parse(dates[index]))
          }
          mainData[country].push(dw)
        })
      })
      // console.log(mainData);
      return mainData;
    }))
  }
}
