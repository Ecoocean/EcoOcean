import L from "leaflet";
import * as turf from '@turf/turf';
import {gvulotVar, sensVar, mainMapVar, clearMapVar} from "./cache";
import { redGreenScaleLayers } from "./chromaColors";


let controller = null
let sensGroupLocal, gvulGroupLocal, basicLayer;

const generateLayers = () => {
    const map = mainMapVar()
    const gvulot = gvulotVar();
    const sens = sensVar();
    if(controller) {
        basicLayer.removeFrom(map);
        gvulGroupLocal.removeFrom(map);
        sensGroupLocal.removeFrom(map);
        controller.remove();
    }
    const gvulots = gvulot.map((gvul, i) => {
        const myStyle = {
            "color": redGreenScaleLayers(gvul.score).hex(),
            "weight": 4,
            "opacity": 0.80
        };
        return L.geoJSON(gvul.geom.geojson, {
            style: myStyle
        });
    });
    const pub_sens = sens.map((sens, i) => {

        var myStyle = {
            "color": redGreenScaleLayers(sens.score).hex(),
            "weight": 5,
            "opacity": 0.65
        };
        const layer = L.geoJSON(sens.geom.geojson, {
            style: myStyle
        });
        layer.bindPopup(`<p>ID ${sens.id}<br />area: ${turf.area(layer.toGeoJSON())}</p>`);
        return layer;
    });

    const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    basicLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxNativeZoom: 19,
        maxZoom: 22
    });
    const estriSat = L.tileLayer(
        'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 20,
        });


    const baseMaps = {
        "Base": basicLayer,
        "Streets": googleStreets,
        "Hybrid": googleHybrid,
        "Terrain": googleTerrain,
        "Satellite": googleSat,
        "Another Satellite": estriSat,
    };
    gvulGroupLocal = L.layerGroup(gvulots);
    sensGroupLocal = L.layerGroup(pub_sens);

    const overlayMaps = {
        "Municipal": gvulGroupLocal,
        "Beach Segments": sensGroupLocal
    };
    controller = L.control.layers(baseMaps, overlayMaps, {position: 'topright'}).addTo(map);
    //make the layer active.
    basicLayer.addTo(map);
    gvulGroupLocal.addTo(map);
    sensGroupLocal.addTo(map);
}

export default generateLayers;