import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_service/auth.service';
import { GmapService } from '../_service/gmap.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public showSidebar:boolean;
    public showComponent:boolean;
    public datetime:number;
    public isLoading: boolean;
    
    constructor(private authService:AuthService, private gmapService:GmapService) {
        this.showComponent = false;
    }

    ngOnInit() {
        let redirect = true;
        this.authService.isLoggedIn().subscribe(
            data => {
                if(data.success) {
                    this.showComponent = true;
                    redirect = false;
                    this.datetime = data.datetime;
                } 
                this.authService.redirectLogin(data, redirect);
            }
        );

        this.gmapService.isLoadingObservable.subscribe( 
            data => this.isLoading = data
        );
    }
}
