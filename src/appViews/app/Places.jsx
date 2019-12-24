import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { firebaseCollections } from "constants/database";
import { placeStatuses } from "constants/statusCodes";

import {
  searchInObject,
  makeImageUrl,
  makeSortedArrayFromObject,
  sortArray,
  dateToString,
  takeFirstXElementsOfArray,
  hasScrolledToBottom,
} from "utils";
import { withCollection } from "higherOrderComponents";
import { setDocumentWithMergeInDb } from "db";

import Card from "appComponents/Cards/Card";
import SearchInput from "appComponents/Search/SearchInput";
import FullSizeLoader from "appComponents/Loaders/FullSizeLoader";
import SortingButtons from "appComponents/Sorting/SortingButtons";
import { AddPlace, EditPlace } from "appViews";
import { fileTypes } from "constants/media";

const scrollRowSize = 50;

class Places extends Component {
  constructor(props) {
    super(props);

    this.state = {
      placesDocuments: props.placesDocuments,
      filteredPlaces: makeSortedArrayFromObject(props.placesDocuments),
      renderedPlaces: takeFirstXElementsOfArray(
        makeSortedArrayFromObject(props.placesDocuments),
        scrollRowSize
      ),
      renderedCount: 0,
      loadingCollection: props.loadingCollection,
      editingPlace: null,
      editModalOpened: false,
      searchText: "",
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleEditClicked = this.handleEditClicked.bind(this);
    this.openEditingModal = this.openEditingModal.bind(this);
  }

  componentDidMount() {
    // for rendering more places once we scroll to the bottom
    window.addEventListener("scroll", () => this.handleScroll());
  }

  componentWillUnmount() {
    // for rendering more places once we scroll to the bottom
    window.removeEventListener("scroll", () => this.handleScroll());
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.loadingCollection === true &&
      this.props.loadingCollection === false &&
      this.props.match.params.id &&
      this.props.placesDocuments[this.props.match.params.id] &&
      this.state.editModalOpened === false
    ) {
      this.setState({ editModalOpened: true });
      this.openEditingModal(this.props.placesDocuments[this.props.match.params.id]);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = {};
    if (JSON.stringify(nextProps.placesDocuments) !== JSON.stringify(prevState.placesDocuments)) {
      newState.placesDocuments = nextProps.placesDocuments;
      newState.filteredPlaces = makeSortedArrayFromObject(nextProps.placesDocuments);
      if (prevState.searchText.length > 0) {
        // search with same query again, when new places come in
        let searchResults = searchInObject(prevState.searchText, nextProps.placesDocuments);
        newState.filteredPlaces = makeSortedArrayFromObject(searchResults);
      }
      newState.renderedPlaces = takeFirstXElementsOfArray(newState.filteredPlaces, scrollRowSize);
      newState.renderedCount = newState.renderedPlaces.length;

      if (prevState.editingPlace) {
        newState.editingPlace = nextProps.placesDocuments[prevState.editingPlace.id];
      }
    }
    if (nextProps.loadingCollection !== prevState.loadingCollection) {
      newState.loadingCollection = nextProps.loadingCollection;
    }
    return Object.keys(newState).length ? newState : null;
  }

  handleScroll() {
    if (hasScrolledToBottom()) {
      this.renderMoreRows();
    }
  }

  handleSearch(e) {
    let searchText = e.target.value;
    this.setState({ searchText });
    let searchResults = searchInObject(searchText, this.props.placesDocuments);
    const filteredPlaces = makeSortedArrayFromObject(searchResults);
    const renderedPlaces = takeFirstXElementsOfArray(filteredPlaces, scrollRowSize);

    this.setState({
      filteredPlaces,
      renderedPlaces,
    });
  }

  handleSort(fieldName, order) {
    const filteredPlaces = sortArray(this.state.filteredPlaces, fieldName, order);
    const renderedPlaces = takeFirstXElementsOfArray(filteredPlaces, scrollRowSize);
    this.setState({
      filteredPlaces,
      renderedPlaces,
    });
  }

  handleStatusChange(statusCode, placeId) {
    statusCode = parseInt(statusCode, 10);
    setDocumentWithMergeInDb(placeId, { status: statusCode }, firebaseCollections.PLACES)
      .then(() => {
        this.props.updateDocumentInCollection(
          placeId,
          { status: statusCode },
          firebaseCollections.PLACES
        );
        this.forceUpdate();
      })
      .catch(error => {
        this.forceUpdate();
        console.error(error);
      });
  }

  handleEditClicked(place) {
    this.props.history.push("/" + firebaseCollections.PLACES + "/" + place.id);
    this.setState({
      editingPlace: place,
    });
  }

  openEditingModal(place) {
    this.handleEditClicked(place);
    document.getElementById("hiddenEditPlaceModalOpener").click();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextState.filteredPlaces) !== JSON.stringify(this.state.filteredPlaces) ||
      JSON.stringify(nextProps.placesExtrasDocuments) !==
        JSON.stringify(this.props.placesExtrasDocuments) ||
      JSON.stringify(nextState.renderedPlaces) !== JSON.stringify(this.state.renderedPlaces) ||
      JSON.stringify(nextState.editingPlace) !== JSON.stringify(this.state.editingPlace) ||
      this.props.loadingCollection !== nextProps.loadingCollection
    ) {
      return true;
    } else {
      return false;
    }
  }

  renderMoreRows() {
    if (this.state.filteredPlaces.length > this.state.renderedCount) {
      const newrenderedCount = this.state.renderedCount + 50;
      let renderedPlaces = takeFirstXElementsOfArray(this.state.filteredPlaces, newrenderedCount);
      this.setState({
        renderedPlaces: renderedPlaces,
        renderedCount: newrenderedCount,
      });
    }
  }

  render() {
    let renderedPlaces = this.state.renderedPlaces;
    return (
      <div>
        <h2>Places</h2>
        <p>
          Displaying {renderedPlaces && renderedPlaces.length}/
          {Object.keys(this.props.placesDocuments).length || 0} documents&nbsp;
          <button
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#addPlaceModal"
            onClick={() => null}
          >
            <i className="fas fa-plus" /> Add Place
          </button>
        </p>
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <SearchInput onChange={this.handleSearch} />
          </div>
          <div className="col-sm-12 col-md-6">
            <SortingButtons
              onClick={(fieldName, order) => this.handleSort(fieldName, order)}
              fieldList={[
                { displayText: "Name", fieldName: "name" },
                { displayText: "ID", fieldName: "id" },
                { displayText: "Updated", fieldName: "updated" },
                { displayText: "Created", fieldName: "created" },
                { displayText: "Status", fieldName: "status" },
              ]}
            />
            {/* <FilterButtons
              onClick={(fieldName, order) => null}
              fieldList={[{ displayText: "Only enabled", fieldName: "status", fieldValue: "100" }]}
            /> */}
          </div>
        </div>

        <div>
          {this.props.loadingCollection ? <FullSizeLoader /> : null}
          {renderedPlaces.map((place, index) => {
            let placeId = place.id;
            let created = new Date(place.created);
            let updated = place.updated ? new Date(place.updated) : null;

            const placeStatusColor =
              place.status >= 100 && place.status < 200
                ? "success"
                : place.status >= 200
                ? "danger"
                : "warning";
            const placeStatusText =
              place.status >= 100 && place.status < 200
                ? `Enabled (${place.status})`
                : place.status >= 200
                ? `Disabled (${place.status})`
                : `Draft (${place.status})`;

            let placeActions = (
              <div>
                <div className="btn-group">
                  <button type="button" className={"btn btn-" + placeStatusColor}>
                    {placeStatusText}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-${placeStatusColor} dropdown-toggle dropdown-toggle-split`}
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Toggle Dropdown</span>
                  </button>
                  <div className="dropdown-menu">
                    {Object.keys(placeStatuses).map(statusCode => (
                      <a
                        className="dropdown-item"
                        onClick={e => this.handleStatusChange(statusCode, placeId)}
                        key={statusCode}
                      >
                        {statusCode + ": " + placeStatuses[statusCode]}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="btn-group">
                  <button
                    className="btn btn-outline-primary"
                    id={"editPlaceButton-" + placeId}
                    data-toggle="modal"
                    data-target="#editModal"
                    onClick={() => this.handleEditClicked(place)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            );

            return (
              <Card key={placeId} className="collectionListCard">
                <div className="row">
                  <div className="col-md-4">
                    <h3>
                      <strong>{index + 1}.</strong> <span>{place.name || place.id}</span>
                    </h3>
                    <div>
                      {place.photos && place.photos.length ? (
                        <img
                          className="placeImage"
                          src={makeImageUrl(
                            place.photos[0].id,
                            placeId,
                            firebaseCollections.PLACES,
                            533,
                            fileTypes.PHOTO
                          )}
                          alt="Place"
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div>
                      Name: <strong>{place.name}</strong>
                    </div>
                    <div>
                      Street: <strong>{place.street}</strong>
                    </div>
                    <div>
                      ID: <strong>{place.id}</strong>
                    </div>
                    <div>
                      Categories{" "}
                      <strong>
                        {place.categories &&
                          Object.keys(place.categories).map(category => category + " ")}
                      </strong>
                    </div>
                    <div>
                      Managers:
                      {place.roles ? (
                        <ol className="cardList">
                          {Object.keys(place.roles).map(userId => {
                            return this.props.usersDocuments[userId] ? (
                              <li key={userId}>
                                <strong>
                                  {this.props.usersDocuments[userId].email ||
                                    this.props.usersDocuments[userId].id}
                                </strong>
                              </li>
                            ) : null;
                          })}
                        </ol>
                      ) : (
                        <strong> /</strong>
                      )}
                    </div>
                    <div>
                      Rating:{" "}
                      <strong>
                        {place.rating > 0 ? Math.round(place.rating * 1000) / 1000 : " /"}
                      </strong>
                    </div>
                    <div>
                      Phone: <strong>{place.gsm || " /"}</strong>
                    </div>
                    <div>
                      Created: <strong>{created ? dateToString(created) : "/"}</strong>
                    </div>
                    <div>
                      Updated: <strong>{updated ? dateToString(updated) : "/"}</strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div>{placeActions}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <EditPlace currentPlace={this.state.editingPlace} />
        <AddPlace openEditingModal={this.openEditingModal} />
        <button
          className="btn btn-outline-primary"
          id="hiddenEditPlaceModalOpener"
          style={{ display: "none" }}
          data-toggle="modal"
          data-target="#editModal"
        />
      </div>
    );
  }
}

export default withCollection(firebaseCollections.PLACES)(withRouter(Places));
