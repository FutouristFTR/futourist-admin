import React, { Component } from "react";
import Select from "react-select";

import TagInput from "appComponents/Tags/TagInput";
import SectionTitle from "appComponents/SectionTitle/SectionTitle";
import { withCollection } from "higherOrderComponents";
import { firebaseCollections } from "constants/database";

class EditPlaceGeneralInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };
  }

  componentDidMount() {}
  render() {
    const categoryOptions = Object.keys(this.props.categoriesDocuments).map(categoryKey => {
      return {
        value: categoryKey,
        label: this.props.categoriesDocuments[categoryKey].name,
      };
    });

    return (
      <div className="generalInfoContainer">
        <SectionTitle title="Edit place's information" />
        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Name:</span>
          </div>
          <div className="col-10">
            <input
              name="name"
              className="inputStyle"
              placeholder="Enter place name"
              value={this.props.currentPlace.name || ""}
              onChange={event => {
                this.props.onChange("name", event.target.value);
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Choose category:</span>
          </div>
          <div className="col-10">
            <Select
              isMulti
              maxMenuHeight={270}
              name="categories"
              value={this.props.currentPlace.categories || []}
              onChange={data => {
                this.props.onChange("categories", data);
              }}
              options={categoryOptions}
              className="categorySelectContainer"
              classNamePrefix="prefix"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Choose tags:</span>
          </div>
          <div className="col-10">
            <TagInput
              value={this.props.currentPlace.tags || []}
              onChange={data => this.props.onChange("tags", data)}
            />
          </div>
        </div>
        <div />
        <div className="row">
          <div className="col-12">
            <span>Describe your place:</span>
          </div>
          <div className="col-12">
            <div className="descriptionInputContainer">
              <textarea
                value={this.props.currentPlace.pitch || ""}
                onChange={event => this.props.onChange("pitch", event.target.value)}
                className="descriptionInput"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withCollection(firebaseCollections.CATEGORIES)(EditPlaceGeneralInformation);
