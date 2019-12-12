import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Poi } from '../_interface/poi';
import { Layer } from '../_interface/layer';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material';
import { AppConstants } from '../app.constant';
import { AuthService } from './auth.service';
import { ImageOverlay } from '../_class/image-overlay';
import { SettingsService } from './settings.service';
import * as markerWithLabel from 'markerwithlabel';

@Injectable({
    providedIn: 'root'
})
export class GmapService {
    private MarkerWithLabel;

    private phBounds: google.maps.LatLngBounds;
    private originLatlng: google.maps.LatLng;
    private defaultZoom: number;
    private defaultLatlng: google.maps.LatLng;
    private defaultBounds: google.maps.LatLngBounds;
    private search_markers: Array<google.maps.Marker>;
    private directionsDisplay: Array<google.maps.DirectionsRenderer>;
    private directionsService: google.maps.DirectionsService;
    private placeService: google.maps.places.PlacesService;
    private distanceService: google.maps.DistanceMatrixService;
    private trafficLayer: google.maps.TrafficLayer;
    private infowindow:google.maps.InfoWindow = new google.maps.InfoWindow();
    private overlayImages = [];
    private lotsLayerVal = 'Status';

    private exitwaysLayer:Layer;
    private lotsLayer:Layer;
    
    private isLoadingBS = new BehaviorSubject<boolean>(null);
    private mapBS = new BehaviorSubject<google.maps.Map>(null);
    private poiBS = new BehaviorSubject<Array<Poi>>(null);
    private directionTextBS = new BehaviorSubject<string>(null);
    private fromMarkerBS = new BehaviorSubject<any>(null);
    private endMarkerBS = new BehaviorSubject<any>(null);
    private waypoint = new BehaviorSubject<any>(null);
    
    public isLoadingObservable = this.isLoadingBS.asObservable();
    public mapObservable = this.mapBS.asObservable();
    public poiObservable = this.poiBS.asObservable();
    public directionTextObservable = this.directionTextBS.asObservable();
    public fromMarkerObservable = this.fromMarkerBS.asObservable();
    public endMarkerObservable = this.endMarkerBS.asObservable();
    public setting;

    constructor(
        public dialog:MatDialog,
        private authService: AuthService,
        private settingsService: SettingsService
    ) { 
        this.directionsDisplay = [];
        this.directionsService = new google.maps.DirectionsService();
        this.distanceService = new google.maps.DistanceMatrixService();
        this.originLatlng = new google.maps.LatLng(14.196695035103518, 121.07079287336092);
        this.defaultZoom = 6;
        this.defaultLatlng = new google.maps.LatLng(14.199300, 121.073541);
        this.defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(4.2158064, 114.0952145), 
            new google.maps.LatLng(21.3217806, 126.8072562)
        );
        this.phBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(4.2158064, 114.0952145), 
            new google.maps.LatLng(21.3217806, 126.8072562)
        );
        this.trafficLayer = new google.maps.TrafficLayer();
        this.MarkerWithLabel = markerWithLabel(google.maps);
        this.initSettings();
    }

    getMap() {
        return this.mapBS.value;
    }

    setLotsLayerVal(value:string, layer:Layer) {
        this.lotsLayerVal = value;
        layer.geom.forEach(
            feature => {
                feature.setProperty('lots_layer_val', value);
            }
        );
    }

    initSettings() {
        this.settingsService.dataObservable.subscribe(
            data => {
                if(data) {
                    this.setting = data;
                }
            }
        );
    }

    changeIsLoading(data) {
        this.isLoadingBS.next(data);
    }

    changeMap (map) {
        this.mapBS.next(map);
    }

    changePoi (data) {
        this.poiBS.next(data);
    }

    changeDirectionText (data) {
        this.directionTextBS.next(data);
    }

    changeFromMarker (data) {
        if(this.fromMarkerBS.value) {
            this.fromMarkerBS.value.setMap(null);
        }
        this.fromMarkerBS.next(data);
    }

    changeEndMarker (data) {
        if(this.endMarkerBS.value) {
            this.endMarkerBS.value.setMap(null);
        }
        this.endMarkerBS.next(data);
    }

    changeWaypoint (data) {
        if(this.waypoint.value) {
            this.waypoint.value.setMap(null);
        }
        this.waypoint.next(data);
    }

    centerMap(map:google.maps.Map) {
        map.setCenter(this.defaultLatlng);
        map.setZoom(this.defaultZoom);
    }

    createMap(mapElement) {
        const mapOptions: any = {
            zoom: this.defaultZoom,
            minZoom: 6,
            maxZoom: 23,
            center: this.defaultLatlng,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            fullscreenControl: false,
            gestureHandling: "greedy",
            mapTypeControl: false,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            panControl: false,
            scaleControl: true,
            clickableIcons: false,
            tilt: 45,
            rotateControl: true,
            styles: [{
                "featureType": "poi", "stylers": [{"visibility": "off"}]
            }],
            restriction: {
                latLngBounds: this.phBounds,
                strictBounds: true
            }
        };
        const map = new google.maps.Map(mapElement, mapOptions);
        this.placeService = new google.maps.places.PlacesService(map);
        return map;
    };

    createLatLng(lat, lng) {
        return new google.maps.LatLng({
            lat: lat,
            lng: lng
        });
    }

    createMVCObject(position, anchorPoint?) {
        let mvc = new google.maps.MVCObject();
        mvc.setValues({
            position: position,
            anchorPoint: anchorPoint
        });
        return mvc;
    }

    createMarker(map, latlng, markerImg?, title?, draggable?) {
        const marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: markerImg,
            title: title,
            draggable: draggable
        });
        return marker;
    }

    createMarkerWithLabel(map, latlng, label?, markerImg?, markerClass?) {
        let size = 40;
        if(!markerClass) {
            markerClass = 'marker-label-class';
        }
        const marker = new this.MarkerWithLabel({
            position: latlng,
            map: map,
            icon: markerImg,
            animation: google.maps.Animation.DROP,
            labelContent: label,
            labelAnchor: new google.maps.Point(-(size/2),30),
            labelInBackground: true,
            labelClass: markerClass
        });
        return marker;
    }

    createMarkerImage(url, size, origin, anchor) {
        if(url){
            const image = {
                url: url,
                scaledSize: size,
                origin: origin,
                anchor: anchor
            };
            return image;
        } else {
            return url;
        }
    }

    createMarkerImageDefault(icon) {
        let size = 40;
        
        return this.createMarkerImage(
            icon, 
            new google.maps.Size(size, size), 
            new google.maps.Point(0, 0), 
            new google.maps.Point(size / 2, size)
        );
    }

    createInfoWindow(map, marker, contentString, isOpen) {
        let infoWindow = new google.maps.InfoWindow({
            content: contentString
        });
        
        if(isOpen && marker) {
            infoWindow.open(map, marker);
        }

        if(marker) {
            google.maps.event.addListener(marker, 'click', 
                () => {
                    infoWindow.open(map, marker)
                }
            );
        }
        return infoWindow;
    }

    createLayer(name, map, geojson) {
        let layer:Layer = {} as Layer;
        layer.name = name;
        layer.checked = false;
        if(geojson) {
            layer.geom = new google.maps.Data();
            layer.geom.addGeoJson(geojson);
        }
        layer.map = map;
        layer.show = () => {
            if(layer.geom && layer.checked) {
                layer.geom.setMap(layer.map);
            }
        };
        layer.hide = () => {
            if(layer.geom) {
                layer.geom.setMap(null);
                this.infowindow.close();
            }
        };
        return layer;
    }


    changeMapType(type:google.maps.MapTypeId) {
        this.mapBS.value.setMapTypeId(type);
    }

    clearSearch() {
        this.clearSearchMarkers();
        this.changePoi([]);
        this.clearDirectionMarkers();
    }

    clearDirectionMarkers() {
        let fromMarker = this.fromMarkerBS.value
        let endMarker = this.endMarkerBS.value;
        let wp = this.waypoint.value;
        if(endMarker && fromMarker) {
            endMarker.setMap(null);
            fromMarker.setMap(null);
        }
        if(wp) {
            wp.setMap(null);
        }
    }

    clearSearchMarkers() {
        this.directionsDisplay.forEach(data => data.setMap(null));
        this.search_markers.forEach(marker => {
            marker.setMap(null);
        });
        this.search_markers = [];
    }

    placeSearch(elem_id, basemap) {
        let searchBox = this.createSearchBox(elem_id);
        let that = this;
        that.search_markers = [];
        searchBox.addListener("places_changed", function() {
            let poiList = [];
            that.clearSearch();
            let places = searchBox.getPlaces();
            if (!places.length) return;

            places.forEach(place => {
                poiList.push(place as Poi);
            });
            that.changePoi(poiList);
        });
    }

    calculateRoute(map:google.maps.Map) {
        let that = this;
        let waypoints = null;
        let fromMarker = this.fromMarkerBS.value;
        let endMarker = this.endMarkerBS.value;
        let wp = this.waypoint.value;
        if(wp) {
            wp.setMap(that.getMap());
            waypoints = [{
                location: wp.getPosition(),
                stopover: true
            }];
        }
        if(fromMarker && endMarker) {
            that.directionsService.route({
                origin: fromMarker.getPosition(),
                destination: endMarker.getPosition(),
                travelMode: google.maps.TravelMode.DRIVING,
                drivingOptions: {
                    departureTime: new Date(),
                    trafficModel: google.maps.TrafficModel.PESSIMISTIC
                },
                unitSystem: google.maps.UnitSystem.METRIC,
                waypoints: waypoints
            }, (response, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    that.clearSearchMarkers();
                    endMarker.setMap(that.getMap());
                    for(let i = 0; i < response.routes.length; i++) {
                        that.directionsDisplay[i] = new google.maps.DirectionsRenderer({
                            suppressMarkers: true,
                            map: map,
                            directions: response,
                            routeIndex: i,
                            polylineOptions: { 
                                strokeOpacity:1, 
                                strokeColor: i > 0 ? AppConstants.$open : '#4A8BF4', 
                                zIndex: response.routes.length - i
                            },
                            infoWindow: that.createInfoWindow(map, null, that.directionsContent(response.routes[i]), true)
                        });
                        that.directionsDisplay[i].setPanel(document.getElementById('directionSteps'));
                    }
                }
            });
        }
    }

    toggleTrafficLayer(map:google.maps.Map) {
        this.trafficLayer.setMap(map);
    }

    // helper functions

    latLng2Point(latLng) {
        let map = this.mapBS.value;
        let topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
        let bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
        let scale = Math.pow(2, map.getZoom());
        let worldPoint = map.getProjection().fromLatLngToPoint(latLng);
        return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
    }

    point2LatLng(point) {
        let map = this.mapBS.value;
        let topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
        let bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
        let scale = Math.pow(2, map.getZoom());
        let worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
        return map.getProjection().fromPointToLatLng(worldPoint);
    }

    createSearchBox(elem_id) {
        let searchBox = new google.maps.places.SearchBox(elem_id);
        searchBox.setBounds(this.defaultBounds);
        return searchBox;
    }

    directionsContent(route): any {
        const legs = route.legs[0];
        const html = '<div class="container-fluid" style="max-width:200px;">'+
            '<div class="row py-1">' +
                '<div class="col-md-4 font-weight-bold my-auto">Distance:</div>' +
                '<div class="col-md-8 small my-auto">' + legs.distance.text + '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 font-weight-bold my-auto">ETA:</div>' +
                '<div class="col-md-8 small my-auto">' + legs.duration.text + '</div>' +
            '</div>' +
        '</div>';
        return html;
    }

    setInfowindowContent(name, distance, duration?) {
        return '<div style="font-weight: bold;padding-bottom:3px;">' + name + '</div><div style="font-size: 90%;">' + distance + '</div>';
    }

    rad(x) {
        return x * Math.PI / 180;
    }
       
    getDistance(p1, p2) {
        let R = 6378137; // Earth’s mean radius in meter
        let dLat = this.rad(p2.lat() - p1.lat());
        let dLong = this.rad(p2.lng() - p1.lng());
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
          Math.sin(dLong / 2) * Math.sin(dLong / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        return d; // returns the distance in meter
    }

    getDistanceInKM(p1, p2) {
        return this.getDistance(p1, p2) / 1000;
    }
}