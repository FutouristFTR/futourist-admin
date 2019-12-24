import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";

import { firebaseCollections } from "constants/database";
import { withNotifications, withPrompt } from "higherOrderComponents";
import { makeImageUrl, objectDeepCompare } from "utils";

import { updateDocumentInDb, deleteDocumentFromDb } from "db";
import { updateDocumentInCollection, deleteDocumentFromCollection } from "redux/actions";
import Tabs from "appComponents/Tabs/Tabs";
import {
  EditPlaceGeneralInformation,
  EditPlacePhotos,
  EditPlaceLocation,
  EditPlaceBusiness,
} from "appViews";
import { fileTypes } from "constants/media";

class EditPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editedPlace: {},
      currentPlaceForInputs: {},
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.setPlaceProperty = this.setPlaceProperty.bind(this);
  }

  componentDidMount() {
    document.getElementById("defaultOpen").click();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentPlace && nextProps.currentPlace.id !== prevState.editedPlace.id) {
      return { editedPlace: nextProps.currentPlace };
    }
    return null;
  }

  openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  setPlaceProperty(fieldName, fieldValue) {
    switch (fieldName) {
      case "categories": {
        let categoriesToSave = {};
        fieldValue.forEach(selectedCategory => {
          categoriesToSave[selectedCategory.value] = true;
        });
        this.setState({
          editedPlace: {
            ...this.state.editedPlace,
            categories: categoriesToSave,
          },
        });
        break;
      }

      case "tags": {
        this.setState({
          editedPlace: {
            ...this.state.editedPlace,
            [fieldName]: fieldValue.join(),
          },
        });
        break;
      }

      default:
        this.setState({
          editedPlace: { ...this.state.editedPlace, [fieldName]: fieldValue },
        });
        break;
    }
  }

  saveChangesToDb() {
    if (objectDeepCompare(this.state.editedPlace, this.props.currentPlace)) {
      this.props.showNotification("No changes were made", "info");
    } else {
      let placeToWrite = Object.assign({}, this.state.editedPlace);
      // delete placeToWrite.photos;
      updateDocumentInDb(placeToWrite.id, placeToWrite, firebaseCollections.PLACES)
        .then(() => {
          this.props.updateDocumentInCollection(
            this.state.editedPlace.id,
            this.state.editedPlace,
            firebaseCollections.PLACES
          );
          this.props.showNotification("Place successfully saved", "success");
        })
        .catch(error => {
          this.props.showNotification(
            "An error occured while saving place :(. Please refresh and try again.",
            "danger"
          );
          console.error(error);
        });
    }
  }

  onDeletePlaceClicked() {
    this.props.showPrompt(
      "Are you sure",
      "The place will be permanently deleted.",
      () => this.deletePlace(),
      "Delete"
    );
  }

  deletePlace() {
    return deleteDocumentFromDb(this.props.currentPlace.id, firebaseCollections.PLACES)
      .then(() => {
        this.props.deleteDocumentFromCollection(
          this.props.currentPlace.id,
          firebaseCollections.PLACES
        );
        this.props.showNotification("Place successfully deleted", "success");
        document.getElementById("closeEditModalButton").click();
        this.props.history.push("/" + firebaseCollections.PLACES);
      })
      .catch(error => {
        this.props.showNotification("An error occured while trying to delete a place.", "danger");
        console.error(error);
      });
  }

  handleCloseModal(e) {
    e.preventDefault();
    const realCloseButton = document.getElementById("closeEditModalButton");

    if (!objectDeepCompare(this.props.currentPlace, this.state.editedPlace)) {
      this.props.showPrompt(
        "Place not saved!",
        "Are you sure you want to discard changes?",
        () => {
          this.saveChangesToDb();
          realCloseButton.click();
          this.props.history.push("/" + firebaseCollections.PLACES);
        },
        "Save",
        () => {
          this.setState({ editedPlace: this.props.currentPlace });
          realCloseButton.click();
        },
        "Discard"
      );
    } else {
      realCloseButton.click();
      this.props.history.push("/" + firebaseCollections.PLACES);
    }
  }

  render() {
    const currentPlaceForInputs = adaptPlaceDataForInputs(this.state.editedPlace);

    const placeCoverImage =
      currentPlaceForInputs.photos && currentPlaceForInputs.photos.length
        ? makeImageUrl(
            currentPlaceForInputs.photos[0].id,
            currentPlaceForInputs.id,
            firebaseCollections.PLACES,
            1280,
            fileTypes.PHOTO
          )
        : null;

    const generalInformationComponent = (
      <EditPlaceGeneralInformation
        currentPlace={currentPlaceForInputs}
        onChange={this.setPlaceProperty.bind(this)}
      />
    );

    const photosComponent = (
      <EditPlacePhotos
        currentPlace={currentPlaceForInputs}
        onChange={this.setPlaceProperty.bind(this)}
      />
    );

    const locationComponent = (
      <EditPlaceLocation
        currentPlace={currentPlaceForInputs}
        onChange={this.setPlaceProperty.bind(this)}
      />
    );

    const businessComponent = (
      <EditPlaceBusiness
        currentPlace={currentPlaceForInputs}
        onChange={this.setPlaceProperty.bind(this)}
      />
    );

    return (
      <div
        className="modal fade editModal"
        id="editModal"
        tabIndex="-1"
        data-backdrop="static"
        data-keyboard="false"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog editModalDialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title" id="exampleModalLabel">
                Editing {this.state.editedPlace && this.state.editedPlace.name}
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
            <div className="modal-body editModalBody">
              <div>
                <div
                  className="coverPhoto"
                  style={{ backgroundImage: `url(${placeCoverImage})` }}
                />
                <div className="tabcontainer" style={{ marginTop: -110 }}>
                  <Tabs
                    tabTitles={["General", "Location", "Photo Gallery", "Business"]}
                    tabsContent={[
                      generalInformationComponent,
                      locationComponent,
                      photosComponent,
                      businessComponent,
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                id="closeEditModalButton"
                type="button"
                style={{ display: "none" }}
                data-dismiss="modal"
                className="btn btn-secondary"
                onClick={e => e.preventDefault}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={e => this.handleCloseModal(e)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={e => this.onDeletePlaceClicked(e)}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.saveChangesToDb.bind(this)}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const EditPlaceDispatch = function(dispatch) {
  return {
    updateDocumentInCollection: function(docId, doc, collectionName) {
      updateDocumentInCollection(docId, doc, collectionName, dispatch);
    },
    deleteDocumentFromCollection: function(docId, collectionName) {
      deleteDocumentFromCollection(docId, collectionName, dispatch);
    },
  };
};

export default compose(connect(null, EditPlaceDispatch))(
  withPrompt(withNotifications(withRouter(EditPlace)))
);

function adaptPlaceDataForInputs(placeData) {
  let placeData2 = Object.assign({}, placeData);

  if (
    (placeData2.tags && typeof placeData2.tags === "string") ||
    placeData2.tags instanceof String
  ) {
    placeData2.tags = placeData2.tags.split(",");
  }

  if (
    placeData2.categories &&
    placeData2.categories !== null &&
    typeof placeData2.categories === "object"
  ) {
    placeData2.categories = Object.keys(placeData2.categories).map(category => {
      return { label: category, value: category };
    });
  }
  return placeData2;
}
