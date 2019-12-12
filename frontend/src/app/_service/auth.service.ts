import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AppConstants } from '../app.constant';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private isStaffBs = new BehaviorSubject<boolean>(null);
    private isAdminBs = new BehaviorSubject<boolean>(null);
    private isMarketingBs = new BehaviorSubject<boolean>(null);
    private userIdBs = new BehaviorSubject<number>(null);

    public isStaffObservable = this.isStaffBs.asObservable();
    public isAdminObservable = this.isAdminBs.asObservable();
    public isMarketingObservable = this.isMarketingBs.asObservable();
    public userIdObservable = this.userIdBs.asObservable();

    constructor(private http:HttpClient, private router:Router) {
    }

    changeIsStaff(is_staff: boolean) {
        this.isStaffBs.next(is_staff);
    }

    changeIsAdmin(is_admin: boolean) {
        this.isAdminBs.next(is_admin);
    }

    changeIsMarketing(is_marketing: boolean) {
        this.isMarketingBs.next(is_marketing);
    }

    changeUserId(user_id: number) {
        this.userIdBs.next(user_id);
    }

    login(username, password):Observable<any> {
        const params = {
            username: username,
            password: password
        }
        return this.http.post(AppConstants.api + 'login/', params);
    }

    logout() {
        this.http.post(AppConstants.api + 'logout/', {}).subscribe(
            data => {}
        );
    }

    isLoggedIn() {
        return this.http.get<any>(AppConstants.api + 'logged-in/');
    }

    redirectLogin(data, redirect) {
        let url;
        if(data.success) {
            this.changeUserId(data.user_id);
            url = '/';
        } else {
            url = '/login';
        }

        if(redirect) {
            this.router.navigateByUrl(url);
        }
    }
}
