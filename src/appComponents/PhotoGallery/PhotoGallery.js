import React, { Component } from "react";
import PropTypes from "prop-types";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

import { withPrompt } from "higherOrderComponents";
import ProgressBar from "appComponents/Progress/ProgressBar";
import { makeImageUrl } from "utils";

class PhotoGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoIndex: 0,
      deletePromptIsOpen: false,
      lightboxIsOpen: false,
    };
  }

  render() {
    const { photoIds, documentId, collectionName, photoUrls, type } = this.props;

    const { photoIndex, lightboxIsOpen } = this.state;

    let photosForLightBox = photoUrls
      ? photoUrls
      : photoIds && photoIds.length
      ? photoIds.map(photoId => {
          return makeImageUrl(photoId, documentId, collectionName, 1920, type);
        })
      : [];

    let toolbarButtons = [];
    if (this.props.onDelete) {
      toolbarButtons.push([
        <button
          key="onDelete"
          type="button"
          className="btn btn-primary lightboxActionButton"
          onClick={() =>
            this.props.showPrompt("Are you sure?", "Photo will be permanently deleted", () => {
              if (this.props.onDelete) this.props.onDelete(photoIds && photoIds[photoIndex]);
            })
          }
        >
          <i className="fa fa-trash" /> &nbsp;Delete
        </button>,
      ]);
      if (this.props.onSetCoverPhoto)
        toolbarButtons.push(
          <button
            key="onSetCoverPhoto"
            type="button"
            className="btn btn-primary lightboxActionButton"
            onClick={() => {
              this.props.onSetCoverPhoto(photoIds && photoIds[photoIndex]);
              this.setState({ photoIndex: 0 });
            }}
          >
            <i className="fas fa-image" /> &nbsp;Set cover
          </button>
        );
    }

    const uploadIndicators = this.props.uploadIndicators.map((indicator, index) => {
      if (indicator == null) return null;
      return (
        <div className="uploadIndicatorBox" key={index}>
          <ProgressBar percent={indicator} height={10} />
        </div>
      );
    });

    const lightBoxRenderCondition =
      lightboxIsOpen && Boolean(photosForLightBox) && Boolean(photosForLightBox.length);
    return (
      <div>
        {photoUrls
          ? photoUrls.map((photoUrl, index) => {
              return (
                <img
                  className="imgInPhotoGallery"
                  onClick={() => this.setState({ lightboxIsOpen: true, photoIndex: index })}
                  key={photoUrl}
                  src={photoUrl}
                  alt={`no. ${index}`}
                />
              );
            })
          : photosForLightBox.map((photoUrl, index) => {
              return (
                <img
                  className="imgInPhotoGallery"
                  onClick={() => this.setState({ lightboxIsOpen: true, photoIndex: index })}
                  key={photoUrl}
                  src={photoUrl}
                  alt={`no. ${index}`}
                />
              );
            })}
        {}
        {uploadIndicators}

        {lightBoxRenderCondition && (
          <Lightbox
            mainSrc={photosForLightBox[photoIndex % photosForLightBox.length]}
            nextSrc={photosForLightBox[(photoIndex + 1) % photosForLightBox.length]}
            prevSrc={
              photosForLightBox[
                (photoIndex + photosForLightBox.length - 1) % photosForLightBox.length
              ]
            }
            onCloseRequest={() => this.setState({ lightboxIsOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + photosForLightBox.length - 1) % photosForLightBox.length,
              })
            }
            toolbarButtons={toolbarButtons}
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % photosForLightBox.length,
              })
            }
            imageTitle={`Place photo ${photoIndex + 1}/${photosForLightBox.length}`}
            reactModalStyle={{ overlay: { zIndex: 2000 } }}
          />
        )}
      </div>
    );
  }
}

PhotoGallery.propTypes = {
  type: PropTypes.string,
  onSetCoverPhoto: PropTypes.func,
  onDelete: PropTypes.func,
  photoIds: PropTypes.arrayOf(PropTypes.string),
  documentId: PropTypes.string,
  collectionName: PropTypes.string,
  uploadIndicators: PropTypes.arrayOf(PropTypes.number),
};

export default withPrompt(PhotoGallery);
