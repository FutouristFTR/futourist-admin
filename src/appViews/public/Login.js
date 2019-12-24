import React, { Component } from "react";
import { withRouter } from "react-router";
import firebase from "firebase/app";
import "firebase/auth";
import { publicRoutes } from "routes";

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    // when "Sign In clicked"
    event.preventDefault();

    const { email, password } = this.state;

    const { history } = this.props;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        // this.setState(() => ({ ...INITIAL_STATE }));

        if (
          !!this.props.location.state &&
          !!this.props.location.state.lastPage
        ) {
          // read lastPage (set in withAuthorization) from history state in order to redirect person back to desired page after log in
          history.push(this.props.location.state.lastPage);
        } else {
          // redirect to default page after log in if there was no page visited before
          history.push(publicRoutes.ROOT);
        }
      })
      .catch(error => {
        console.error("ERROR:", error);
        this.setState({ error: error.message }); // show error to user
      });
  };

  render() {
    return (
      <div>
        <div className="container" id="admin-login">
          <div className="row">
            <div className="col-sm-12 col-md-5 mx-auto">
              <h1 className="text-center">Login</h1>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    name="email1"
                    value={this.state.email}
                    onChange={event => {
                      this.setState({ email: event.target.value });
                    }}
                    className="form-control"
                    placeholder="Enter your email"
                  />
                  <small className="form-text text-muted">
                    We'll never share your email with anyone else.
                  </small>
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password1"
                    value={this.state.password}
                    onChange={event => {
                      this.setState({ password: event.target.value });
                    }}
                    className="form-control"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary text-center">
                    Submit
                  </button>
                </div>
              </form>
              <p>{this.state.error}</p>
            </div>
          </div>
        </div>

        <div className="funnyNoga">
          <span>Made by funnyDev#1, funnyDev#2, funnyDev#3 in 2018. </span>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
