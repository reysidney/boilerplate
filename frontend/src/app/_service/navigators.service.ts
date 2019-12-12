import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constant';

@Injectable({
    providedIn: 'root'
})
export class NavigatorsService {

    constructor(private http: HttpClient) {
    }

    getNavigators():Observable<any> {
        return this.http.get(AppConstants.api + 'navigators/');
    }
}
