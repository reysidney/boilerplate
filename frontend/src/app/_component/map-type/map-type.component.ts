import { Component, OnInit } from '@angular/core';
import { GmapService } from 'src/app/_service/gmap.service';

@Component({
    selector: 'app-map-type',
    templateUrl: './map-type.component.html',
    styleUrls: ['./map-type.component.scss']
})
export class MapTypeComponent implements OnInit {

    public mapTypeId:number;
    public mapTypeLabel:string;

    constructor(private gmapService:GmapService) {
        this.mapTypeId = 1;
        this.mapTypeLabel = 'Map';
    }

    ngOnInit() {
    }

    mapTypeChange() {
        if(this.mapTypeId == 1) {
            this.mapTypeId = 2;
            this.mapTypeLabel = 'Satellite';
            this.gmapService.changeMapType(google.maps.MapTypeId.ROADMAP);
        } else {
            this.mapTypeId = 1;
            this.mapTypeLabel = 'Map';
            this.gmapService.changeMapType(google.maps.MapTypeId.HYBRID);
        }
    }
}
