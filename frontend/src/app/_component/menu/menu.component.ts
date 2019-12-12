import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { data } from 'jquery';
import { AuthService } from 'src/app/_service/auth.service';
import { UsersService } from 'src/app/_service/users.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    @Input() public opened:boolean;
    @Output() public setOpen = new EventEmitter<boolean>();

    public icons:Array<string>;
    public names:Array<string>;
    public profile:any;

    constructor(private authService:AuthService, private userService:UsersService) { }

    ngOnInit() {
        this.icons = ['search', 'layers', 'users'];
        this.names = ['Search Places', 'Data Layers', 'Admin Portal'];
        this.getCurrentUser();
    }

    ngOnChanges(changes:SimpleChanges) {
        this.opened = changes.opened.currentValue;
    }

    getCurrentUser() {
        this.authService.userIdObservable.subscribe(
            user_id => {
                if(user_id) {
                    this.userService.getUser(user_id)
                    .subscribe(
                        data => {
                            this.profile = data;
                        }
                    );
                }
            }
        );
    }

    close() {
        this.setOpen.emit(false);
    }
}
