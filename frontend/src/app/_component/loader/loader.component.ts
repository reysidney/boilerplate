import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
    @Input() loader:boolean = false;

    constructor() { }

    ngOnInit() {
    }

}
