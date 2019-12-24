import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import fbConfig from "config/firebase";

import { publicRoutes } from "routes";
import { setAuthUser, resetStore } from "redux/actions";

import { FullSizeLoader } from "appComponents/Loaders";

if (!firebase.apps.length) {
  firebase.initializeApp(fbConfig);
}
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

const withFirebaseAuth = Component => {
  class WithFirebaseAuth extends React.Component {
    componentDidMount() {
      firebase.auth().onAuthStateChanged(authUser => {
        if (!!authUser && authUser) {
          this.props.setAuthUser(authUser);
        } else {
          this.props.setAuthUser(null);
          this.props.resetStore();
          this.props.history.push({
            pathname: publicRoutes.LOGIN,
            state: { lastPage: this.props.location.pathname },
          });
        }
      });
    }

    render() {
      if (!this.props.authUser) {
        return <FullSizeLoader />;
      } else {
        return <Component {...this.props} />;
      }
    }
  }

  const BusinessState = function(state) {
    return {
      authUser: state.auth.user,
      loading: state.page.loading,
    };
  };

  const BusinessDispatch = function(dispatch) {
    return {
      setAuthUser: function(user) {
        setAuthUser(user, dispatch);
      },
      resetStore: function() {
        resetStore(dispatch);
      },
    };
  };

  return compose(connect(BusinessState, BusinessDispatch))(WithFirebaseAuth);
};

export default withFirebaseAuth;
