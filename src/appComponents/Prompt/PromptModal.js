import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";

import { closePrompt } from "redux/actions";

class PromptModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.isOpen,
      title: this.props.title,
      text: this.props.text,
      mainAction: this.props.mainAction,
      mainButton: this.props.mainButton,
      closeAction: this.props.closeAction,
      closeButton: this.props.closeButton,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      isOpen: nextProps.isOpen,
      title: nextProps.title,
      text: nextProps.text,
      mainAction: nextProps.mainAction,
      mainButton: nextProps.mainButton,
      closeAction: nextProps.closeAction,
      closeButton: nextProps.closeButton,
    };
  }

  render() {
    if (this.props.isOpen) {
      return (
        <div className="promptModalContainer">
          <a onClick={() => this.props.closePrompt()}>
            <div className="promptModalWindow">
              <h2>{this.props.title}</h2>
              <p>{this.props.text}</p>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (this.props.closeAction) this.props.closeAction();
                  this.props.closePrompt();
                }}
              >
                {this.props.closeButton || "Close"}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  this.props.mainAction();
                  this.props.closePrompt();
                }}
              >
                {this.props.mainButton || "Confirm"}
              </button>
            </div>
          </a>
        </div>
      );
    }
    return null;
  }
}

PromptModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  mainAction: PropTypes.func.isRequired,
  mainButton: PropTypes.string,
  closeAction: PropTypes.func,
  closeButton: PropTypes.string,
};

const mapStateToProps = function(state) {
  return {
    isOpen: state.page.prompt.isOpen,
    title: state.page.prompt.title,
    text: state.page.prompt.text,
    mainAction: state.page.prompt.mainAction,
    mainButton: state.page.prompt.mainButton,
    closeAction: state.page.prompt.closeAction,
    closeButton: state.page.prompt.closeButton,
  };
};

const dispatcher = function(dispatch) {
  return {
    closePrompt: function() {
      closePrompt(dispatch);
    },
  };
};

export default compose(
  connect(
    mapStateToProps,
    dispatcher
  )
)(PromptModal);
