import React, {useMemo} from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import Layers from './Layers';


const MapSmall = props => {

   const map = useMemo( () => {
      return  (
         <MapContainer
             style={{ height: '40vh', width: '100wh' }}
            doubleClickZoom={true}
            zoomControl={false}
            id="mapId"
            center={[31.4117257, 35.0818155]}
            zoom={8}
            maxZoom={18}
            whenCreated={props.setMap}>
   
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>

             {props.children}
             <Layers/>
         </MapContainer>
      )
   }, [])

   return  map

}

export default MapSmall