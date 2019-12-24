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
import { EditBundleGeneralInformation, EditBundlePlaces } from "appViews";
import { fileTypes } from "constants/media";
import { appRoutes } from "routes";

class EditBundle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editedBundle: {},
      currentBundleForInputs: {},
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.setBundleProperty = this.setBundleProperty.bind(this);
  }

  componentDidMount() {
    document.getElementById("defaultOpen").click();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentBundle && nextProps.currentBundle.id !== prevState.editedBundle.id) {
      return { editedBundle: nextProps.currentBundle };
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

  setBundleProperty(fieldValue, fieldName) {
    this.setState({
      editedBundle: { ...this.state.editedBundle, [fieldName]: fieldValue },
    });
  }

  saveChangesToDb() {
    if (objectDeepCompare(this.state.editedBundle, this.props.currentBundle)) {
      this.props.showNotification("No changes were made", "info");
    } else {
      let bundleToWrite = Object.assign({}, this.state.editedBundle);
      updateDocumentInDb(bundleToWrite.id, bundleToWrite, firebaseCollections.BUNDLES)
        .then(() => {
          this.props.updateDocumentInCollection(
            this.state.editedBundle.id,
            this.state.editedBundle,
            firebaseCollections.BUNDLES
          );
          this.props.showNotification("Collection successfully saved", "success");
        })
        .catch(error => {
          this.props.showNotification(
            "An error occured while saving the collection :(. Please refresh and try again.",
            "danger"
          );
          console.error(error);
        });
    }
  }

  onDeletePlaceClicked() {
    this.props.showPrompt(
      "Are you sure",
      "The collection will be permanently deleted.",
      () => this.deleteBundle(),
      "Delete"
    );
  }

  deleteBundle() {
    return deleteDocumentFromDb(this.props.currentBundle.id, firebaseCollections.BUNDLES).then(
      () => {
        this.props.deleteDocumentFromCollection(
          this.props.currentBundle.id,
          firebaseCollections.BUNDLES
        );
        this.props.showNotification("Collection successfully deleted", "success");
        document.getElementById("closeEditModalButton").click();
        this.props.history.push(appRoutes.BUNDLES);
      }
    );
  }

  handleCloseModal(e) {
    e.preventDefault();
    const realCloseButton = document.getElementById("closeEditModalButton");

    if (!objectDeepCompare(this.props.currentBundle, this.state.editedBundle)) {
      this.props.showPrompt(
        "Collection not saved!",
        "Are you sure you want to discard changes?",
        () => {
          this.saveChangesToDb();
          realCloseButton.click();
          this.props.history.push(appRoutes.BUNDLES);
        },
        "Save",
        () => {
          this.setState({ editedBundle: this.props.currentBundle });
          realCloseButton.click();
        },
        "Discard"
      );
    } else {
      realCloseButton.click();
      this.props.history.push(appRoutes.BUNDLES);
    }
  }

  render() {
    const currentBundleForInputs = adaptBundleDataForInputs(this.state.editedBundle);

    const bundleCoverImage = currentBundleForInputs.coverPhoto
      ? makeImageUrl(
          currentBundleForInputs.coverPhoto.id,
          currentBundleForInputs.id,
          firebaseCollections.BUNDLES,
          1280,
          fileTypes.COVER
        )
      : null;

    const tabTitles = ["General", "Places"];
    const tabContent = [
      <EditBundleGeneralInformation
        currentBundle={currentBundleForInputs}
        onChange={this.setBundleProperty.bind(this)}
      />,
      <EditBundlePlaces
        currentBundle={currentBundleForInputs}
        onChange={this.setBundleProperty.bind(this)}
      />,
    ];

    return (
      <div
        className="modal fade editModal"
        id="editBundleModal"
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
                Editing {this.state.editedBundle && this.state.editedBundle.title}
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
                  style={{ backgroundImage: `url(${bundleCoverImage})` }}
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

const EditBundleDispatch = function(dispatch) {
  return {
    updateDocumentInCollection: function(docId, doc, collectionName) {
      updateDocumentInCollection(docId, doc, collectionName, dispatch);
    },
    deleteDocumentFromCollection: function(docId, collectionName) {
      deleteDocumentFromCollection(docId, collectionName, dispatch);
    },
  };
};
export default compose(connect(null, EditBundleDispatch))(
  withPrompt(withNotifications(withRouter(withCollection(firebaseCollections.PLACES)(EditBundle))))
);

function adaptBundleDataForInputs(bundleData) {
  let bundleData2 = Object.assign({}, bundleData);

  if (
    (bundleData2.tags && typeof bundleData2.tags === "string") ||
    bundleData2.tags instanceof String
  ) {
    bundleData2.tags = bundleData2.tags.split(",");
  }

  if (
    bundleData2.categories &&
    bundleData2.categories !== null &&
    typeof bundleData2.categories === "object"
  ) {
    bundleData2.categories = Object.keys(bundleData2.categories).map(category => {
      return { label: category, value: category };
    });
  }
  return bundleData2;
}
