import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Country} from "../interfaces/country.interface";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class GeoService {
  API_URL: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getCountries(): Observable<Country[]> {
    return this.http.get<any[]>(`${this.API_URL}/geo/countries`);
  }

  getStatesByCountry(countryId: string): Observable<any> {
    return this.http.get<any[]>(`${this.API_URL}/geo/states`, {
      params: new HttpParams({
        fromObject: {countryId},
      }),
    });
  }

  getCitiesByState(stateId: string): Observable<any> {
    return this.http.get<any[]>(`${this.API_URL}/geo/cities`, {
      params: new HttpParams({
        fromObject: {stateId},
      }),
    });
  }
}
