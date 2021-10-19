import React, { Component } from "react";
import { Button, Spinner } from "react-bootstrap";
import GoogleMapReact from "google-map-react";

const Marker = (props: any) => props.children;

const initialState = {
  currentLocation: {
    lat: 31.4117257,
    lng: 35.0818155,
  },
  locationFound: false,
};

type State = Readonly<typeof initialState>;
class MyLocationMap extends Component<{ onLocationFound: any }, State> {
  private locationWatchID: any;
  readonly state: State = initialState;

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.locationWatchID);
  }

  render() {
    const apiIsLoaded = (map: any, maps: any) => {
      // eslint-disable-next-line no-unused-expressions
      this.locationWatchID = navigator.geolocation.watchPosition(
        ({ coords: { latitude: lat, longitude: lng, accuracy: acc } }) => {
          console.log(acc);
          if (acc < 5000) {
            // if the location is within 50 meters
            const pos = { lat, lng };
            this.setState({ currentLocation: pos });
            this.setState({ locationFound: true });
            this.props.onLocationFound();
          }
        },
        (err) => console.log(err),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 1000,
        }
      );
    };
    const googleKey: GoogleMapReact.BootstrapURLKeys = {
      key: process.env.REACT_APP_GOOGLE_TOKEN!,
    };
    return (
      <div>
        <div style={{ height: "400px", width: "100%" }}>
          {!this.state.locationFound && (
            <Button variant="primary">
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              getting accurate location...
            </Button>
          )}
          <GoogleMapReact
            bootstrapURLKeys={googleKey}
            defaultCenter={{ lat: 40.756795, lng: -73.954298 }}
            options={{
              minZoom: 8,
              gestureHandling: "greedy",
            }}
            defaultZoom={15}
            center={this.state.currentLocation}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
          >
            {this.state.locationFound && (
              <Marker
                lat={this.state.currentLocation.lat}
                lng={this.state.currentLocation.lng}
              >
                <div>
                  <button className="report-marker">
                    <img src="/images/blue_marker.png" alt="cant load pic" />
                  </button>
                </div>
              </Marker>
            )}
          </GoogleMapReact>
        </div>
      </div>
    );
  }
}
export default MyLocationMap;
