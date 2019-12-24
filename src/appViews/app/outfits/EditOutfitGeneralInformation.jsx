import React, { Component } from "react";
import Select from "react-select";
import Dropzone from "react-dropzone";

import { firebaseCollections } from "constants/database";
import { imageWidths, fileTypes } from "constants/media";

import { addPhotos } from "db";
import { withNotifications } from "higherOrderComponents";
import { withCollection } from "higherOrderComponents";

import SectionTitle from "appComponents/SectionTitle/SectionTitle";
import PhotoGallery from "appComponents/PhotoGallery/PhotoGallery";

const largestCoverWidth = Object.keys(
  imageWidths[firebaseCollections.OUTFITS].cover
).reduce((prev, curr) => (parseInt(curr, 10) > parseInt(prev, 10) ? curr : prev));
const largestCoverHeight = imageWidths[firebaseCollections.OUTFITS].cover[largestCoverWidth];

const largestThumbWidth = Object.keys(
  imageWidths[firebaseCollections.OUTFITS].thumb
).reduce((prev, curr) => (parseInt(curr, 10) > parseInt(prev, 10) ? curr : prev));
const largestThumbHeight = imageWidths[firebaseCollections.OUTFITS].thumb[largestThumbWidth];

class EditOutfitGeneralInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadIndicators: {
        thumb: null,
        cover: null,
      },
      thumbPhoto: "",
      coverPhoto: "",
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = {};
    if (!nextProps.currentOutfit.thumbPhoto) {
      newState.thumbPhoto = "";
    }
    if (
      nextProps.currentOutfit.thumbPhoto &&
      nextProps.currentOutfit.thumbPhoto.links &&
      nextProps.currentOutfit.thumbPhoto.links[`${largestThumbWidth}x${largestThumbHeight}`] !==
        prevState.thumbPhoto
    ) {
      newState.thumbPhoto =
        nextProps.currentOutfit.thumbPhoto.links[`${largestThumbWidth}x${largestThumbHeight}`];
    }
    if (!nextProps.currentOutfit.coverPhoto) {
      newState.coverPhoto = "";
    }
    if (
      nextProps.currentOutfit.coverPhoto &&
      nextProps.currentOutfit.coverPhoto.links &&
      nextProps.currentOutfit.coverPhoto.links[`${largestCoverWidth}x${largestCoverHeight}`] !==
        prevState.coverPhoto
    ) {
      newState.coverPhoto =
        nextProps.currentOutfit.coverPhoto.links[`${largestCoverWidth}x${largestCoverHeight}`];
    }

    return newState;
  }
  handlePhotoDrop = (files, type) => {
    let fieldName = type + "Photo";
    let uploadIndicator = 0;
    this.setState({
      uploadIndicators: { ...this.state.uploadIndicators, [type]: uploadIndicator },
    });
    let outfitId = this.props.currentOutfit.id;

    addPhotos(firebaseCollections.OUTFITS, outfitId, type, files, (percentage, index) => {
      uploadIndicator = percentage;
      this.setState({
        uploadIndicators: { ...this.state.uploadIndicators, [type]: uploadIndicator },
      });
    })
      .then(uploadedPhoto => {
        this.props.showNotification("Images uploaded successfully, but not saved yet", "success");
        this.props.onChange(uploadedPhoto[0], fieldName);
        let uploadIndicator = null;
        this.setState({
          uploadIndicators: { ...this.state.uploadIndicators, [type]: uploadIndicator },
        });
      })
      .catch(error => {
        let uploadIndicator = null;
        this.setState({
          uploadIndicators: { ...this.state.uploadIndicators, [type]: uploadIndicator },
        });
        this.props.showNotification("Uploading photos failed.", "danger");
        console.error(error);
      });
  };

  onDeletePhoto(photoId) {
    // let updatedPhotos = JSON.parse(JSON.stringify(this.props.currentOutfit.photos));
    // const photoIndex = updatedPhotos.map(photo => photo.id).indexOf(photoId);
    // if (photoIndex > -1) {
    //   updatedPhotos.splice(photoIndex, 1);
    // }
    // this.props.onChange("photos", updatedPhotos);
  }

  render() {
    return (
      <div className="generalInfoContainer">
        <SectionTitle title="Edit outfit's general info" />
        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Title:</span>
          </div>
          <div className="col-10">
            <input
              name="title"
              className="inputStyle"
              placeholder="Enter outfit's title"
              value={this.props.currentOutfit.title || ""}
              onChange={event => {
                this.props.onChange(event.target.value, "title");
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Subtitle:</span>
          </div>
          <div className="col-10">
            <input
              name="subtitle"
              className="inputStyle"
              placeholder="Enter outfit's subtitle"
              value={this.props.currentOutfit.subtitle || ""}
              onChange={event => {
                this.props.onChange(event.target.value, "subtitle");
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Cover photo:</span>
          </div>
          <div className="col-5">
            <PhotoGallery
              type={fileTypes.COVER}
              photoUrls={[this.state.coverPhoto]}
              onDelete={photoId => this.onDeletePhoto(photoId)}
              uploadIndicators={[this.state.uploadIndicators.cover]}
            />
          </div>
          <div className="col-5">
            <Dropzone
              onDrop={files => this.handlePhotoDrop(files, "cover")}
              accept="image/*"
              className="dropzoneStyle"
            >
              <div className="dropzoneTextContainer">
                <p className="dropzoneTextStyle">Drop a new cover photo here</p>
              </div>
            </Dropzone>
          </div>
        </div>
        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Thumbnail photo:</span>
          </div>
          <div className="col-5">
            <PhotoGallery
              type={fileTypes.THUMB}
              photoUrls={[this.state.thumbPhoto]}
              onDelete={photoId => this.onDeletePhoto(photoId)}
              uploadIndicators={[this.state.uploadIndicators.thumb]}
            />
          </div>
          <div className="col-5">
            <Dropzone
              onDrop={files => this.handlePhotoDrop(files, "thumb")}
              accept="image/*"
              className="dropzoneStyle"
            >
              <div className="dropzoneTextContainer">
                <p className="dropzoneTextStyle">Drop a new thumb photo here</p>
              </div>
            </Dropzone>
          </div>
        </div>
        <SectionTitle title="Based on tagged places" />
        <div className="row">
          <div className="col-2 selectorTitle">
            <span>All categories:</span>
          </div>
          <div className="col-10">
            <Select
              isMulti
              maxMenuHeight={270}
              name="categories"
              value={this.props.currentOutfit.categories || []}
              isDisabled={true}
              options={[]}
              styles={{
                multiValue: (base, state) => {
                  return { ...base, backgroundColor: "gray" };
                },
                multiValueLabel: (base, state) => {
                  return { ...base, fontWeight: "bold", color: "white", paddingRight: 6 };
                },
                multiValueRemove: (base, state) => {
                  return { ...base, display: "none" };
                },
              }}
              isClearable={false}
              classNamePrefix="prefix"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Avg. latitude:</span>
          </div>
          <div className="col-4">
            <input
              disabled={true}
              name="subtitle"
              className="inputStyle"
              value={this.props.currentOutfit.lat || ""}
            />
          </div>
          <div className="col-2 selectorTitle">
            <span>Avg. longitude:</span>
          </div>
          <div className="col-4">
            <input
              disabled={true}
              name="subtitle"
              className="inputStyle"
              value={this.props.currentOutfit.lng || ""}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withCollection(firebaseCollections.CATEGORIES)(
  withNotifications(EditOutfitGeneralInformation)
);
