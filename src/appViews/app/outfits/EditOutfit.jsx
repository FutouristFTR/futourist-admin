import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";

import { firebaseCollections } from "constants/database";
import { withNotifications, withPrompt, withCollection } from "higherOrderComponents";
import { makeImageUrl, objectDeepCompare } from "utils";

import { updateDocumentInDb, deleteDocumentFromDb } from "db";
import { updateDocumentInCollection, deleteDocumentFromCollection } from "redux/actions";
import Tabs from "appComponents/Tabs/Tabs";
import { EditOutfitGeneralInformation, EditOutfitDayPart } from "appViews";
import { fileTypes } from "constants/media";

class EditOutfit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editedOutfit: {},
      currentOutfitForInputs: {},
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.setOutfitProperty = this.setOutfitProperty.bind(this);
  }

  componentDidMount() {
    document.getElementById("defaultOpen").click();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentOutfit && nextProps.currentOutfit.id !== prevState.editedOutfit.id) {
      return { editedOutfit: nextProps.currentOutfit };
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

  setOutfitProperty(fieldValue, fieldName, fieldName2) {
    switch (fieldName) {
      case "morning":
      case "day":
      case "evening": {
        this.setState({
          editedOutfit: {
            ...this.state.editedOutfit,
            [fieldName]: {
              ...this.state.editedOutfit[fieldName],
              [fieldName2]: fieldValue,
            },
          },
        });
        break;
      }

      default: {
        this.setState({
          editedOutfit: { ...this.state.editedOutfit, [fieldName]: fieldValue },
        });
        break;
      }
    }
  }

  saveChangesToDb() {
    if (objectDeepCompare(this.state.editedOutfit, this.props.currentOutfit)) {
      this.props.showNotification("No changes were made", "info");
    } else {
      let outfitToWrite = Object.assign({}, this.state.editedOutfit);
      updateDocumentInDb(outfitToWrite.id, outfitToWrite, firebaseCollections.OUTFITS)
        .then(() => {
          this.props.updateDocumentInCollection(
            this.state.editedOutfit.id,
            this.state.editedOutfit,
            firebaseCollections.OUTFITS
          );
          this.props.showNotification("Outfit successfully saved", "success");
        })
        .catch(error => {
          this.props.showNotification(
            "An error occured while saving outfit :(. Please refresh and try again.",
            "danger"
          );
          console.error(error);
        });
    }
  }

  onDeletePlaceClicked() {
    this.props.showPrompt(
      "Are you sure",
      "The outfit will be permanently deleted.",
      () => this.deleteOutfit(),
      "Delete"
    );
  }

  deleteOutfit() {
    return deleteDocumentFromDb(this.props.currentOutfit.id, firebaseCollections.OUTFITS).then(
      () => {
        this.props.deleteDocumentFromCollection(
          this.props.currentOutfit.id,
          firebaseCollections.OUTFITS
        );
        this.props.showNotification("Outfit successfully deleted", "success");
        document.getElementById("closeEditModalButton").click();
        this.props.history.push("/" + firebaseCollections.OUTFITS);
      }
    );
  }

  handleCloseModal(e) {
    e.preventDefault();
    const realCloseButton = document.getElementById("closeEditModalButton");

    if (!objectDeepCompare(this.props.currentOutfit, this.state.editedOutfit)) {
      this.props.showPrompt(
        "Outfit not saved!",
        "Are you sure you want to discard changes?",
        () => {
          this.saveChangesToDb();
          realCloseButton.click();
          this.props.history.push("/" + firebaseCollections.OUTFITS);
        },
        "Save",
        () => {
          this.setState({ editedOutfit: this.props.currentOutfit });
          realCloseButton.click();
        },
        "Discard"
      );
    } else {
      realCloseButton.click();
      this.props.history.push("/" + firebaseCollections.OUTFITS);
    }
  }

  render() {
    const currentOutfitForInputs = adaptOutfitDataForInputs(this.state.editedOutfit);

    const outfitCoverImage = currentOutfitForInputs.coverPhoto
      ? makeImageUrl(
          currentOutfitForInputs.coverPhoto.id,
          currentOutfitForInputs.id,
          firebaseCollections.OUTFITS,
          1280,
          fileTypes.COVER
        )
      : null;

    const tabTitles = ["General", "Morning", "Day", "Evening"];
    const tabContent = [
      <EditOutfitGeneralInformation
        currentOutfit={currentOutfitForInputs}
        onChange={this.setOutfitProperty.bind(this)}
      />,
      <EditOutfitDayPart
        dayPart="morning"
        currentOutfit={currentOutfitForInputs}
        onChange={this.setOutfitProperty.bind(this)}
      />,
      <EditOutfitDayPart
        dayPart="day"
        currentOutfit={currentOutfitForInputs}
        onChange={this.setOutfitProperty.bind(this)}
      />,
      <EditOutfitDayPart
        dayPart="evening"
        currentOutfit={currentOutfitForInputs}
        onChange={this.setOutfitProperty.bind(this)}
      />,
    ];

    return (
      <div
        className="modal fade editModal"
        id="editOutfitModal"
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
                Editing {this.state.editedOutfit && this.state.editedOutfit.title}
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
                  style={{ backgroundImage: `url(${outfitCoverImage})` }}
                />
                <div className="tabcontainer" style={{ marginTop: -110 }}>
                  <Tabs tabTitles={tabTitles} tabsContent={tabContent} />
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

const EditOutfitDispatch = function(dispatch) {
  return {
    updateDocumentInCollection: function(docId, doc, collectionName) {
      updateDocumentInCollection(docId, doc, collectionName, dispatch);
    },
    deleteDocumentFromCollection: function(docId, collectionName) {
      deleteDocumentFromCollection(docId, collectionName, dispatch);
    },
  };
};
export default compose(connect(null, EditOutfitDispatch))(
  withPrompt(withNotifications(withRouter(withCollection(firebaseCollections.PLACES)(EditOutfit))))
);

function adaptOutfitDataForInputs(outfitData) {
  let outfitData2 = Object.assign({}, outfitData);

  if (
    (outfitData2.tags && typeof outfitData2.tags === "string") ||
    outfitData2.tags instanceof String
  ) {
    outfitData2.tags = outfitData2.tags.split(",");
  }

  if (
    outfitData2.categories &&
    outfitData2.categories !== null &&
    typeof outfitData2.categories === "object"
  ) {
    outfitData2.categories = Object.keys(outfitData2.categories).map(category => {
      return { label: category, value: category };
    });
  }
  return outfitData2;
}
