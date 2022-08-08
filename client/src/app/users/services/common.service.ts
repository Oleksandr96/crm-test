import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({providedIn: "root"})
export class CommonService {
  private newDataSubject = new Subject<any>();

  constructor(private snackBar: MatSnackBar) {
  }

  sendUpdate(data?: any) {
    this.newDataSubject.next(data);
  }

  getUpdate(): Observable<any> {
    return this.newDataSubject.asObservable();
  }

  showNotify(message: string, action: string) {
    this.snackBar.open(message, action)
  }
}
