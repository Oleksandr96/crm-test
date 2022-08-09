import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsNotEmpty()
  readonly emailID: string;

  readonly dateOfBirth: Date;
  readonly gender: string;
  readonly countryId: string;
  readonly stateId: string;
  readonly cityId: string;
  readonly address: string;

  @IsNotEmpty()
  readonly pinCode: string;
}
