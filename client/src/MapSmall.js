import React, {useMemo} from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import DrawTools from "./DrawTools";
import ErrorBoundary from "./ErrorBoundary"

const MapSmall = props => {

   const map = useMemo( () => {
      return  (
         <MapContainer
             style={{ height: '60vh', width: '100wh' }}
            doubleClickZoom={true}
            zoomControl={false}
            id="mapId"
             center={[31.8117257, 33.5818155]}
             zoom={8}
             maxZoom={19}
            whenCreated={props.setMap}>
             <ErrorBoundary>
                 <DrawTools/>
             </ErrorBoundary>
            <TileLayer
                maxNativeZoom={19}
                maxZoom={22}
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
             {props.children}
         </MapContainer>
      )
   }, [])

   return  map

}

export default MapSmall