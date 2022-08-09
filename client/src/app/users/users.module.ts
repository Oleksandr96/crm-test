import { MaterialModule } from '../shared/modules/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { AddEditUserComponent } from './components/add-edit-user/add-edit-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './components/list/list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [UsersComponent, AddEditUserComponent, ListComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [UsersComponent],
})
export class UsersModule {}
