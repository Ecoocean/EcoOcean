import React, {useMemo} from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import DrawTools from "./DrawTools";


const MapSmall = props => {

   const map = useMemo( () => {
      return  (
         <MapContainer
             style={{ height: '40vh', width: '100wh' }}
            doubleClickZoom={true}
            zoomControl={false}
            id="mapId"
             center={[31.8117257, 33.5818155]}
             zoom={8}
             maxZoom={18}
            whenCreated={props.setMap}>
            <DrawTools/>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>

             {props.children}
         </MapContainer>
      )
   }, [])

   return  map

}

export default MapSmall