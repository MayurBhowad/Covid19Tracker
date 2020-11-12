import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

//INTERFACE
import { CountryDateWiseData } from "../model/countryDateWiseData.model";

@Injectable({
  providedIn: "root",
})
export class DiseaseService {
  // Get COVID-19 time series data for a specific country
  url1 = "https://disease.sh/v3/covid-19/historical/";

  constructor(private http: HttpClient) {}

  getCountryDateWiseData(country, days) {
    let ress = this.http.get(this.url1+ `${country}?lastdays=${days}`);
    
    return ress;
  }
}
