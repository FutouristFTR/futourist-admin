import React from "react";

const SearchInput = (props) => {
  return (
    <div className="searchInputContainer">
      <div className="row">
        <div className="col">
          <div className="inputContainer">
            <i className="fas fa-search" />
            <input
              onChange={props.onChange}
              type="text"
              className="form-control bsx"
              placeholder="Search by field values"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default SearchInput;
