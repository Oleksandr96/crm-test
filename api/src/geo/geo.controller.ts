import {Controller, Get, Query} from '@nestjs/common';
import {GeoService} from "./geo.service";
import {ICity, ICountry, IState} from "michaelolof-country-state-city";

@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {
  }

  @Get('countries')
  getCountries(): ICountry[] {
    return this.geoService.getCountries()
  }

  @Get('states')
  getStates(@Query('countryId') countryId: string): IState[] {
    return this.geoService.getStatesOfCountry(countryId)
  }

  @Get('cities')
  getCities(@Query('stateId') stateId: string): ICity[] {
    return this.geoService.getCitiesOfState(stateId)
  }
}
