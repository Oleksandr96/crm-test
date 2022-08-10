import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Country } from '../../interfaces/country.interface';
import { UserService } from '../../services/user.service';
import { GeoService } from '../../services/geo.service';
import { User } from '../../interfaces/user.interface';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subscription } from 'rxjs';

@Component({
  selector: 'app-new-user-form',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss'],
})
export class AddEditUserComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  @ViewChild('formDirective') private formDirective!: NgForm;
  firstName = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  lastName = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  dateOfBirth = new FormControl(new Date(1990, 0, 1));
  emailID = new FormControl('', [Validators.required, Validators.email]);
  gender = new FormControl('male');
  countryId = new FormControl('');
  stateId = new FormControl({ value: '', disabled: true });
  cityId = new FormControl({ value: '', disabled: true });
  address = new FormControl('');
  pinCode = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.pattern('^[0-9]*$'),
  ]);

  countries!: any[];
  states!: any[];
  cities!: any[];
  userId!: string;
  isAddMode: boolean = true;

  newUserSubscription!: Subscription;

  constructor(
    private usersService: UserService,
    private geoService: GeoService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.geoService
      .getCountries()
      .subscribe((countries: Country[]) => (this.countries = countries));
    this.userForm = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      emailID: this.emailID,
      gender: this.gender,
      countryId: this.countryId,
      stateId: this.stateId,
      cityId: this.cityId,
      address: this.address,
      pinCode: this.pinCode,
    });
  }

  ngOnInit(): void {
    this.newUserSubscription = this.commonService
      .getUpdate()
      .subscribe((user: User) => {
        if (user) {
          this.userId = user._id || '';
          this.isAddMode = false;
          this.usersService
            .getById(user._id)
            .pipe(first())
            .subscribe((user: User) => {
              this.userForm.patchValue(user);
            });
        }
      });

    this.countryId.valueChanges.subscribe((country: string) => {
      this.stateId.reset();
      this.stateId.disable();
      if (country) {
        this.geoService.getStatesByCountry(country).subscribe((states) => {
          this.states = states;
          this.stateId.enable();
        });
      }
    });

    this.stateId.valueChanges.subscribe((state: string) => {
      this.cityId.reset();
      this.cityId.disable();
      if (state) {
        this.geoService
          .getCitiesByState(this.stateId.value)
          .subscribe((cities) => (this.cities = cities));
        this.cityId.enable();
      }
    });
  }

  ngOnDestroy(): void {
    this.newUserSubscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private updateUser() {
    let user: User = this.userForm.value;
    this.usersService.update(user, this.userId).subscribe((user: User) => {
      this.commonService.showNotify(
        `User ${user.firstName} ${user.lastName} updated`,
        'Close'
      );
      this.commonService.sendUpdate();
      this.isAddMode = true;
      this.router.navigate(['']).then(() => this.formDirective.resetForm());
    });
  }

  private createUser(): void {
    const user: User = this.userForm.value;
    this.usersService.create(user).subscribe((user: User) => {
      this.commonService.showNotify(
        `User ${user.firstName} ${user.lastName} created`,
        'Close'
      );
      this.commonService.sendUpdate();
      this.formDirective.resetForm();
    });
  }
}
