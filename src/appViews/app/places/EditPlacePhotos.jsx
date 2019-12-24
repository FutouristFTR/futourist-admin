import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import Dropzone from "react-dropzone";

import { withNotifications } from "higherOrderComponents";
import { addPhotos } from "db";
import { updateDocumentInCollection } from "redux/actions";

import PhotoGallery from "appComponents/PhotoGallery/PhotoGallery";
import SectionTitle from "appComponents/SectionTitle/SectionTitle";
import { firebaseCollections } from "constants/database";
import { fileTypes } from "constants/media";

class ManagePlacePhotos extends Component {
  state = {
    uploadIndicators: [],
    mainPhotoUploadIndicator: null,
  };

  handleOtherPhotosDrop = files => {
    let uploadIndicators = Array(files.length).fill(0);
    this.setState({ uploadIndicators });
    let placeId = this.props.currentPlace.id;

    addPhotos(firebaseCollections.PLACES, placeId, null, files, (percentage, index) => {
      uploadIndicators[index] = percentage;
      this.setState({ uploadIndicators });
    })
      .then(uploadedPhotos => {
        this.props.showNotification("Images uploaded successfully, but not saved yet", "success");
        let photosForState = uploadedPhotos;
        if (this.props.currentPlace.photos && this.props.currentPlace.photos.length) {
          photosForState = [...this.props.currentPlace.photos.slice(), ...photosForState];
        }

        this.props.onChange("photos", photosForState);
        this.setState({ uploadIndicators: [] });
      })
      .catch(error => {
        this.props.showNotification("Uploading photos failed.", "danger");
        console.error(error);
      });
  };

  onDeletePhoto(photoId) {
    let updatedPhotos = JSON.parse(JSON.stringify(this.props.currentPlace.photos));
    const photoIndex = updatedPhotos.map(photo => photo.id).indexOf(photoId);
    if (photoIndex > -1) {
      updatedPhotos.splice(photoIndex, 1);
    }
    this.props.onChange("photos", updatedPhotos);
  }

  onSetCoverPhoto(photoId) {
    let updatedPhotos = JSON.parse(JSON.stringify(this.props.currentPlace.photos));
    console.log("setting cover photo", photoId);
    const photoIndex = updatedPhotos.map(photo => photo.id).indexOf(photoId);
    if (photoIndex > -1) {
      updatedPhotos.splice(0, 0, updatedPhotos.splice(photoIndex, 1)[0]);
      // updatedPhotos.splice(photoIndex, 1);
      this.props.showNotification("Set new cover photo.", "success");
    }

    this.props.onChange("photos", updatedPhotos);
  }

  render() {
    const currentPlace = this.props.currentPlace;

    return (
      <div>
        <SectionTitle title="Edit place's photos" />
        <div className="dropzoneContainer">
          <div className="galleryTitle">
            <h4>Photo Gallery</h4>
          </div>
          <PhotoGallery
            type={fileTypes.PHOTO}
            onSetCoverPhoto={photoId => this.onSetCoverPhoto(photoId)}
            onDelete={photoId => this.onDeletePhoto(photoId)}
            photoIds={
              currentPlace.photos && currentPlace.photos.length
                ? currentPlace.photos.map(photo => photo.id)
                : []
            }
            documentId={currentPlace.id}
            collectionName={firebaseCollections.PLACES}
            uploadIndicators={this.state.uploadIndicators}
          />
          <Dropzone
            onDrop={this.handleOtherPhotosDrop}
            multiple
            accept="image/*"
            className="dropzoneStyle"
          >
            <div className="dropzoneTextContainer">
              <p className="dropzoneTextStyle">
                Replace <strong>gallery photos</strong> by dropping a new photo here
              </p>
            </div>
          </Dropzone>
        </div>
      </div>
    );
  }
}

const ManagePlacePhotosDispatch = function(dispatch) {
  return {
    updateDocumentInCollection: function(docId, updatedDocument, collectionName) {
      updateDocumentInCollection(docId, updatedDocument, collectionName, dispatch);
    },
  };
};

export default compose(
  connect(
    state => {
      return {};
    },
    ManagePlacePhotosDispatch
  )
)(withNotifications(ManagePlacePhotos));
