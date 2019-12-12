import { Component, AfterViewInit, ViewChild, OnInit} from '@angular/core';
import {} from 'googlemaps';
import { GmapService } from 'src/app/_service/gmap.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
    public map: google.maps.Map;

    @ViewChild('gmap', {static:false}) mapElement;

    constructor(private gmapService:GmapService) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.map = this.gmapService.createMap(this.mapElement.nativeElement);
        this.gmapService.changeMap(this.map);
    }
}
