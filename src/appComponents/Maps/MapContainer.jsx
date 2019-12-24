import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

export class MapContainer extends Component {
  render() {
    let mapCenter = {
      lat: this.props.markers[0].lat,
      lng: this.props.markers[0].lng,
    };
    return (
      <Map google={this.props.google} zoom={14} center={mapCenter}>
        {this.props.markers &&
          this.props.markers.map((marker, index) => {
            return (
              <Marker
                key={index}
                title={marker.title || ""}
                name={marker.title || ""}
                position={{ lat: marker.lat, lng: marker.lng }}
              />
            );
          })}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
})(MapContainer);
