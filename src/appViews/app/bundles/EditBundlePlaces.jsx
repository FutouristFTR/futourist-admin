import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import Select from "react-select";
import SectionTitle from "appComponents/SectionTitle/SectionTitle";

class EditBundlePlaces extends Component {
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
    }
    if (nextProps.currentBundle && nextProps.placesLoadedAll) {
      if (!nextProps.currentBundle.places) newState.taggedPlaces = [];
      else {
        newState.taggedPlaces = Object.keys(nextProps.currentBundle.places).map(key => {
          let placeId = nextProps.currentBundle.places[key];
          return {
            value: placeId,
            label: nextProps.placesDocuments[placeId].name,
          };
        });
      }
    }
    return newState;
  }
  render() {
    return (
      <div className="generalInfoContainer">
        <SectionTitle title={`Edit collections's places`} />
        <div className="row">
          <div className="col-12">
            <Select
              isMulti
              maxMenuHeight={270}
              name="places"
              value={this.state.taggedPlaces}
              onChange={data => {
                this.props.onChange(
                  data.map(val => val.value),
                  "places"
                );
              }}
              options={this.state.placeOptions}
              className="categorySelectContainer"
              classNamePrefix="prefix"
            />
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
export default compose(connect(mapStateToProps, null))(EditBundlePlaces);
