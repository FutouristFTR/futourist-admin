import React, { Component } from "react";
import { connect } from "react-redux";

import { updateDocumentInCollection } from "redux/actions";
import { withPrompt } from "higherOrderComponents";

import SectionTitle from "appComponents/SectionTitle/SectionTitle";

class EditPlaceBusiness extends Component {
  state = {
    place: "",
    userSearch: "",
    error: "",
    success: "",
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(prevState.place) !== JSON.stringify(nextProps.currentPlace)) {
      return { success: "", error: "", userSearch: "", place: nextProps.currentPlace };
    }
    return null;
  }

  render() {
    return (
      <div>
        <SectionTitle title="Edit place's business info" />

        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Company name:</span>
          </div>
          <div className="col-10">
            <input
              name="company"
              className="inputStyle"
              placeholder="Enter the company name"
              value={this.props.currentPlace.company || ""}
              onChange={event => {
                this.props.onChange("company", event.target.value);
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Handle</span>
          </div>
          <div className="col-10">
            <div className="input-group mb-3">
              <div className="input-group-prepend" style={{ marginTop: 10 }}>
                <span className="input-group-text">@</span>
              </div>
              <input
                name="handle"
                className="inputStyle form-control"
                placeholder="Enter the handle"
                value={this.props.currentPlace.handle || ""}
                onChange={event => {
                  this.props.onChange("handle", event.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Phone number:</span>
          </div>
          <div className="col-10">
            <input
              name="gsm"
              className="inputStyle"
              placeholder="Enter a phone number for your customers"
              value={this.props.currentPlace.gsm || ""}
              onChange={event => {
                this.props.onChange("gsm", event.target.value);
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Email:</span>
          </div>
          <div className="col-10">
            <input
              name="email"
              className="inputStyle"
              value={this.props.currentPlace.email || ""}
              placeholder="Enter an e-mail for your customers"
              onChange={event => {
                this.props.onChange("email", event.target.value);
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Web:</span>
          </div>
          <div className="col-10">
            <input
              name="web"
              className="inputStyle"
              value={this.props.currentPlace.web || ""}
              placeholder="Enter a web address of your business"
              onChange={event => {
                this.props.onChange("web", event.target.value);
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Facebook:</span>
          </div>
          <div className="col-10">
            <input
              name="facebook"
              className="inputStyle"
              value={this.props.currentPlace.facebook || ""}
              placeholder="Enter your business' Facebook page link"
              onChange={event => {
                this.props.onChange("facebook", event.target.value);
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    usersDocuments: state.collection.users,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    updateDocumentInCollection: function(docId, doc, collectionName) {
      updateDocumentInCollection(docId, doc, collectionName, dispatch);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withPrompt(EditPlaceBusiness));
