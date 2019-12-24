import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import ReactPlayer from "react-player";
import queryString from "query-string";

import { firebaseCollections, paginatedBatchSize } from "constants/database";
import { reviewStatuses } from "constants/statusCodes";

import { makeImageUrl, dateToString, hasScrolledToBottom } from "utils";
import { setDocumentWithMergeInDb } from "db";

import Card from "appComponents/Cards/Card";
import FullSizeLoader from "appComponents/Loaders/FullSizeLoader";
import SortingButtons from "appComponents/Sorting/SortingButtons";
import { appRoutes } from "routes";
import { fileTypes } from "constants/media";
import { getCollectionPage, getDocumentsByIdsFromDb, deleteDocumentFromDb } from "db/admin";
import QueryFilter from "appComponents/QueryFilter/QueryFilter";
import makeTimeAgo from "utils/format/timeAgo";
import { withPrompt, withNotifications } from "higherOrderComponents";

class Reviews extends Component {
  constructor(props) {
    super(props);

    let queryParams =
      props.location && props.location.search ? queryString.parse(props.location.search) : {};

    this.state = {
      query: {
        limit: paginatedBatchSize + 1,
        orderBy: "created",
        orderDirection: "DESC",
        start: new Date(),
        where: queryParams.userId ? ["userId", "==", queryParams["userId"]] : null,
      },
      defaultSearch: {
        term: queryParams.userId ? queryParams.userId : "",
        fieldIndex: queryParams.userId ? 1 : 0,
      },
      nextPageStart: new Date(),
      loadedAllReviews: false,
      page: 0,
      reviews: [],
      loading: true,
      loadingDetails: true,
    };
  }

  componentDidMount() {
    this.refreshData();
    window.addEventListener("scroll", () => this.handleScroll());
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", () => this.handleScroll());
    window.scrollTo(0, 0);
  }

  refreshData(isNextPage = false) {
    const query = this.state.query;
    this.setState({
      loading: true,
      loadingDetails: true,
      reviews: isNextPage ? this.state.reviews : [],
    });
    getCollectionPage({ collectionName: firebaseCollections.REVIEWS, ...query })
      .then(reviews => {
        let newState = {
          nextPageStart: (reviews.length && reviews[reviews.length - 1][query.orderBy]) || 0,
          loadedAllReviews: reviews.length <= paginatedBatchSize,
          loading: false,
        };

        if (reviews.length > paginatedBatchSize) reviews.splice(reviews.length - 1, 1);

        isNextPage
          ? this.setState({
              ...newState,
              reviews: [...this.state.reviews, ...reviews],
              page: this.state.page + 1,
            })
          : this.setState({
              ...newState,
              reviews,
              page: 0,
            });

        return Promise.all([
          getDocumentsByIdsFromDb(
            firebaseCollections.PLACES,
            reviews
              .map(r => r.placeId)
              .reduce((acc, cur) => (acc.indexOf(cur) >= 0 ? acc : [...acc, cur]), [])
          ),
          getDocumentsByIdsFromDb(
            firebaseCollections.USERS,
            reviews
              .map(r => r.userId)
              .reduce((acc, cur) => (acc.indexOf(cur) >= 0 ? acc : [...acc, cur]), [])
          ),
        ]);
      })
      .then(([places, users]) => {
        let reviews = Array.from(this.state.reviews, review => {
          if (!review.place && places[review.placeId]) review.place = places[review.placeId];
          if (!review.user && users[review.userId]) review.user = users[review.userId];
          return review;
        });
        this.setState({
          reviews,
          loadingDetails: false,
        });
      })
      .catch(err => console.log(err));
  }

  changeOrderBy(fieldname, direction) {
    let query = Object.assign({}, this.state.query);
    query.orderDirection = direction;
    query.orderDirection = direction;

    if (["created", "updated"].indexOf(fieldname) >= 0) {
      if (direction.toLowerCase() === "desc") query.start = new Date();
      if (direction.toLowerCase() === "asc") query.start = 0;
    } else if (fieldname === "rating") {
      if (direction.toLowerCase() === "desc") query.start = 5;
      if (direction.toLowerCase() === "asc") query.start = 0;
    }
    this.setState(
      {
        query,
      },
      () => this.refreshData()
    );
  }

  handleSearch(whereQuery) {
    let where = [whereQuery.field, "==", whereQuery.term];

    if (!whereQuery.term || !whereQuery.term.length) where = [];
    else if (whereQuery.field === "status") {
      try {
        where[2] = parseInt(whereQuery.term, 10);
      } catch (err) {
        console.error("Status should be a number");
      }
    } else if (whereQuery.field === "userId") {
      this.props.history.push(appRoutes.REVIEWS + "?userId=" + whereQuery.term);
    }
    this.setState(
      {
        query: {
          ...this.state.query,
          where,
        },
      },
      () => this.refreshData()
    );
  }

  handleScroll() {
    if (hasScrolledToBottom() && !this.state.loadedAllReviews && !this.state.loading) {
      this.setState({ query: { ...this.state.query, start: this.state.nextPageStart } }, () =>
        this.refreshData(true)
      );
    }
  }

  handleStatusChange(statusCode, reviewId, index) {
    statusCode = parseInt(statusCode, 10);
    setDocumentWithMergeInDb(reviewId, { status: statusCode }, firebaseCollections.REVIEWS)
      .then(() => {
        const reviews = Array.from(this.state.reviews);
        reviews[index].status = statusCode;
        this.setState({ reviews });
      })
      .catch(error => {
        console.error(error);
      });
  }

  handleDeleteClicked(review, index) {
    this.props.showPrompt(
      "Are you sure?",
      "The review will be permanently deleted.",
      () => this.deleteReview(review, index),
      "Delete"
    );
  }

  deleteReview(review, index) {
    deleteDocumentFromDb(review.id, firebaseCollections.REVIEWS)
      .then(() => {
        this.props.showNotification("Review successfully deleted", "success");
        let reviews = Array.from(this.state.reviews);
        reviews.splice(index, 1);
        this.setState({
          reviews,
        });
      })
      .catch(error => {
        this.props.showNotification("An error occured while trying to delete a review.", "danger");
        console.error(error);
      });
  }

  openEditingModal(review) {
    this.handleDeleteClicked(review);
    document.getElementById("hiddenEditBundleModalOpener").click();
  }

  renderMedia(review) {
    if (review.type === "image")
      return <img style={{ width: "100%" }} src={review.mediaLinks["310x550"]} alt="Review" />;
    else if (review.type === "video")
      return (
        <ReactPlayer
          controls
          style={{ width: "100%" }}
          url={`https://stream.mux.com/${review.mediaId}.m3u8`}
          width="100%"
          height="unset"
        />
      );
  }

  render() {
    let { reviews, loadingDetails } = this.state;
    return (
      <div>
        <h2>Reviews</h2>
        <p>Displaying {(reviews && reviews.length) || 0} documents&nbsp;</p>
        <div className="row">
          <div className="col-sm-12 col-md-9">
            <QueryFilter
              onClick={whereQuery => this.handleSearch(whereQuery)}
              default={this.state.defaultSearch}
              fields={[
                { value: "status", label: "Status" },
                { value: "userId", label: "User ID" },
                { value: "placeId", label: "Place ID" },
              ]}
            />
          </div>
          <div className="col-sm-12 col-md-3">
            <SortingButtons
              onClick={(fieldName, direction) => this.changeOrderBy(fieldName, direction)}
              fieldList={[{ displayText: "Created", fieldName: "created" }]}
            />
          </div>
        </div>

        <div className="row">
          {reviews.map((review, index) => {
            let reviewId = review.id;

            const reviewStatusColor =
              review.status >= 100 && review.status < 200
                ? "success"
                : review.status >= 200
                ? "danger"
                : "warning";
            const reviewStatusText =
              review.status >= 100 && review.status < 200
                ? `Enabled (${review.status})`
                : review.status >= 200
                ? `Disabled (${review.status})`
                : `Draft (${review.status})`;

            let reviewActions = (
              <div className="btn-group">
                <div className="btn-group">
                  <button
                    type="button"
                    className={"btn btn-" + reviewStatusColor + " dropdown-toggle"}
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {reviewStatusText}
                  </button>
                  <div className="dropdown-menu">
                    {Object.keys(reviewStatuses).map(statusCode => (
                      <a
                        className="dropdown-item"
                        onClick={e => this.handleStatusChange(statusCode, reviewId, index)}
                        key={statusCode}
                      >
                        {statusCode + ": " + reviewStatuses[statusCode]}
                      </a>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-outline-danger"
                  id={"editBundleButton-" + reviewId}
                  data-toggle="modal"
                  data-target="#editBundleModal"
                  onClick={() => this.handleDeleteClicked(review, index)}
                >
                  Delete
                </button>
              </div>
            );

            return (
              <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3" key={reviewId}>
                <Card className="collectionListCard">
                  <h3>
                    <strong>{index + 1}.</strong>{" "}
                    <span>{`${(review.place && review.place.name) ||
                      (loadingDetails && "loading...") ||
                      "/"} (${makeTimeAgo(review.created)} ago)`}</span>
                  </h3>
                  {this.renderMedia(review)}
                  <br />
                  <div>
                    {review.coverPhoto ? (
                      <img
                        className="placeImage"
                        src={makeImageUrl(
                          review.coverPhoto.id,
                          reviewId,
                          firebaseCollections.REVIEWS,
                          1280,
                          fileTypes.COVER
                        )}
                        alt="Bundle"
                      />
                    ) : null}
                  </div>

                  <div>
                    Place:{" "}
                    <strong>
                      {(review.place && review.place.name && (
                        <Link className="normal-link" to={appRoutes.PLACES + "/" + review.placeId}>
                          {review.place.name}
                        </Link>
                      )) ||
                        (loadingDetails && "loading...") ||
                        "/"}
                    </strong>
                  </div>
                  <div>
                    User:{" "}
                    <strong>
                      {(review.user && (
                        <Link
                          className="normal-link"
                          to={`${appRoutes.USERS}?uid=${review.userId}`}
                        >
                          {review.user.username}
                        </Link>
                      )) ||
                        (loadingDetails && "loading...") ||
                        "/"}
                    </strong>
                  </div>
                  <div>
                    Rating: <strong>{review.rating}</strong>
                  </div>
                  <div>
                    Text: <strong>{review.text}</strong>
                  </div>
                  <br />
                  <div>
                    Review ID: <strong>{review.id}</strong>
                  </div>
                  <div>
                    Media ID: <strong>{review.mediaId}</strong>
                  </div>
                  <div>
                    Created: <strong>{review.created ? dateToString(review.created) : "/"}</strong>
                  </div>
                  <div>
                    Updated: <strong>{review.updated ? dateToString(review.updated) : "/"}</strong>
                  </div>
                  <br />
                  <div>{reviewActions}</div>
                </Card>
              </div>
            );
          })}
        </div>
        {this.state.loading ? <FullSizeLoader /> : null}
      </div>
    );
  }
}

export default withNotifications(withPrompt(withRouter(Reviews)));
