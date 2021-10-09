import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import "./style.css";
const Marker = ({ children }) => children;
class MyLocationMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
        currentLocation: {
            lat: 31.4117257,
            lng: 35.0818155 
        }   
    }
   }

  render() {
    console.log(this.state.inputRad);
    const apiIsLoaded = (map, maps) => {
      // eslint-disable-next-line no-unused-expressions
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lng } }) => {
          const pos = { lat, lng };
          this.setState({ currentLocation: pos });
        },
        (err) => console.log(err),
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
      );
    };
    return (
      <div>
        <div style={{ height: "400px", width: "100%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
            defaultCenter={{ lat: 40.756795, lng: -73.954298 }}
            options = {{
                minZoom: 8,
                gestureHandling:'greedy'
            }}
            defaultZoom={15}
            center={this.state.currentLocation}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
          >
              <Marker lat={this.state.currentLocation.lat}
              lng ={this.state.currentLocation.lng}>
                <button className="report-marker">
                <img src="/images/blue_marker.png" alt="cant load pic" />
              </button>
              </Marker>
        </GoogleMapReact>
        </div>
      </div>
    );
  }
}
export default MyLocationMap;