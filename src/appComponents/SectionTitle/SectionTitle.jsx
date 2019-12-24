import React, { Component } from "react";

class SectionTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="sectionTitleContainer">
        <h6>{this.props.title}</h6>
      </div>
    );
  }
}

export default SectionTitle;
