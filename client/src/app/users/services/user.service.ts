import {UserResponse} from './../interfaces/user.response.interface';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {User} from "../interfaces/user.interface";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({providedIn: "root"})
export class UserService {
  constructor(private http: HttpClient) {
  }

  API_URL: string = environment.apiUrl;

  fetch(params: any = {}): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/users`, {
      params: new HttpParams({
        fromObject: params,
      }),
    });
  }

  public create(user: User): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/users/`, user);
  }

  public update(user: User, userId: string): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/users/${userId}`, {user});
  }

  public remove(id: string): Observable<User> {
    return this.http.delete<User>(`${this.API_URL}/users/${id}`);
  }

  public getById(id: string | undefined): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/${id}`)
  }
}
