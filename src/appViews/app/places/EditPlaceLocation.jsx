import React, { Component } from "react";
import SectionTitle from "appComponents/SectionTitle/SectionTitle";
import MapContainer from "appComponents/Maps/MapContainer";
import { CountryDropdown } from "react-country-region-selector";

class EditPlaceGeneralInformation extends Component {
  render() {
    let mapMarkers = [
      {
        title: this.props.currentPlace.name,
        lat: this.props.currentPlace.lat,
        lng: this.props.currentPlace.lng,
      },
    ];

    return (
      <div>
        <SectionTitle title="Edit place's contact and location info" />

        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Location:</span>
          </div>
          <div className="col-5">
            <div className="row">
              <div className="col-3 selectorTitle">
                <span className="locationTitle">Latitude: </span>
              </div>
              <div className="col-9">
                <input
                  name="lat"
                  className="inputStyle"
                  value={this.props.currentPlace.lat || ""}
                  placeholder="Enter place's latitude"
                  onChange={event => {
                    this.props.onChange("lat", event.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-5">
            <div className="row">
              <div className="col-3 selectorTitle">
                <span className="locationTitle">Longitude: </span>
              </div>
              <div className="col-9">
                <input
                  name="lng"
                  className="inputStyle"
                  value={this.props.currentPlace.lng || ""}
                  placeholder="Enter place's longitude"
                  onChange={event => {
                    this.props.onChange("lng", event.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12" style={{ minHeight: 300 }}>
            <MapContainer markers={mapMarkers} />
          </div>
        </div>

        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Street:</span>
          </div>
          <div className="col-10">
            <input
              name="street"
              className="inputStyle"
              placeholder="Enter the place's street address"
              value={this.props.currentPlace.street || ""}
              onChange={event => {
                this.props.onChange("street", event.target.value);
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-2 selectorTitle">
            <span>City:</span>
          </div>
          <div className="col-sm-10 col-md-4">
            <input
              name="city"
              className="inputStyle"
              placeholder="Enter the city"
              value={this.props.currentPlace.city || ""}
              onChange={event => {
                this.props.onChange("city", event.target.value);
              }}
            />
          </div>

          <div className="col-2 selectorTitle">
            <span>ZIP:</span>
          </div>
          <div className="col-sm-10 col-md-4">
            <input
              name="zip"
              className="inputStyle"
              placeholder="Enter the ZIP number"
              value={this.props.currentPlace.zip || ""}
              onChange={event => {
                this.props.onChange("zip", event.target.value);
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Country:</span>
          </div>
          <div className="col-10">
            <CountryDropdown
              classes="inputStyle"
              value={this.props.currentPlace.cc || ""}
              valueType="short"
              onChange={val => this.props.onChange("cc", val)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default EditPlaceGeneralInformation;
