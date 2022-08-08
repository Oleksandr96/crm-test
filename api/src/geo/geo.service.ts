import { Injectable } from '@nestjs/common';
import csc from 'michaelolof-country-state-city'
import { ICountry, IState, ICity } from 'michaelolof-country-state-city'

@Injectable()
export class GeoService {

  getCountries(): ICountry[] {
    return csc.getAllCountries();
  }

  getStatesOfCountry(countryId: string): IState[] {
    return csc.getStatesOfCountry(countryId)
  }

  getCitiesOfState(stateId: string): ICity[] {
    return csc.getCitiesOfState(stateId);
  }

  getGeoDataNames(countryId: string, stateId: string, cityId: string): any {
    return {
      countryId: csc.getCountryById(countryId).name,
      stateId: csc.getStateById(stateId).name,
      cityId: csc.getCityById(cityId).name
    };
  }
}
