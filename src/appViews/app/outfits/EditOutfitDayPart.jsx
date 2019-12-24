import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import Select from "react-select";
import SectionTitle from "appComponents/SectionTitle/SectionTitle";

class EditOutfitDayPart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placesLoadedAll: false,
      placeOptions: [],
      taggedPlaces: [
        {
          value: "#",
          label: "Loading...",
        },
      ],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = {};
    if (nextProps.placesLoadedAll && !prevState.placesLoadedAll) {
      newState.placesLoadedAll = true;
      newState.placeOptions = Object.keys(nextProps.placesDocuments)
        .filter(placeId => nextProps.placesDocuments[placeId].status === 100)
        .map(placeId => ({
          value: placeId,
          label: nextProps.placesDocuments[placeId].name,
        }));

      if (
        nextProps.currentOutfit[nextProps.dayPart] &&
        nextProps.currentOutfit[nextProps.dayPart].places &&
        nextProps.currentOutfit[nextProps.dayPart].places.length
      ) {
        newState.taggedPlaces = Object.keys(nextProps.currentOutfit[nextProps.dayPart].places).map(
          index => {
            let placeId = nextProps.currentOutfit[nextProps.dayPart].places[index];
            return {
              value: placeId,
              label: nextProps.placesDocuments[placeId].name,
            };
          }
        );
      } else {
        newState.taggedPlaces = [];
      }
    }

    return newState;
  }
  render() {
    return (
      <div className="generalInfoContainer">
        <SectionTitle title={`Edit outfit's ${this.props.dayPart}`} />
        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Heading:</span>
          </div>
          <div className="col-10">
            <input
              name="heading"
              className="inputStyle"
              placeholder="Enter outfit's heading"
              value={
                this.props.currentOutfit[this.props.dayPart]
                  ? this.props.currentOutfit[this.props.dayPart].heading
                  : ""
              }
              onChange={event => {
                this.props.onChange(event.target.value, this.props.dayPart, "heading");
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-2 selectorTitle">Tagged places:</div>
          <div className="col-10">
            <Select
              isMulti
              maxMenuHeight={270}
              name="places"
              value={this.state.taggedPlaces}
              onChange={data => {
                this.props.onChange(
                  data.map(val => val.value),
                  this.props.dayPart,
                  "places"
                );
              }}
              options={this.state.placeOptions}
              className="categorySelectContainer"
              classNamePrefix="prefix"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <span>Text guide:</span>
          </div>
          <div className="col-12">
            <div className="descriptionInputContainer">
              <textarea
                value={
                  (this.props.currentOutfit[this.props.dayPart] &&
                    this.props.currentOutfit[this.props.dayPart].text) ||
                  ""
                }
                onChange={event =>
                  this.props.onChange(event.target.value, this.props.dayPart, "text")
                }
                className="descriptionInput"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    placesDocuments: state.collection.places,
    placesLoadedAll: state.database.places.loadedAll,
  };
};
export default compose(connect(mapStateToProps, null))(EditOutfitDayPart);
