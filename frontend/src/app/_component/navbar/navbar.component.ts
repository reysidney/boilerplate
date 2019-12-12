import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    public icons:Array<string>;
    public menuOpened:boolean;
    public searchOpened:boolean;

    constructor(private router:Router) {}

    ngOnInit() {
        this.icons = ['menu', 'search', 'layers', 'users'];
    }

    logout() {
        this.router.navigateByUrl('/logout');
    }

    menuClicked() {
        this.menuOpened = true;
    }

    searchClicked() {
        this.searchOpened = true;
    }

    layersClicked() {
        this.menuOpened = true;
    }

    usersClicked() {
        this.menuOpened = true;
    }
}
