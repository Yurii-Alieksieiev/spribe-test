import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CheckUserResponseData} from "../shared/interface/responses";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient) { }

  checkUsername(username: string): Observable<CheckUserResponseData> {
    return this.http.post<CheckUserResponseData>('/api/checkUsername', { username });
  }
}
