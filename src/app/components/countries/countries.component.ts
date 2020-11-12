import { Component, OnInit } from "@angular/core";
import { DataAPIServiceService } from "src/app/services/data-apiservice.service";
import { DiseaseService } from "src/app/services/disease.service";
import { GlobalDataSummary } from "src/app/Global-Data";
import { DateWiseData } from "src/app/date-wise-data";
import { merge } from "rxjs";
import { map } from "rxjs/operators";
import { CountryDateWiseData } from 'src/app/model/countryDateWiseData.model';

@Component({
  selector: "app-countries",
  templateUrl: "./countries.component.html",
  styleUrls: ["./countries.component.scss"],
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[];
  countries: string[] = [];

  daysRange: number[] = [10, 30, 60, 90, 120, 150, 200, 250, 300, 400];

  countryHistory: CountryDateWiseData[] = [];

  totalConfirmed = 0;
  totalActive = 0;
  totalDeath = 0;
  totalRecovered = 0;
  dateWiseData;
  TodaysData = [];    //cases Per day
  TotalData = [];     //[date, cases, recovered]
  datatable = [];
  dataPerDay1 = [];
  recoveredDataPerDay1 = [];
  deathsDataPerDay1 = [];
  selectedCountry = 'Afghanistan';
  selectedCountryData: DateWiseData[];
  loading = true;

  days: number = 30;

  globalData: GlobalDataSummary[];

  constructor(
    private dataAPIService: DataAPIServiceService,
    private diseaseService: DiseaseService
  ) {}

  lineChart = {
    LineChart: "LineChart",
    title: 'New Cases Per Day',
    height: 500,
    options: {
      title: 'Total Cases Timeline',
      colors: ['#339CFF', '#23D000', '#E20202'],
      animation: {
        duration: 1000,
        easing: "out",
      },
      legend:{position: 'bottom'},
    },
  };
  
  columnChart = {
    ColumnChart: "ColumnChart",
    height: 500,
    options: {
      title: `New Cases Per Day`,
      colors: ['#AB0D06'],
      animation: {
        duration: 1000,
        easing: "out",
      },
      legend:{position: 'bottom'},
    }
  }

  // initChart() {
  //   // this.dataPerDay1 = []
  //   // this.datatable = [];
  //   // this.datatable.push(["country", "Cases"])

  //   this.selectedCountryData.forEach((cs) => {
  //     this.datatable.push([cs.date, cs.cases]);
  //   });
  //   // console.log(this.datatable);
  //   // console.log(this.selectedCountryData);
  //   // console.log(this.dataPerDay1);
    
    
  // }

  ngOnInit() {
    merge(
      this.dataAPIService.getDateWiseData().pipe(
        map((result) => {
          this.dateWiseData = result;
          // console.log(this.dateWiseData);
        })
      ),
      this.dataAPIService.getGlobalData().pipe(
        map((result) => {
          this.data = result;
          this.data.forEach((cs) => {
            this.countries.push(cs.country);
          });
        })
      )
    ).subscribe({
      complete: () => {
        this.updateValues("Afghanistan");

        this.loading = false;
      },
    });

    this.getCountryDateWiseData(this.selectedCountry, this.days);
    // console.log(this.countryHistory);
    

    // console.log(this.datatable);
    //   console.log(this.dataPerDay1);
    
  }

  onChangeDays(e){
    // console.log(this.days);
    
    this.getCountryDateWiseData(this.selectedCountry, this.days);
  }

  updateValues(country: string) {
    // console.log(country);
    this.selectedCountry = country;
    this.data.forEach((cs) => {
      if (cs.country == country) {
        this.totalActive = cs.active;
        this.totalDeath = cs.deaths;
        this.totalConfirmed = cs.confirmed;
        this.totalRecovered = cs.recovered;
      }
    });

    this.selectedCountryData = this.dateWiseData[country];
    this.getCountryDateWiseData(this.selectedCountry, this.days);
    // this.updateChart();
    // this.initChart();
  }

  updateChart() {
    let datatable = [];
    datatable.push(["Cases", "Date"]);
    this.selectedCountryData.forEach((cs) => {
      datatable.push([cs.cases, cs.date]);
    });
  }

  convertedServerData(PureServerData){

    let serverData = PureServerData;
    let FinalList= [];

    let serverData1 = [];

    serverData = JSON.stringify(serverData);

    serverData = serverData.substring(1, serverData.length-1);
    serverData1.push(serverData.split(','));

    let dataDate = [];
    serverData1[0].map(e => dataDate.push(e));

    dataDate.map(e => {
      let oneRec = [];
      let seB = e.substring(0,e.indexOf(":") )
      let seA = e.substring(e.indexOf(":") +1 )
      let dateString = seB 
      let newDate = new Date(dateString);
      oneRec.push(newDate);
      oneRec.push(+seA);
      FinalList.push(oneRec)
    })
    // console.log(FinalList);
    return FinalList;

  }

  getCountryDateWiseData(selectedCountry, days):void {
    this.diseaseService
      .getCountryDateWiseData(selectedCountry, days)
      .subscribe((ress: any) => 
      // {this.countryHistory.push(ress); console.log(this.countryHistory);}
      {
        let data;
        data =(ress.timeline.cases);
        
        
        
        
        let data1 = [];
        let dataPerDay = [];
        this.dataPerDay1 = []; //Make it empty
        this.selectedCountryData = []; //Make it  empty
        // let dataPerDay1 = []; //FINALE DATA
        data = JSON.stringify(ress.timeline.cases);
        
        data = data.substring(1,data.length-1)
        data1.push(data.split(','));
        data1[0].map(e => dataPerDay.push(e))

        dataPerDay.map(e => {
          let oneRec = [];
          let dateRec: any = {}
          let seB = e.substring(0,e.indexOf(":") )
          let seA = e.substring(e.indexOf(":") +1 )
          let dateString = seB 
          let newDate = new Date(dateString);
          oneRec.push(newDate);
          oneRec.push(+seA);
          dateRec.cases = +seA;
          dateRec.date = newDate;
          dateRec.country = selectedCountry
          // console.log( seA);
          this.dataPerDay1.push(oneRec)
          this.selectedCountryData.push(dateRec);
        })
        // console.log(this.dataPerDay1);
        
        this.recoveredDataPerDay1 = this.convertedServerData(ress.timeline.recovered);
        this.deathsDataPerDay1 = this.convertedServerData(ress.timeline.deaths);
        // let recoveredData;
        // let recoveredData1 = [];
        // let recoveredDataPerDay = [];
        // this.recoveredDataPerDay1 = [];
        // recoveredData  = JSON.stringify(ress.timeline.recovered);
        // recoveredData = recoveredData.substring(1,recoveredData.length-1);
        // recoveredData1.push(recoveredData.split(','));
        // recoveredData1[0].map(e =>recoveredDataPerDay.push(e))

        // recoveredDataPerDay.map(e => {
        //   let oneRec = [];
        //   let dateRec: any = {}
        //   let seB = e.substring(0,e.indexOf(":") )
        //   let seA = e.substring(e.indexOf(":") +1 )
        //   let dateString = seB 
        //   let newDate = new Date(dateString);
        //   oneRec.push(newDate);
        //   oneRec.push(+seA);
        //   this.recoveredDataPerDay1.push(oneRec)
        // })

        // console.log(this.dataPerDay1);
        // console.log(this.selectedCountryData);
        // console.log(ress);
        // console.log(this.dataPerDay1);
        // console.log(this.recoveredDataPerDay1);

        
        this.TotalData = [];
        let totalDataArr = [];
        
        this.TodaysData = []
        let todaysData0 = [];
        this.TotalData.push();

        for( let i = 0; i< this.dataPerDay1.length; i++){
          totalDataArr = [];
          todaysData0 = [];
          totalDataArr.push(this.dataPerDay1[i][0])
          todaysData0.push(this.dataPerDay1[i][0])
          totalDataArr.push(this.dataPerDay1[i][1])
          totalDataArr.push(this.recoveredDataPerDay1[i][1])
          totalDataArr.push(this.deathsDataPerDay1[i][1])

          if(i + 1 < this.dataPerDay1.length){
            let todaysNewCases = this.dataPerDay1[i + 1][1] - this.dataPerDay1[i][1]
            // console.log(todaysNewCases);
            todaysData0.push(todaysNewCases);
          } else {
            todaysData0.push(0);
          }
          

          this.TotalData.push(totalDataArr)
          this.TodaysData.push(todaysData0);
        }

        // console.log(this.TotalData);
        // console.log(this.TodaysData);
        
      

        
      }
      );
      
    }
}
