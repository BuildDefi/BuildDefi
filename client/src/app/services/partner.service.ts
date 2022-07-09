import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Partner } from "../models/partner.model";

@Injectable({ providedIn: 'root' })
export class PartnerService {

  private mBaseUrl = `${environment.apiUrl}/partners`;
  private mPartners = new BehaviorSubject<Partner[]>([]);

  get partners(): Observable<Partner[]> {
    return this.mPartners.asObservable();
  }

  constructor(
    private http: HttpClient
  ) { }

  fetchAll(): Observable<void> {
    return this.http.get<Partner[]>(`${this.mBaseUrl}`).pipe(
      map(res => {
        this.mPartners.next(res);
      })
    );
  }

  save(partner: Partner): Observable<any> {
    return this.http.post(`${this.mBaseUrl}`, partner);
  }
}