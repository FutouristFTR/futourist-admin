import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { firebaseCollections } from "constants/database";
import { withNotifications, withPrompt } from "higherOrderComponents";

import { createNewDocumentInDb } from "db";
import { addDocumentsToCollection } from "redux/actions";

const INITIAL_STATE = {
  title: "",
  subtitle: "",
};
class AddBundle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  saveChangesToDb() {
    const { title, subtitle } = this.state;
    if (title && subtitle) {
      this.setState({ error: "" });
      let newBundle = { title, subtitle, status: 10 };
      createNewDocumentInDb(null, newBundle, firebaseCollections.BUNDLES)
        .then(res => {
          newBundle.id = res.documentId;
          this.props.addDocumentsToCollection(
            { [res.documentId]: newBundle },
            firebaseCollections.BUNDLES
          );
          this.props.showNotification("Collection successfully saved", "success");
          document.getElementById("closeAddBundleModal").click();
          this.props.openEditingModal(newBundle);
        })
        .catch(error => {
          const errorMessage = error.response
            ? error.response.data.details
            : "An error occured while saving collection :(. Please refresh and try again.";
          this.props.showNotification(errorMessage, "danger");
          console.error(error);
        });
    } else {
      let error = "";
      if (!this.state.title) error = "Please enter the title";
      if (!this.state.subtitle) error = "Please enter the subtitle";
      this.setState({ error });
    }
  }

  handleCloseModal(e) {
    e.preventDefault();
    const { title, subtitle } = this.state;

    const realCloseButton = document.getElementById("closeAddBundleModal");
    if (title || subtitle) {
      this.props.showPrompt(
        "Collection not saved!",
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
    return (
      <div
        className="modal fade"
        id="addBundleModal"
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
                Creating new collection
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
                  <span>Title:</span>
                </div>
                <div className="col-10">
                  <input
                    name="name"
                    className="inputStyle"
                    placeholder="Enter collection's title"
                    value={this.state.title}
                    onChange={e => this.setState({ title: e.target.value })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-2 selectorTitle">
                  <span>Subtitle:</span>
                </div>
                <div className="col-10">
                  <input
                    name="lat"
                    className="inputStyle"
                    placeholder="Enter collection's subtitle"
                    value={this.state.subtitle}
                    onChange={e => this.setState({ subtitle: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <span style={{ color: "red" }}>{this.state.error}</span>
              <button
                id="closeAddBundleModal"
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

const AddBundleDispatch = function(dispatch) {
  return {
    addDocumentsToCollection: function(doc, collectionName) {
      addDocumentsToCollection(doc, collectionName, dispatch);
    },
  };
};

export default compose(connect(null, AddBundleDispatch))(withPrompt(withNotifications(AddBundle)));
