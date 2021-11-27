import React, {useMemo} from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import Layers from './Layers';


const Map = props => {

   const map = useMemo( () => {
      return  (
         <MapContainer 
            doubleClickZoom={true}
            zoomControl={false}
            id="mapId"
            center={[31.8117257, 33.5818155]}
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

export default Map