import React, { Component } from "react";

class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="checkboxContainer">
        <label>
          {this.props.checkboxLabel}
          <input
            name={this.props.checkboxName}
            type="checkbox"
            checked={this.state.checked}
            onChange={this.handleInputChange}
          />
        </label>
      </div>
    );
  }
}

export default Checkbox;
