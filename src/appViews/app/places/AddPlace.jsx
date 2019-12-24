import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { firebaseCollections } from "constants/database";
import { withNotifications, withPrompt } from "higherOrderComponents";
import MapContainer from "appComponents/Maps/MapContainer";

import { createNewDocumentInDb } from "db";
import { addDocumentsToCollection } from "redux/actions";

const INITIAL_STATE = {
  lat: "",
  lng: "",
  name: "",
  error: "",
};
class AddPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  saveChangesToDb() {
    const { lat, lng, name } = this.state;
    if (lat && lng && name) {
      this.setState({ error: "" });
      let newPlace = { lat, lng, name, status: 10 };
      createNewDocumentInDb(null, newPlace, firebaseCollections.PLACES)
        .then(res => {
          newPlace.id = res.documentId;
          this.props.addDocumentsToCollection(
            { [res.documentId]: newPlace },
            firebaseCollections.PLACES
          );
          this.props.showNotification("Place successfully saved", "success");
          document.getElementById("closeAddPlaceModal").click();
          this.props.openEditingModal(newPlace);
        })
        .catch(error => {
          const errorMessage = error.response
            ? error.response.data.details
            : "An error occured while saving place :(. Please refresh and try again.";
          this.props.showNotification(errorMessage, "danger");
          console.error(error);
        });
    } else {
      let error = "";
      if (!this.state.lng) error = "Please enter longitude";
      if (!this.state.lat) error = "Please enter latitude";
      if (!this.state.name) error = "Please enter place name";
      this.setState({ error });
    }
  }

  handleCloseModal(e) {
    e.preventDefault();
    const { lat, lng, name } = this.state;

    const realCloseButton = document.getElementById("closeAddPlaceModal");
    if (lat || lng || name) {
      this.props.showPrompt(
        "Place not saved!",
        "Are you sure you want to discard entered data?",
        () => {},
        "Continue",
        () => {
          this.setState({ ...INITIAL_STATE });
          realCloseButton.click();
        },
        "Discard"
      );
    } else {
      realCloseButton.click();
    }
  }

  render() {
    const mapMarkers = [
      {
        title: this.state.name,
        lat: this.state.lat,
        lng: this.state.lng,
      },
    ];

    return (
      <div
        className="modal fade"
        id="addPlaceModal"
        tabIndex="-1"
        data-backdrop="static"
        data-keyboard="false"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title" id="exampleModalLabel">
                Creating new place
              </h2>
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={e => this.handleCloseModal(e)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-2 selectorTitle">
                  <span>Name:</span>
                </div>
                <div className="col-10">
                  <input
                    name="name"
                    className="inputStyle"
                    placeholder="Enter place name"
                    value={this.state.name}
                    onChange={e => this.setState({ name: e.target.value })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-2 selectorTitle">
                  <span>Latitude:</span>
                </div>
                <div className="col-10">
                  <input
                    name="lat"
                    className="inputStyle"
                    placeholder="Enter the latitude"
                    value={this.state.lat}
                    onChange={e => this.setState({ lat: e.target.value })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-2 selectorTitle">
                  <span>Longitude:</span>
                </div>
                <div className="col-10">
                  <input
                    name="lng"
                    className="inputStyle"
                    placeholder="Enter the longitude"
                    value={this.state.lng}
                    onChange={e => this.setState({ lng: e.target.value })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12" style={{ minHeight: 300, padding: 0 }}>
                  <MapContainer markers={mapMarkers} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <span style={{ color: "red" }}>{this.state.error}</span>
              <button
                id="closeAddPlaceModal"
                type="button"
                style={{ display: "none" }}
                data-dismiss="modal"
                className="btn btn-secondary"
                onClick={e => e.preventDefault}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={e => this.handleCloseModal(e)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.saveChangesToDb.bind(this)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const AddPlaceDispatch = function(dispatch) {
  return {
    addDocumentsToCollection: function(doc, collectionName) {
      addDocumentsToCollection(doc, collectionName, dispatch);
    },
  };
};

export default compose(connect(null, AddPlaceDispatch))(withPrompt(withNotifications(AddPlace)));
