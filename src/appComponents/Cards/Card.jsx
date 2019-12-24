import React, { Component } from "react";

class Card extends Component {
  render() {
    return <div className={`cardBg ${this.props.className}`}>{this.props.children}</div>;
  }
}

export default Card;
