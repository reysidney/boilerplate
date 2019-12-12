import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConstants } from '../app.constant';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private data;
    private dataBS = new BehaviorSubject<any>(null);
    public dataObservable = this.dataBS.asObservable();

    constructor(private http:HttpClient) { }

    getSettingsApi():Observable<any> {
        return this.http.get(AppConstants.api + 'rw_settings/');
    }

    getSettings() {
        this.getSettingsApi().subscribe(
            data => {
                let dataArr = [];
                data.forEach(
                    item => {
                        if(item.status == 'image') {
                            dataArr[item.name] = item.image_url;
                        } else {
                            dataArr[item.name] = item.hex_color;
                        }
                    }
                );
                this.dataBS.next(dataArr);
            }
        );
    }
}
