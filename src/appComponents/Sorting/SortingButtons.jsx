import React, { Component } from "react";
import PropTypes from "prop-types";

class SortingButtons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: this.props.fieldList,
      sortedBy: "created",
      sortedDirection: "DESC",
    };
  }

  handleClick(fieldName) {
    const sortedDirection = this.state.sortedDirection;
    if (sortedDirection === "" || sortedDirection === "DESC") {
      this.props.onClick(fieldName, "ASC");
      this.setState({
        sortedBy: fieldName,
        sortedDirection: "ASC",
      });
    } else if (sortedDirection === "ASC") {
      this.props.onClick(fieldName, "DESC");
      this.setState({
        sortedBy: fieldName,
        sortedDirection: "DESC",
      });
    }
  }

  render() {
    const { sortedBy, sortedDirection } = this.state;
    return (
      <div className="searchFormContainer">
        <div className="btn-group btn-group" role="group" aria-label="...">
          {this.props.fieldList.map(field => {
            const fieldName = field.fieldName;
            return (
              <button
                type="button"
                className="btn btn-light"
                key={field.fieldName}
                onClick={() => this.handleClick(fieldName)}
              >
                {sortedBy === fieldName ? <strong>{field.displayText}</strong> : field.displayText}
                &nbsp;
                {sortedBy !== fieldName && <i className="fas fa-sort" />}
                {sortedBy === fieldName && sortedDirection === "ASC" && (
                  <i className="fas fa-sort-up" />
                )}
                {sortedBy === fieldName && sortedDirection === "DESC" && (
                  <i className="fas fa-sort-down" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}

SortingButtons.propTypes = {
  fieldList: PropTypes.array.isRequired,
  onClick: PropTypes.func,
};

export default SortingButtons;
