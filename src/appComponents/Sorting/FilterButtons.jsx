import React, { Component } from "react";
import PropTypes from "prop-types";

class FilterButtons extends Component {
  constructor(props) {
    super(props);

    const fieldsChecked = this.props.fieldList.map(() => false);
    this.state = {
      fieldsChecked: fieldsChecked,
    };
  }

  handleClick(index) {
    console.log("clicked ", index);
    let fieldsChecked = this.state.fieldsChecked;
    fieldsChecked[index] = !this.state.fieldsChecked[index];
    this.setState({ fieldsChecked });
    console.log("set new state ", fieldsChecked);

    this.props.onClick(index, fieldsChecked[index]);
  }

  render() {
    const { fieldsChecked } = this.state;
    return (
      <div className="searchFormContainer">
        <div className="btn-group btn-group-sm" role="group" aria-label="...">
          {this.props.fieldList.map((field, index) => {
            const fieldName = field.fieldName;
            return (
              <button
                type="button"
                className={`btn btn-sm btn-${fieldsChecked[index] ? "dark" : "light"}`}
                key={field.fieldName}
                onClick={() => this.handleClick(index)}
              >
                {field.displayText}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}

FilterButtons.propTypes = {
  fieldList: PropTypes.array.isRequired,
  onClick: PropTypes.func,
};

export default FilterButtons;
