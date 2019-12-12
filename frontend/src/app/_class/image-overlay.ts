export class ImageOverlay {
    
    public overlay;
    constructor(bounds:google.maps.LatLngBounds, srcImage:string, map:google.maps.Map, zIndex?) {
        this.overlay = new this.ImageOverlayClass(bounds, srcImage, map, zIndex);
    }
    
    ImageOverlayClass = class extends google.maps.OverlayView {
        public _bounds;
        public _image;
        public _div;
        public _zIndex;

        constructor(bounds:google.maps.LatLngBounds, srcImage:string, map:google.maps.Map, zIndex?) { 
            super();
            this._bounds = bounds;
            this._image = srcImage;
            this._zIndex = zIndex
            this._div = null;
            this.setMap(map);
        }

        onAdd() {
            var div = document.createElement('div');
            div.style.borderStyle = 'none';
            div.style.borderWidth = '0px';
            div.style.position = 'absolute';
        
            // Create the img element and attach it to the div.
            var img = document.createElement('img');
            img.src = this._image;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.position = 'absolute';
            img.style.zIndex = this._zIndex;
            div.appendChild(img);
        
            this._div = div;
        
            // Add the element to the "overlayLayer" pane.
            var panes = this.getPanes();
            panes.overlayLayer.appendChild(div);
        }
    
        draw() {
            var overlayProjection = this.getProjection();
            var sw = overlayProjection.fromLatLngToDivPixel(this._bounds.getSouthWest());
            var ne = overlayProjection.fromLatLngToDivPixel(this._bounds.getNorthEast());
        
            // Resize the image's div to fit the indicated dimensions.
            var div = this._div;
            div.style.left = sw.x + 'px';
            div.style.top = ne.y + 'px';
            div.style.width = (ne.x - sw.x) + 'px';
            div.style.height = (sw.y - ne.y) + 'px';
        }
    
        onRemove() {
            this._div.parentNode.removeChild(this._div);
            this._div = null;
        }
    };

    hide() {
        this.overlay.setMap(null);
    }

    show(map) {
        this.overlay.setMap(map);
    }

    
}