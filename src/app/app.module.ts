import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { HttpClientModule } from '@angular/common/http';
import { GoogleChartsModule } from 'angular-google-charts';

import { ThousandSuffixesPipe } from './Pipe/ThousandSuffixes.pipe';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { ContriesComponent } from './components/contries/contries.component';
import { CountriesComponent } from './components/countries/countries.component';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ContriesComponent,
    CountriesComponent,
    DashboardCardComponent,
    ThousandSuffixesPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    GoogleChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
