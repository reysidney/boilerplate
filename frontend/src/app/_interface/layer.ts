export interface Layer {
    name:string;
    geom?:google.maps.Data;
    show:Function;
    hide:Function;
    checked:boolean;
    map:google.maps.Map;
}
