import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Poi } from 'src/app/_interface/poi';
import { GmapService } from 'src/app/_service/gmap.service';

@Component({
    selector: 'app-poi',
    templateUrl: './poi.component.html',
    styleUrls: ['./poi.component.scss']
})
export class PoiComponent implements OnInit, OnChanges {

    @Input() public item:Poi;
    @Output() public isClose = new EventEmitter<boolean>();

    constructor(private gmapService:GmapService) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.item = changes.item.currentValue;
    }

    getImage(item:Poi) {
        return item.photos ? item.photos[0].getUrl({'maxWidth': 72}) : '/assets/images/no-image.png';
    }

    getMapDirections(geom, name, icon) {
        this.gmapService.mapObservable.subscribe(
            map => {
                const from = this.gmapService.createLatLng(geom.location.lat(), geom.location.lng());
                const fromMarker = this.gmapService.createMarkerWithLabel(
                    map, 
                    from, 
                    name,
                    this.gmapService.createMarkerImageDefault(null)
                );
                this.gmapService.changeDirectionText(name);
                this.gmapService.changeFromMarker(fromMarker);
                this.gmapService.calculateRoute(map);
            }
        );
    }

}
