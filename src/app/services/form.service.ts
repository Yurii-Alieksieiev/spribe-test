import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SubmitFormResponseData} from "../shared/interface/responses";
import {FormData} from "../shared/interface/form-data.interface"

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor(
    private http: HttpClient) { }

  submitForm(payload: FormData): Observable<SubmitFormResponseData> {
    return this.http.post<SubmitFormResponseData>('/api/submitForm', payload);
  }
}
