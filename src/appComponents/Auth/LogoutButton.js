import React from "react";
import firebase from "firebase/app";
import "firebase/auth";

const LogoutButton = props => (
  <span
    onClick={() => {
      firebase.auth().signOut();
    }}
    {...props}
  >
    {props.iconclass ? <i className={props.iconclass} /> : null}
    {props.text || "Sign Out"}
  </span>
);

export default LogoutButton;
