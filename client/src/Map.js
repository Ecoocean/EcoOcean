import React, {useMemo} from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import Layers from './Layers';


const Map = props => {
   const options = { pmIgnore: false};
   const map = useMemo( () => {
      return  (
         <MapContainer
            options={options}
            doubleClickZoom={true}
            zoomControl={false}
            id="mapId"
            center={[31.8117257, 34.5818155]}
            zoom={7}
            maxZoom={19}
            whenCreated={props.setMap}>

             {props.children}
             <Layers/>
         </MapContainer>
      )
   }, [])

   return  map

}

export default Map