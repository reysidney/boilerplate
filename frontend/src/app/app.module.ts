import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { 
    MatButtonModule, 
    MatFormFieldModule, 
    MatPaginatorModule, 
    MatInputModule, 
    MatSortModule, 
    MatCheckboxModule, 
    MatListModule, 
    MatExpansionModule,
    MatProgressBarModule,
    MatSlideToggleModule
 } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './_component/navbar/navbar.component';
import { MapComponent } from './_component/map/map.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PoiComponent } from './_component/poi/poi.component';
import { LoadingPageComponent } from './_component/loading-page/loading-page.component';
import { MapTypeComponent } from './_component/map-type/map-type.component';
import { SettingsService } from './_service/settings.service';
import { OnlineStatusComponent } from './_component/online-status/online-status.component';
import { LoaderComponent } from './_component/loader/loader.component';
import { MenuComponent } from './_component/menu/menu.component';
import { SearchComponent } from './_component/search/search.component';

const modules = [
    MatFormFieldModule,
    MatButtonModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatCheckboxModule,
    MatListModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatSidenavModule
]
@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        NavbarComponent,
        MapComponent,
        NotFoundComponent,
        PoiComponent,
        LoadingPageComponent,
        MapTypeComponent,
        OnlineStatusComponent,
        LoaderComponent,
        MenuComponent,
        SearchComponent
    ],
    exports: [
        ...modules
    ],
    imports: [
        ...modules,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        MatIconModule,
        MatDialogModule,
        MatProgressBarModule,
        MatTableModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken'
        }),
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: (setting: SettingsService) => function() {return setting.getSettings()},
            deps: [SettingsService],
            multi: true
        }
    ],
    bootstrap: [ AppComponent ],
    entryComponents: []
})
export class AppModule { }
