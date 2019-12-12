import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../_service/auth.service';
import { SettingsService } from '../_service/settings.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

    public loginForm:FormGroup;
    public submitted: boolean;
    public wrongCredentials: boolean;
    public logout: boolean;
    public showComponent: boolean;

    public setting:any;

    constructor(
        private formBuilder:FormBuilder, 
        private router:Router, 
        private authService:AuthService,
        private route: ActivatedRoute,
        private settingsService:SettingsService
    ) 
    { 
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.submitted = false;
        this.wrongCredentials = false;
    }

    ngOnInit() {   
        this.route.data.subscribe(
            data => {
                if(data.logout) {
                    this.showComponent = true;
                    this.authService.logout();
                } else {
                    let redirect = true;
                    this.authService.isLoggedIn().subscribe(
                        data => {
                            if(!data.success) {
                                this.showComponent = true;
                                redirect = false
                            } 
                            this.authService.redirectLogin(data, redirect);
                        }
                    );
                }
            }
        );

        this.settingsService.dataObservable.subscribe(
            data => {
                if(data) {
                    this.setting = data;
                }
            }
        );
    }

    onSubmit() {
        this.submitted = true;
        const controls = this.loginForm.controls;
        if(this.loginForm.invalid) {
            setTimeout(() => {
                this.submitted = false;
            }, 3000);
        } else {
            this.authService
            .login(controls.username.value, controls.password.value)
            .subscribe(
                data => {
                    if(data.success) {
                        this.authService.changeUserId(data.user_id);
                        this.router.navigateByUrl('/');
                    } else {
                        this.wrongCredentials = true;
                        this.submitted = false;
                        setTimeout(() => {
                            this.wrongCredentials = false;
                        }, 3000);
                    }
                },
                error => {
                    console.log(error);
                    this.wrongCredentials = true;
                    setTimeout(() => {
                        this.wrongCredentials = false;
                    }, 3000);
                }
            );
        }
    }
}
