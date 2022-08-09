import { UserResponse } from '../../interfaces/user.response.interface';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../interfaces/user.interface';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../services/user.service';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  merge,
  Subscription,
  tap,
} from 'rxjs';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading: boolean = false;
  totalRows = 0;
  pageSize = 5;
  pageNumber = 0;
  pageSizeOptions = [5, 10, 25, 100];
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'dateOfBirth',
    'emailId',
    'gender',
    'country',
    'state',
    'city',
    'address',
    'pinCode',
    'edit',
    'remove',
  ];

  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  private dataUpdatingSubscription: Subscription;

  constructor(
    private usersService: UserService,
    private commonService: CommonService
  ) {
    this.dataUpdatingSubscription = this.commonService
      .getUpdate()
      .subscribe((_) => {
        this.loadData();
      });
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.dataUpdatingSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadData();
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // if sort or paginate -> load a new page
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadData()))
      .subscribe();
  }

  loadData(): void {
    this.isLoading = true;

    let params = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortDirection: this.sort?.direction ? this.sort.direction : 'asc',
      sortKey: this.sort?.active ? this.sort.active : '_id',
    };

    let search = this.input?.nativeElement.value;
    Object.assign(params, search && { search });

    this.usersService.fetch(params).subscribe((usersData: UserResponse) => {
      this.dataSource.data = usersData.users;
      setTimeout(() => {
        this.paginator.pageIndex = this.pageNumber;
        this.paginator.length = +usersData.count;
        this.totalRows = +usersData.count;
      });
      this.isLoading = false;
      this.dataSource.sort = this.sort;
    });
  }

  pageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.loadData();
  }

  remove(id: string): void {
    this.usersService.remove(id).subscribe((user: User) => {
      this.commonService.showNotify(
        `User ${user.firstName} ${user.lastName} deleted.`,
        'Close'
      );
      this.loadData();
    });
  }

  editUser(user: User) {
    this.commonService.sendUpdate(user);
  }
}
