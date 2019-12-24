import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { firebaseCollections } from "constants/database";
import { outfitStatuses } from "constants/statusCodes";

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
// import FilterButtons from "appComponents/Sorting/FilterButtons";
import { AddOutfit, EditOutfit } from "appViews";
import { fileTypes } from "constants/media";

const scrollRowSize = 50;

class Outfits extends Component {
  constructor(props) {
    super(props);

    this.state = {
      outfitsDocuments: props.outfitsDocuments,
      filteredOutfits: makeSortedArrayFromObject(props.outfitsDocuments),
      renderedOutfits: takeFirstXElementsOfArray(
        makeSortedArrayFromObject(props.outfitsDocuments),
        scrollRowSize
      ),
      renderedCount: 0,
      loadingCollection: props.loadingCollection,
      editingOutfit: null,
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
      this.props.outfitsDocuments[this.props.match.params.id] &&
      this.state.editModalOpened === false
    ) {
      this.setState({ editModalOpened: true });
      this.openEditingModal(this.props.outfitsDocuments[this.props.match.params.id]);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = {};
    if (JSON.stringify(nextProps.outfitsDocuments) !== JSON.stringify(prevState.outfitsDocuments)) {
      newState.outfitsDocuments = nextProps.outfitsDocuments;
      newState.filteredOutfits = makeSortedArrayFromObject(nextProps.outfitsDocuments);
      if (prevState.searchText.length > 0) {
        // search with same query again, when new places come in
        let searchResults = searchInObject(prevState.searchText, nextProps.outfitsDocuments);
        newState.filteredOutfits = makeSortedArrayFromObject(searchResults);
      }
      newState.renderedOutfits = takeFirstXElementsOfArray(newState.filteredOutfits, scrollRowSize);
      newState.renderedCount = newState.renderedOutfits.length;

      if (prevState.editingOutfit) {
        newState.editingOutfit = nextProps.outfitsDocuments[prevState.editingOutfit.id];
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
    let searchResults = searchInObject(searchText, this.props.outfitsDocuments);
    const filteredOutfits = makeSortedArrayFromObject(searchResults);
    const renderedOutfits = takeFirstXElementsOfArray(filteredOutfits, scrollRowSize);

    this.setState({
      filteredOutfits,
      renderedOutfits,
    });
  }

  handleSort(fieldName, order) {
    const filteredOutfits = sortArray(this.state.filteredOutfits, fieldName, order);
    const renderedOutfits = takeFirstXElementsOfArray(filteredOutfits, scrollRowSize);
    this.setState({
      filteredOutfits,
      renderedOutfits,
    });
  }

  handleStatusChange(statusCode, outfitId) {
    statusCode = parseInt(statusCode, 10);
    setDocumentWithMergeInDb(outfitId, { status: statusCode }, firebaseCollections.OUTFITS)
      .then(() => {
        this.props.updateDocumentInCollection(
          outfitId,
          { status: statusCode },
          firebaseCollections.OUTFITS
        );
        this.forceUpdate();
      })
      .catch(error => {
        this.forceUpdate();
        console.error(error);
      });
  }

  handleEditClicked(outfit) {
    this.props.history.push("/" + firebaseCollections.OUTFITS + "/" + outfit.id);
    this.setState({
      editingOutfit: outfit,
    });
  }

  openEditingModal(outfit) {
    this.handleEditClicked(outfit);
    document.getElementById("hiddenEditOutfitModalOpener").click();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(nextState.filteredOutfits) !== JSON.stringify(this.state.filteredOutfits) ||
      JSON.stringify(nextState.renderedOutfits) !== JSON.stringify(this.state.renderedOutfits) ||
      JSON.stringify(nextState.editingOutfit) !== JSON.stringify(this.state.editingOutfit) ||
      this.props.loadingCollection !== nextProps.loadingCollection
    );
  }

  renderMoreRows() {
    if (this.state.filteredOutfits.length > this.state.renderedCount) {
      const newrenderedCount = this.state.renderedCount + 50;
      let renderedOutfits = takeFirstXElementsOfArray(this.state.filteredOutfits, newrenderedCount);
      this.setState({
        renderedOutfits: renderedOutfits,
        renderedCount: newrenderedCount,
      });
    }
  }

  render() {
    let renderedOutfits = this.state.renderedOutfits;
    return (
      <div>
        <h2>Outfits</h2>
        <p>
          Displaying {renderedOutfits && renderedOutfits.length}/
          {Object.keys(this.props.outfitsDocuments).length || 0} documents&nbsp;
          <button
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#addOutfitModal"
            onClick={() => null}
          >
            <i className="fas fa-plus" /> Add Outfit
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
          {renderedOutfits.map((outfit, index) => {
            let outfitId = outfit.id;
            let created = new Date(outfit.created);
            let updated = outfit.updated ? new Date(outfit.updated) : null;

            const outfitStatusColor =
              outfit.status >= 100 && outfit.status < 200
                ? "success"
                : outfit.status >= 200
                ? "danger"
                : "warning";
            const outfitStatusText =
              outfit.status >= 100 && outfit.status < 200
                ? `Enabled (${outfit.status})`
                : outfit.status >= 200
                ? `Disabled (${outfit.status})`
                : `Draft (${outfit.status})`;

            let outfitActions = (
              <div>
                <div className="btn-group">
                  <button type="button" className={"btn btn-" + outfitStatusColor}>
                    {outfitStatusText}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-${outfitStatusColor} dropdown-toggle dropdown-toggle-split`}
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Toggle Dropdown</span>
                  </button>
                  <div className="dropdown-menu">
                    {Object.keys(outfitStatuses).map(statusCode => (
                      <a
                        className="dropdown-item"
                        onClick={e => this.handleStatusChange(statusCode, outfitId)}
                        key={statusCode}
                      >
                        {statusCode + ": " + outfitStatuses[statusCode]}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="btn-group">
                  <button
                    className="btn btn-outline-primary"
                    id={"editOutfitButton-" + outfitId}
                    data-toggle="modal"
                    data-target="#editOutfitModal"
                    onClick={() => this.handleEditClicked(outfit)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            );

            return (
              <Card key={outfitId} className="collectionListCard">
                <div className="row">
                  <div className="col-md-4">
                    <h3>
                      <strong>{index + 1}.</strong> <span>{outfit.title || outfit.id}</span>
                    </h3>
                    <div>
                      {outfit.coverPhoto ? (
                        <img
                          className="placeImage"
                          src={makeImageUrl(
                            outfit.coverPhoto.id,
                            outfitId,
                            firebaseCollections.OUTFITS,
                            533,
                            fileTypes.COVER
                          )}
                          alt="Outfit"
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div>
                      Title: <strong>{outfit.title}</strong>
                    </div>
                    <div>
                      Subtitle: <strong>{outfit.subtitle}</strong>
                    </div>
                    <div>
                      ID: <strong>{outfit.id}</strong>
                    </div>
                    <div>
                      Created: <strong>{created ? dateToString(created) : "/"}</strong>
                    </div>
                    <div>
                      Updated: <strong>{updated ? dateToString(updated) : "/"}</strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div>{outfitActions}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <EditOutfit currentOutfit={this.state.editingOutfit} />
        <AddOutfit openEditingModal={this.openEditingModal} />
        <button
          className="btn btn-outline-primary"
          id="hiddenEditOutfitModalOpener"
          style={{ display: "none" }}
          data-toggle="modal"
          data-target="#editOutfitModal"
        />
      </div>
    );
  }
}

export default withCollection(firebaseCollections.OUTFITS)(withRouter(Outfits));
