import React from "react";

class TagInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
  }

  render() {
    return (
      <div>
        <ul className="tagsContainer" onClick={() => this.nameInput.focus()}>
          {this.props.value.map((item, i) => (
            <li key={i} className="tagItems" onClick={this.handleRemoveItem(i)}>
              <div className="tagStyle">{item}</div>
              <i className="fas fa-times tagsDeleteIcon" />
            </li>
          ))}
          <input
            ref={input => {
              this.nameInput = input;
            }}
            className="tagInput"
            value={this.state.input}
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown}
          />
        </ul>
      </div>
    );
  }

  handleInputChange(evt) {
    this.setState({ input: evt.target.value });
  }

  handleInputKeyDown(evt) {
    if (evt.keyCode === 188) {
      // don't actually write a comma, just start writing new tag
      evt.preventDefault();
    }
    if (evt.keyCode === 13 || evt.keyCode === 188) {
      // enter or comma pressed
      const { value } = evt.target;
      let items = [...this.props.value, value];
      this.props.onChange(items);
      this.setState(state => ({
        input: ""
      }));
    }

    if (
      this.props.value.length &&
      evt.keyCode === 8 &&
      !this.state.input.length
    ) {
      let items = [this.props.value.slice(0, this.props.value.length - 1)];
      this.props.onChange(items);
    }
  }

  handleRemoveItem(index) {
    return () => {
      let items = this.props.value.filter((item, i) => i !== index);
      this.props.onChange(items);
    };
  }
}

export default TagInput;
