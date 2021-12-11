import React from "react";
import {
	FeatureGroup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import ErrorBoundary from "./ErrorBoundary";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const DrawTools = () => {
	const _onEdited = e => {
		let numEdited = 0;
		e.layers.eachLayer(layer => {
			numEdited += 1;
		});
		console.log(`_onEdited: edited ${numEdited} layers`, e);

		// this._onChange();
	};

	const _onCreated = e => {
		let type = e.layerType;
		let layer = e.layer;
		if (type === "marker") {
			// Do marker specific actions
			console.log("_onCreated: marker created", e);
		} else {
			console.log("_onCreated: something else created:", type, e);
		}

		console.log("Geojson", layer.toGeoJSON());
		// Do whatever else you need to. (save to db; etc)

		// this._onChange();
	};

	const _onDeleted = e => {
		let numDeleted = 0;
		e.layers.eachLayer(layer => {
			numDeleted += 1;
		});
		console.log(`onDeleted: removed ${numDeleted} layers`, e);

		// this._onChange();
	};

	const _onMounted = drawControl => {
		console.log("_onMounted", drawControl);
	};

	const _onEditStart = e => {
		console.log("_onEditStart", e);
	};

	const _onEditStop = e => {
		console.log("_onEditStop", e);
	};

	const _onDeleteStart = e => {
		console.log("_onDeleteStart", e);
	};

	const _onDeleteStop = e => {
		console.log("_onDeleteStop", e);
	};

	const _onDrawStart = e => {
		console.log("_onDrawStart", e);
	};

	return (
		<FeatureGroup>
			<ErrorBoundary>
				<EditControl
					onDrawStart={_onDrawStart}
					position="bottomleft"
					onEdited={_onEdited}
					onCreated={_onCreated}
					onDeleted={_onDeleted}
					draw={{
						polyline: {
							icon: new L.DivIcon({
								iconSize: new L.Point(8, 8),
								className: "leaflet-div-icon leaflet-editing-icon"
							}),
							shapeOptions: {
								guidelineDistance: 10,
								color: "navy",
								weight: 3
							}
						},
						rectangle: true,
						marker: false,
						circlemarker: false,
						circle: true,
						polygon: true
					}}/>
				</ErrorBoundary>
		</FeatureGroup>
	);
};

export default DrawTools;
