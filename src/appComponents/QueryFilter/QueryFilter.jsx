import React, { Component } from "react";

class QueryFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldIndex: 0,
      searchTerm: "",
    };
  }

  onSearchClicked() {
    this.props.onClick &&
      this.props.onClick({
        field: this.props.fields[this.state.fieldIndex].value,
        term: this.state.searchTerm,
      });
  }

  componentDidMount() {
    if (this.props.default) {
      this.setState({
        searchTerm: this.props.default.term,
        fieldIndex: this.props.default.fieldIndex,
      });
    }
    window.addEventListener("onKeyUp", e => this.onKeyUp(e.keyCode));
  }
  componentWillUnmount() {
    window.removeEventListener("onKeyUp", e => this.onKeyUp(e.keyCode));
  }

  onKeyUp(keyCode) {
    if (keyCode === 13)
      this.props.onClick &&
        this.props.onClick({
          field: this.props.fields[this.state.fieldIndex].value,
          term: this.state.searchTerm,
        });
  }

  render() {
    const { fieldIndex } = this.state;
    return (
      <div className="input-group mb-3 searchFormContainer">
        <div className="input-group-prepend">
          <button
            className="btn btn-light dropdown-toggle"
            style={{ borderWidth: 1, borderColor: "#CACACA" }}
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {this.props.fields && this.props.fields.length && this.props.fields[fieldIndex]
              ? this.props.fields[fieldIndex].label
              : "/"}
          </button>

          <div className="dropdown-menu">
            {this.props.fields &&
              this.props.fields.length &&
              this.props.fields.map((field, index) => {
                return (
                  <a
                    key={field.value}
                    onClick={() => this.setState({ fieldIndex: index })}
                    className="dropdown-item"
                  >
                    {field.label}
                  </a>
                );
              })}
          </div>
        </div>
        <div className="input-group-prepend">
          <span className="input-group-text">==</span>
        </div>
        <input
          onKeyUp={e => {
            this.onKeyUp(e.keyCode);
          }}
          type="text"
          className="form-control"
          aria-label="Text input with dropdown button"
          onChange={e => this.setState({ searchTerm: e.target.value })}
          value={this.state.searchTerm}
        />
        <div className="input-group-append">
          <button
            className="btn btn-light"
            style={{ borderWidth: 1, borderColor: "#CACACA" }}
            type="button"
            onClick={() => this.onSearchClicked()}
          >
            Search
          </button>
        </div>
      </div>
    );
  }
}

export default QueryFilter;
