import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

class UserAvatar extends Component {
  render() {
    return (
      <div className="userAvatar clearfix">
        <span className="userName">
          {this.props.authUser ? this.props.authUser.email || "" : ""}
        </span>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authUser: state.auth.user,
  };
}

export default compose(connect(mapStateToProps))(UserAvatar);
