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
  imageWidths[firebaseCollections.BUNDLES].cover
).reduce((prev, curr) => (parseInt(curr, 10) > parseInt(prev, 10) ? curr : prev));
const largestCoverHeight = imageWidths[firebaseCollections.BUNDLES].cover[largestCoverWidth];

const largestThumbWidth = Object.keys(
  imageWidths[firebaseCollections.BUNDLES].thumb
).reduce((prev, curr) => (parseInt(curr, 10) > parseInt(prev, 10) ? curr : prev));
const largestThumbHeight = imageWidths[firebaseCollections.BUNDLES].thumb[largestThumbWidth];

class EditBundleGeneralInformation extends Component {
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
    if (!nextProps.currentBundle.thumbPhoto) {
      newState.thumbPhoto = "";
    }
    if (
      nextProps.currentBundle.thumbPhoto &&
      nextProps.currentBundle.thumbPhoto.links &&
      nextProps.currentBundle.thumbPhoto.links[`${largestThumbWidth}x${largestThumbHeight}`] !==
        prevState.thumbPhoto
    ) {
      newState.thumbPhoto =
        nextProps.currentBundle.thumbPhoto.links[`${largestThumbWidth}x${largestThumbHeight}`];
    }
    if (!nextProps.currentBundle.coverPhoto) {
      newState.coverPhoto = "";
    }
    if (
      nextProps.currentBundle.coverPhoto &&
      nextProps.currentBundle.coverPhoto.links &&
      nextProps.currentBundle.coverPhoto.links[`${largestCoverWidth}x${largestCoverHeight}`] !==
        prevState.coverPhoto
    ) {
      newState.coverPhoto =
        nextProps.currentBundle.coverPhoto.links[`${largestCoverWidth}x${largestCoverHeight}`];
    }

    return newState;
  }
  handlePhotoDrop = (files, type) => {
    let fieldName = type + "Photo";
    let uploadIndicator = 0;
    this.setState({
      uploadIndicators: { ...this.state.uploadIndicators, [type]: uploadIndicator },
    });
    let bundleId = this.props.currentBundle.id;

    addPhotos(firebaseCollections.BUNDLES, bundleId, type, files, (percentage, index) => {
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
    // let updatedPhotos = JSON.parse(JSON.stringify(this.props.currentBundle.photos));
    // const photoIndex = updatedPhotos.map(photo => photo.id).indexOf(photoId);
    // if (photoIndex > -1) {
    //   updatedPhotos.splice(photoIndex, 1);
    // }
    // this.props.onChange("photos", updatedPhotos);
  }

  render() {
    return (
      <div className="generalInfoContainer">
        <SectionTitle title="Edit bundle's general info" />
        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Title:</span>
          </div>
          <div className="col-10">
            <input
              name="title"
              className="inputStyle"
              placeholder="Enter bundle's title"
              value={this.props.currentBundle.title || ""}
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
              placeholder="Enter bundle's subtitle"
              value={this.props.currentBundle.subtitle || ""}
              onChange={event => {
                this.props.onChange(event.target.value, "subtitle");
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-2 selectorTitle">
            <span>Text:</span>
          </div>
          <div className="col-10">
            <div className="descriptionInputContainer">
              <textarea
                value={(this.props.currentBundle && this.props.currentBundle.text) || ""}
                onChange={event => this.props.onChange(event.target.value, "text")}
                className="descriptionInput"
              />
            </div>
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
              value={this.props.currentBundle.categories || []}
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
              value={this.props.currentBundle.lat || ""}
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
              value={this.props.currentBundle.lng || ""}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withCollection(firebaseCollections.CATEGORIES)(
  withNotifications(EditBundleGeneralInformation)
);
