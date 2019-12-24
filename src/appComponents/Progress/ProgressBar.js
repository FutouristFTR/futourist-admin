import React, { Component } from "react";
import PropTypes from "prop-types";

class ProgressBar extends Component {
  render() {
    let percent = this.props.percent;
    if (percent === 100) {
      percent = 99;
    }
    return (
      <div
        className="progress"
        style={this.props.height ? { height: this.props.height + "px" } : null}
      >
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: percent + "%" }}
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    );
  }
}

ProgressBar.propTypes = {
  percent: PropTypes.number.isRequired,
  height: PropTypes.number,
};

export default ProgressBar;
