import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    onlineEvent: Observable<Event>;
    offlineEvent: Observable<Event>;

    subscriptions: Subscription[] = [];

    connectionStatusMessage: string;
    connectionStatus: string;

    constructor() {}

    ngOnInit(): void {
    /**
    * Get the online/offline status from browser window
    */
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.subscriptions.push(this.onlineEvent.subscribe(e => {
        this.connectionStatusMessage = 'Back online!';
        this.connectionStatus = 'online';
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
        this.connectionStatusMessage = 'Connection lost! You are not connected to the internet.';
        this.connectionStatus = 'offline';
    }));
    }

    ngOnDestroy(): void {
        /**
        * Unsubscribe all subscriptions to avoid memory leak
        */
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
